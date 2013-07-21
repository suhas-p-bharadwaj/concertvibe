var current = {lat: 39.7392, lng: -104.9842};
var mapLayers = [];
var map = L.mapbox.map('map', 'avantassel.map-6y8nsvv5').setView([current.lat,current.lng], 5);
var markerLayer = L.mapbox.markerLayer(mapLayers).addTo(map);
var eventList = [];
var distance = 0;
var lastTrack ='';

function clearLayer(layerName){
    mapLayers=[];
    $('.poi-list').empty();
    $('.sidebar #content').empty();
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
            	$('.sidebar #content').append('<h3>Upcoming Shows</h3>');
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
            	$('.sidebar #content').append('<h3>Past Shows</h3>');
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
            
            /*
<div class="leaflet-popup-content-wrapper">
            <h3>Audience reaction</h3>
              <div>
                <img src="images/happy.svg" class="svg face-happy twitter-face" alt="They sucked.">
                <a href="TWITTER_HANDLE" class="twitter-handle">@asshole</a href="TWITTER_HANDLE">
                <p class="twitter-tweet">So good. So goooooood.</p>
              </div>
              <div>
                <img src="images/neutral.svg" class="svg face-neutral twitter-face" alt="They sucked.">
                <a href="TWITTER_HANDLE" class="twitter-handle">@mehIdontknow</a href="TWITTER_HANDLE">
                <p class="twitter-tweet">Unimpressed. I must say.</p>
              </div>
              <div>
                <img src="images/sad.svg" class="svg face-sad twitter-face" alt="They sucked.">
                <a href="TWITTER_HANDLE" class="twitter-handle">@thiswasmyfirstshow</a href="TWITTER_HANDLE">
                <p class="twitter-tweet">I fell asleep in the venue bathroom, woke up with a needle in me.</p>
              </div>
          </div>
*/
          
            console.log(data);
            
        },'jsonp');
}

function addPOI_JB(poi){
	
	var d = new Date(poi.Date);
	poi.Date = d.getMonth()+'/'+d.getDate()+'/'+d.getFullYear();
	
	$('.sidebar #content').append('<div class="marker-place">'+poi.Date+' '+poi.Venue.City+', '+poi.Venue.State+'</div>');
	
	function getDesc(poi){
		var html ='<div class="concert-meta">\
            <div class="marker-date">'+poi.Date+'</div>\
            <div class="marker-place">'+poi.Venue.City+', '+poi.Venue.State+'</div>\
            <div class="marker-title">'+poi.Venue.Name+'</div>\
          </div>';
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
            'title': '',
            'marker-color': '#C79926',
            'marker-symbol':'music',
            'description':getDesc(poi)
        }
    });

    $('.poi-list').append('<li>'+getDesc(poi)+'</li>');
}

function addPOI_SL(poi){
	
	var d = new Date(poi['@eventDate'].substring(6, 10)+'-'+poi['@eventDate'].substring(3, 5)+'-'+poi['@eventDate'].substring(0, 2));
	poi.Date = d.getMonth()+'/'+d.getDate()+'/'+d.getFullYear();
	
	$('.sidebar #content').append('<div class="marker-place">'+poi.Date+' '+poi.venue.city['@name']+', '+poi.venue.city['@stateCode']+'</div>');
	
	function getDesc(poi){
		
		var html ='<div class="concert-meta">\
            <div class="marker-date">'+poi.Date+'</div>\
            <div class="marker-place">'+poi.venue.city['@name']+', '+poi.venue.city['@stateCode']+'</div>\
            <div class="marker-title">'+poi.venue['@name']+'</div>\
          </div>';
          
	    var sets=0;
	    if(typeof poi.sets.set != 'undefined'){
	    	
	    	html += '<div class="hide marker-description">\
              <h3>Setlist</h3>';
              
		    $.each(poi.sets.set,function(){
		    	html += '<ol>';
		    	if(sets>=2)
			    	html += '<h4>Encore</h4>';
		    	else
		    		html += '<h4>'+this['@name']+'</h4>';
		    		
			   $.each(this.song,function(){
			   	  if(!this.cover)
 			   	  	  html += '<li><a href="#" class="rdio-play">'+this['@name']+'</a></li>'; 	
			   	  else
					  html += '<li class="cover" data-artist="'+this.cover['@name']+'"><a href="#" class="rdio-play">'+this['@name']+' <b>*</b></a></li>'; 
			   }); 
			   html += '</ol>'; 
			   sets++;
		    });
			html += '</div>';
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
            'title': '',
            'marker-color': '#2554C7',
            'marker-symbol':'music',
            'description':getDesc(poi)
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

function pausePlayer(){
	R.player.pause();
}

$( document ).ready(function() {

    $('#search-btn').on('click',function() {
        if($('#q').val()!=''){
        	clearLayer();        
	        JamBaseSearch($('#q').val());                       
        }
    });
    
    markerLayer.on('click',function(e,d){
	    var content = $(e.layer._popup._content);
	    
	    $(content).find('.marker-description').removeClass('hide');
	    $('.sidebar #content').empty().append($(content));
	    
	    return false;	    
    });
    		      
    $('.sidebar #content').on('click','a.rdio-play',function(){
    	if($(this).hasClass('playing')){
	    	R.player.pause();
	    	$('.sidebar #content a.rdio-play').removeClass('playing');
	    	$('.sidebar #content').remove('div.player');		        
	    	return;
    	}    	
    	
    	var self=this;
    	R.ready(function() { // just in case the API isn't ready yet
              R.request({
		        method: "search", 
		        content: {
		          query: $('#q').val()+' '+$(self).html(), 
		          types: "Track"
		        },
		        success: function(response) {
		        $('.sidebar #content').remove('div.player');		        
		          if(lastTrack==response.result.results[0].key)
		          	R.player.play();
		          else
			        R.player.play({source:response.result.results[0].key});
		          lastTrack=response.result.results[0].key;		
		          $(self).addClass('playing');          
		          $(self).parent().prepend('<div class="player"></div>');
		        },
		        error: function(response) {
		          console.log(response.message);
		        }
		      });
            });
	    return false;
    });
});