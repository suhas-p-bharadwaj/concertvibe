var current = {lat: 39.7392, lng: -104.9842};
//var current = {lat: 43.55, lng: 7.0166667};
var eventList = [], mapLayers = [];
var map = L.mapbox.map('map', 'avantassel.map-6y8nsvv5');
var centered = false;
var markerLayer = L.mapbox.markerLayer(mapLayers).addTo(map);
var distance_jb = 0, distance_sl = 0, lastTrack ='';
var songDuration;

function clearLayer(layerName){
    mapLayers=[];
    eventList=[];
    DrawPolyLine();
    $('.poi-list').empty();
    $('.sidebar #content').empty();
    $('#song-progress.progress .bar').css('width','0%');
    markerLayer.setGeoJSON({
        type: 'FeatureCollection',
        features: mapLayers
    });
}

function JamBaseSearch(query){

	$('#song-progress.progress .bar').css('width','20%');

    $.getJSON('/tools/jambase.php',{artist:true,name:query},
        function(data) {
            if(data && typeof data.Artists != 'undefined' && data.Artists.length > 0){
            	var id=null;
            	$.each(data.Artists,function(){
	            	if(this.Name.toLowerCase()==query.toLowerCase())
	            		id=this.Id;
            	});
            	if(!this.id)
	                JamBaseEvents(query,data.Artists[0].Id);
            } else {
                Setlists(query);
            }
        });

}

function JamBaseEvents(query,artistId){
		$('#song-progress.progress .bar').css('width','40%').find('.what').html('Getting the Events...');
	    $.getJSON('/tools/jambase.php',{events:true,artistId:artistId},
        function(data) {

            if(data && typeof data.Events != 'undefined' && data.Events.length > 0){
            	$('.sidebar #content').append('<h3>Upcoming Shows</h3><div class="miles-up"></div>');
                $.each(data.Events,function(){
                	if(typeof this.Venue != 'undefined')
	                    addPOI_JB(this);
                });
                markerLayer.setGeoJSON({
                    type: 'FeatureCollection',
                    features: mapLayers
                });
                $('.miles-up').html(Math.round(distance_jb*0.621371)+' miles to go');
                Setlists(query);
            } else {
                Setlists(query);
            }
        },'jsonp');
}

function EchoNest(loc){
		$('#song-progress.progress .bar').show().css('width','60%').find('.what').html('Getting the EchoNest...');
	    $.getJSON('/tools/echonest.php',{location:loc},
        function(data) {

            if(data && typeof data.response != 'undefined' && data.response.artists.length > 0){
	            var html='<div class="leaflet-popup-content-wrapper"><h3>Artists from '+loc+'</h3><ol>';
            	$.each(data.response.artists,function(){
                	html+='<li><a href="#" class="rdio-play artist-only">'+this.name+'</a></li>';
                });
                html+='</ol></div>';
                $('.sidebar #content').append(html);
                $('#song-progress.progress .bar').css('width','100%').fadeOut();
            } 
        },'jsonp');
}

function Setlists(query){
		$('#song-progress.progress .bar').css('width','60%').find('.what').html('Getting the Setlists...');
	    $.getJSON('/tools/setlistfm.php',{events:true,name:query},
        function(data) {

            if(data && typeof data.setlists.setlist != 'undefined'){
            	$('.sidebar #content').append('<h3>Past Shows</h3><div class="miles-past"></div>');
                $.each(data.setlists.setlist,function(){
                	if(typeof this.venue != 'undefined')
	                    addPOI_SL(this);
                });
                markerLayer.setGeoJSON({
                    type: 'FeatureCollection',
                    features: mapLayers
                });
                $('.miles-past').html(Math.round(distance_sl*0.621371)+' miles so far');
                $('a.cover').tooltip();
                DrawPolyLine();
            } else {
                DrawPolyLine();
            }
        },'jsonp');
}


function GetSentiment(query,loc,lat,lng){
		
		var sentiment = '<div><h4>Show Vibe</h4><div id="alchemy" class="progress progress-striped"><div class="bar bar-success" data-toggle="tooltip" style="width: 33.33%">Getting</div><div class="bar bar-info" data-toggle="tooltip" style="width: 33.33%">the</div><div class="bar bar-danger" data-toggle="tooltip" style="width: 33.33%">Vibe</div></div></div>';				
				$('.marker-info').append(sentiment);

	    $.getJSON('/tools/alchemy.php',{name:query,loc:loc,lat:lat,lng:lng},
        function(data) {
            var html = '<div><h3>Show Vibe</h3>';
            
            if(data.results && data.results.length>0){
				$.each(data.results,function(){
					html += '<div>\
	                <img src="/images/'+this.type+'.svg" class="svg face-'+this.type+' twitter-face">\
	                <a href="http://twitter.com/'+this.screen_name+'" class="twitter-handle">@'+this.screen_name+'</a>\
	                <p class="twitter-tweet">'+this.text+'</p>\
	              </div>';
				});
				html += '</div>';
				$('.sidebar #content').append(html);
				updateVibeImages();
				
				var sentiment = '<div class="leaflet-popup-content-wrapper"><h4>Show Vibe</h4><div id="alchemy" class="progress">\
				  <div class="bar bar-success" data-toggle="tooltip" style="width: '+Math.round((data.types['positive']/data.results.length)*100)+'%;" title="Good Vibes: '+Math.round((data.types['positive']/data.results.length)*100)+'%"></div>\
				  <div class="bar bar-info" data-toggle="tooltip" style="width: '+Math.round((data.types['neutral']/data.results.length)*100)+'%;" title="Neutral Vibes:'+Math.round((data.types['neutral']/data.results.length)*100)+'%"></div>\
				  <div class="bar bar-danger" data-toggle="tooltip" style="width: '+Math.round((data.types['negative']/data.results.length)*100)+'%;" title="Bad Vibes:'+Math.round((data.types['negative']/data.results.length)*100)+'%"></div>\
				</div></div>';				
				$('.marker-info #alchemy').parent().remove();
				$('.marker-info').append(sentiment);
				$('.bar').tooltip();
			}

        },'jsonp');
}

function addPOI_JB(poi){

	var d = new Date(poi.Date);
	poi.Date = d.getMonth()+'/'+d.getDate()+'/'+d.getFullYear();

	$('.sidebar #content').append('<div class="marker-place">'+poi.Date+' '+poi.Venue.City+', '+poi.Venue.State+'</div>');

	function getDesc(poi){
		var html ='<div class="marker-info leaflet-popup-content-wrapper"><h3>Show Info</h3><div class="concert-meta">\
            <div class="marker-date">'+poi.Date+'</div>\
            <div class="marker-place">'+poi.Venue.City+', '+poi.Venue.State+'</div>\
            <div class="marker-title">'+poi.Venue.Name+'</div>\
          </div></div>';
	    return html;
	}

	if(eventList.length > 0)
		distance_jb+=getDistanceFromLatLonInKm(eventList[eventList.length-1][0],eventList[eventList.length-1][1],parseInt(poi.Venue.Latitude),parseInt(poi.Venue.Longitude));

	eventList.push([parseFloat(poi.Venue.Latitude),parseFloat(poi.Venue.Longitude)]);

	/*
if(!centered){
		map.setView([parseFloat(poi.Venue.Latitude),parseFloat(poi.Venue.Longitude)], 5);
		centered=true;
	}
*/
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
		var html ='<div class="marker-info leaflet-popup-content-wrapper"><h3>Show Info</h3><div class="concert-meta">\
            <div class="marker-date">'+poi.Date+'</div>\
            <div class="marker-place">'+poi.venue.city['@name']+', '+poi.venue.city['@stateCode']+'</div>\
            <div class="marker-title">'+poi.venue['@name']+'</div>\
          </div></div>';

	    if(poi.sets != "" && typeof poi.sets.set != 'undefined'){
	    	html += '<div class="hide marker-description leaflet-popup-content-wrapper">\
              <h3>Setlist</h3>';

		    $.each(poi.sets.set,function(){
		    	html += '<ol>';
		    	if(this['@name']){
			    	if(this['@encore'])
				    	html += '<h4>Encore '+this['@encore']+'</h4>';
			    	else
			    		html += '<h4>'+this['@name']+'</h4>';
		    	} else {
			    	html += '<h4>Set One</h4>';
		    	}
		    	if(this.song){
				   $.each(this.song,function(){
				   	  if(!this.cover)
	 			   	  	  html += '<li><a href="#" class="rdio-play">'+this['@name']+'</a></li>';
				   	  else
						  html += '<li class="cover"><a href="#" class="rdio-play">'+this['@name']+'</a> <a href="#" class="cover" data-toggle="tooltip" title="'+this.cover['@name']+'|'+this['@name']+'">*</a></li>';
				   });
			   }
			   html += '</ol>';
		    });
			html += '</div>';
	    }

	    return html;
	}

	if(eventList.length > 0)
		distance_sl+=getDistanceFromLatLonInKm(eventList[eventList.length-1][0],eventList[eventList.length-1][1],parseInt(poi.venue.city.coords['@lat']),parseInt(poi.venue.city.coords['@long']));

	eventList.push([parseFloat(poi.venue.city.coords['@lat']),parseFloat(poi.venue.city.coords['@long'])]);
	/*
if(!centered){
		map.setView([parseFloat(poi.venue.city.coords['@lat']),parseFloat(poi.venue.city.coords['@long'])], 5);
		centered=true;
	}
*/

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

function DrawPolyLine(){
	var polyline = L.polyline(eventList,{color:'#115e67',weight:2,opacity:1,smoothFactor:10}).addTo(map);
	if(eventList.length > 0){
		//zoom to bounds
    	map.fitBounds(polyline.getBounds());
    }
    centered=false;
    $('#song-progress.progress .bar').css('width','100%').fadeOut();
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
function updateVibeImages(){
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
}

function updatePlaying(result){
	console.log(result);
	$('#player').empty().css('border-bottom','1px dotted balck').append('<div class="leaflet-popup-content-wrapper"><h3>Now Playing</h3><img src="'+result.icon+'"/><br/>Artist: '+result.artist+'<br/>Album: '+result.album+'<br/>Song: '+result.name+'<h3>&nbsp;</h3></div>');
	songDuration=result.duration;
	$('#song-progress.progress .bar').show().css({'width':'0%','color':'#000','text-align':'right'}).show().find('.what').html('Playing '+result.name);
}
function Rdio(self,song,artist){

	var ttype=(!song || song == '')?'Artist':'Track';

	R.ready(function() {
	  R.player.on("change:position", function(newValue) {
		  if(songDuration)
			  $('#song-progress.progress .bar').css('width',((newValue/songDuration)*100)+'%').find('.what').html(newValue+'/'+songDuration);
  		});

      R.request({
        method: "search",
        content: {
          query: song+' '+artist,
          types: ttype
        },
        success: function(response) {
          $('.sidebar #content').find('div.player').remove();
          var result=response.result.results[0];
          var key;

          if(ttype=='Track'){
	          $.each(response.result.results,function(){
		         if(this.name.toLowerCase()==song.toLowerCase())
		           result = this;
	          });
	          key=result.key
          } else if(result.topSongsKey){
	          key=result.topSongsKey;
          } else {
	          key=result.key
          }

          if(lastTrack==result.key)
			R.player.play();
		  else
		  	R.player.play({source:key});

          lastTrack=key;

          if(!result.artist){
	          setTimeout(function(){
		      	var track = R.player.playingTrack();
		      	if(track.attributes)
				  	updatePlaying(track.attributes);
	          }, 1000);

          } else {
          	updatePlaying(result);
          }

          $(self).addClass('playing');
          $(self).parent().prepend('<div class="player"></div>');
        },
        error: function(response) {

        }
      });
    });
}

function Search(){
	$('#song-progress.progress .bar').show().css('width','10%');
     	clearLayer();
      JamBaseSearch($('#q').val());
      $('body').addClass('results');
}
$( document ).ready(function() {

    $('#search-btn').on('click',function() {
        if($('#q').val()!=''){
        	document.location.href='/'+encodeURIComponent($('#q').val());
        	
        }
    });

    updateVibeImages();

    $('#song-progress.progress .bar').on('click',function(){
	    R.player.togglePause();
    });

    $('#q').on('keydown',function(e){
	    if(e.keyCode==13)
		    $('#search-btn').click();
    });

    markerLayer.on('click',function(e,d){
	    var content = $(e.layer._popup._content);

	    $(content).find('.marker-description').removeClass('hide');
	    $('.sidebar #content').empty().append($(content));

	    var loc = $(content).find('.marker-place').html();
	    if(loc)
		    EchoNest(loc);
		GetSentiment($('#q').val(),loc,e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0]);
	    return false;
    });

    $('.sidebar #content').on('click','li.cover a.cover',function(){
    	var tit = $(this).attr('title').split('|');
    	if(tit.length==2)
		    Rdio(this,tit[1],tit[0]);
    });

    $('.sidebar #content').on('click','a.rdio-play',function(){
    	if($(this).hasClass('playing')){
	    	R.player.pause();
	    	$('#song-progress.progress .bar').fadeOut();
	    	$('.sidebar #content a.rdio-play').removeClass('playing');
	    	$('.sidebar #content').find('div.player').remove();
	    	return;
		}
		if($(this).hasClass('artist-only'))
			Rdio(this,'',$(this).html());
		else
	    	Rdio(this,$(this).html(),$('#q').val());
	    return false;
    });

});