var current = {lat: 39.7392, lng: -104.9842};
var mapLayers = [];
var map = L.mapbox.map('map', 'avantassel.map-6y8nsvv5').setView([current.lat,current.lng], 5);
var markerLayer = L.mapbox.markerLayer(mapLayers).addTo(map);
var eventList = [];
var distance = 0;
var rdio = {playback_token:'GBNR61g4_____2R2cHlzNHd5ZXg3Z2M0OXdoaDY3aHdrbnd3dy5jb25jZXJ0dmliZS5jb21utNIqY5tbhfBHUz5mcuVO'};

function clearLayer(layerName){
    mapLayers=[];
    $('.poi-list').empty();
    markerLayer.setGeoJSON({
        type: 'FeatureCollection',
        features: mapLayers
    });
}

function JamBaseSearch(query){

    $.getJSON('/tools/jambase.php',{artist:true,name:query},
        function(data) {
            if(typeof data.Artists != 'undefined'){
                JamBaseEvents(query,data.Artists[0].Id);
            } else {
                //sad path
            }
        });

}

function JamBaseEvents(query,artistId){
	    $.getJSON('/tools/jambase.php',{events:true,artistId:artistId}, 
        function(data) {

            if(typeof data.Events != 'undefined'){
                $.each(data.Events,function(){
                	if(typeof this.Venue != 'undefined')
	                    addPOI_JB(this);
                });
                markerLayer.setGeoJSON({
                    type: 'FeatureCollection',
                    features: mapLayers
                });     
                Setlists(query);            
            } else {
                //sad path
            }
        },'jsonp');
}

function Setlists(query){
	    $.getJSON('/tools/setlistfm.php',{events:true,name:query},
        function(data) {

            if(typeof data.setlists.setlist != 'undefined'){
                $.each(data.setlists.setlist,function(){
                	if(typeof this.venue != 'undefined')
	                    addPOI_SL(this);
                });
                markerLayer.setGeoJSON({
                    type: 'FeatureCollection',
                    features: mapLayers
                });
                DrawPolyLine();
            } else {
                //sad path
            }
        },'jsonp');
}

function GetSentiment(query,lat,lng){
	    $.getJSON('/tools/alchemy.php',{name:query,lat:lat,lng:lng}, 
        function(data) {
            
            console.log(data);
            
        },'jsonp');
}

function addPOI_JB(poi){

	function getDesc(poi){
	    var html='<p>';
	    html += 'Sentiment: ';
	    
	    if(typeof poi.Venue.Address != 'undefined'){
	        if(poi.Venue.Address)
	            html+='<br/>'+poi.Venue.Address;
	        html+='<br/>'+poi.Venue.City+', '+poi.Venue.State;
	    }
	    html += '</p>';
	    return html;
	}
	
	if(eventList.length > 0)
		distance+=getDistanceFromLatLonInKm(eventList[eventList.length-1][0],eventList[eventList.length-1][1],parseInt(poi.Venue.Latitude),parseInt(poi.Venue.Longitude));
		
	eventList.push([parseFloat(poi.Venue.Latitude),parseFloat(poi.Venue.Longitude)]);
		
    mapLayers.push({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [parseFloat(poi.Venue.Longitude),parseFloat(poi.Venue.Latitude)]
        },
        properties: {
            'title': poi.Venue.Name+' on '+poi.Date,
            'marker-color': '#C79926',
            'marker-symbol':'music',
            'description': getDesc(poi)
        }
    });

    $('.poi-list').append('<li>'+getDesc(poi)+'</li>');
}

function addPOI_SL(poi){

	function getDesc(poi){
	    var html ='<p>';
	        html+='<br/>'+poi.venue.city['@name']+', '+poi.venue.city['@stateCode'];
	    html += '</p>';
	    var sets=0;
	    if(typeof poi.sets.set != 'undefined'){
		    $.each(poi.sets.set,function(){
		    	html += '<ul>';		    	
		    	if(sets>=2)
			    	html += '<div><b>Encore</b></div>';
		    	else
		    		html += '<div><b>'+this['@name']+'</b></div>';
		    		
			   $.each(this.song,function(){
			   	  if(!this.cover)
 			   	  	  html += '<li>'+this['@name']+' <a href="#" class="rdio-play" data-track="'+this['@name']+'"></a></li>'; 	
			   	  else
					  html += '<li class="cover" data-artist="'+this.cover['@name']+'">'+this['@name']+' <b>*</b> <a href="#" class="rdio-play" data-track="'+this['@name']+'"></a></li>'; 
			   }); 
			   html += '</ul>'; 
			   sets++;
		    });
	    }
	    return html;
	}
	
	if(eventList.length > 0)
		distance+=getDistanceFromLatLonInKm(eventList[eventList.length-1][0],eventList[eventList.length-1][1],parseInt(poi.venue.city.coords['@lat']),parseInt(poi.venue.city.coords['@long']));
		
	eventList.push([parseFloat(poi.venue.city.coords['@lat']),parseFloat(poi.venue.city.coords['@long'])]);
		
    mapLayers.push({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [parseFloat(poi.venue.city.coords['@long']),parseFloat(poi.venue.city.coords['@lat'])]
        },
        properties: {
            'title': poi.venue['@name']+' on '+poi['@eventDate'],
            'marker-color': '#2554C7',
            'marker-symbol':'music',
            'description': getDesc(poi)
        }
    });

    $('.poi-list').append('<li>'+getDesc(poi)+'</li>');
}

function getDistance(miles){
	if(miles)
		return distance*0.621371;
	else
		return distance;
}

function DrawPolyLine(){	
	if(eventList){
		var polyline = L.polyline(eventList,{color:'#115e67',weight:2,opacity:1,smoothFactor:10}).addTo(map);
		//zoom to bounds
    	map.fitBounds(polyline.getBounds());	
    }
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

/*
 * Replace all SVG images with inline SVG
 */
jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Replace image with new SVG
        $img.replaceWith($svg);
    });

});

$( document ).ready(function() {

    $('#search-btn').on('click',function() {
        if($('#q').val()!=''){
        	clearLayer();        
	        JamBaseSearch($('#q').val());                       
        }
    });
    
    $('.rdio-play').on('click',function(){
    	var track=$(this).data('track');
    	R.ready(function() { // just in case the API isn't ready yet
              R.request({
		        method: "search", 
		        content: {
		          artist: $('#q').val(), 
		          name: track,
		          types: "Track"
		        },
		        success: function(response) {
		          console.log(response.result.results);
		        },
		        error: function(response) {
		          console.log(response.message);
		        }
		      });
            });
	    return false;
    });
});