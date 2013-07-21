var current = {lat: 39.7392, lng: -104.9842};
var mapLayers = [];
//var map = L.mapbox.map('map', 'viceco.map-okwvdt12');
var map = L.mapbox.map('map', 'avantassel.map-6y8nsvv5').setView([current.lat,current.lng], 5);
var markerLayer = L.mapbox.markerLayer(mapLayers).addTo(map);

function getCraft(){
    var found=false;
    $.each(crafts,function(){
        if(this.name==current.craft)
            found=this;
    });
    return found;
}

function LoadCraft(craftName){
    var craft = getCraft();
    if(craft && craft.fs==true) {
        LoadFoursquare(craft);
    } else if(craft) {
        LoadMongo(craft);
    }
}

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
                JamBaseEvents(data.Artists[0].Id);
            } else {
                //sad path
            }
        });

}

function JamBaseEvents(artistId){
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
            } else {
                //sad path
            }
        },'jsonp');
}

function addPOI_JB(poi){

	function getDesc(poi){
	    var html='<p>';
	    if(typeof poi.Venue.Address != 'undefined'){
	        if(poi.Venue.Address)
	            html+='<br/>'+poi.Venue.Address;
	        html+='<br/>'+poi.Venue.City+', '+poi.Venue.State;
	    }
	    html += '</p>';
	    return html;
	}

    mapLayers.push({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [poi.Venue.Longitude,poi.Venue.Latitude]
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

	    if(typeof poi.sets.set != 'undefined'){
		    $.each(poi.sets.set,function(){
		    	html += '<ul>';
		    	html += '<div><b>'+this['@name']+'</b></div>';
			   $.each(this.song,function(){
			   	  if(!this.cover)
 			   	  	  html += '<li>'+this['@name']+' <span class="rdio-play"></span></li>';
			   	  else
					  html += '<li>'+this['@name']+' <b>*</b> <span class="rdio-play"></span></li>';
			   });
			   html += '</ul>';
		    });
	    }
	    return html;
	}

    mapLayers.push({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [poi.venue.city.coords['@long'],poi.venue.city.coords['@lat']]
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
            Setlists($('#q').val());

        }
    });
});