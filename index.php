<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=7,IE=9">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">

  <title>ConcertVibe</title>
  
  <link rel="stylesheet" href="/css/bootstrap-responsive.min.css">
  <link rel="stylesheet" href="/css/bootstrap.min.css">
  <link rel="stylesheet" href="/css/style.css">
  
  <!-- Load Leaflet+MapBox CSS/JS -->
  <script src='http://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.js'></script>
  <link href='http://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.css' rel='stylesheet' />
  <!--[if lte IE 8]>
    <link href='http://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.ie.css' rel='stylesheet' >
  <![endif]-->
    <script src="//www.rdio.com/api/api.js?client_id=ToUS9OYepTGDQ6fRIUJn7A"></script>
    <link href='httxp://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.ie.css' rel='stylesheet' >
    <link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>  
    <script src="/js/rdio-utils.js"></script>
 </head>
  <body class="results">
    <div class="container-fluid">
      <div class="row-fluid">
          <!--Nav content-->
            <div class="header-bar" id="header">
              <h1 class="logo-header">
                <a href="/" class="logo">ConcertVibe</a>
              </h1>
              <!--Search content-->
              <div id="search-box">
                <div id="dialog">
                  <input id="q" name="q" placeholder="Search for a band that's touring..." type="text" value="<?=isset($_GET['q'])?$_GET['q']:''?>">
                  <button id="search-btn" class="search btn primary" name="" type="submit" value="Go">
                    <img src="images/search.svg" class="svg" alt="search" />
                  </button>
                </div>
              </div>
          </div>
        <!--Body content-->
        <div id="map" style="position:absolute; top:0; bottom:0; width:100%;"></div>

        <!-- Sidebar -->
        <div id="" class="sidebar off">
          <div class="progress progress-striped active">
			  <div class="bar hide" style="width: 10%;"><span class="what">Loading...</span></div> 
		  </div>
          <div id="player">
	          
          </div>
		  <div id="content">
		  
          </div>

          <div class="leaflet-popup-content-wrapper">
              <a href="#"><h3 class="about-header">About</h3></a>
              <p class="about-section">
              	Special thanks for <a href="http://twitter.com#musichackday">#musichackday</a> and the following APIs:
                <ul>
	                <li>Rdio API</li>
	                <li>Alchemy API</li>
	                <li>the EchoNest API</li>
	                <li>Twitter API</li>
	                <li>Jambase API</li>
	                <li>Setlist.fm API</li>
                </ul>
              </p>
          </div>
        </div>
      </div>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
        
    <script src="//www.rdio.com/api/api.js?client_id=ToUS9OYepTGDQ6fRIUJn7A"></script>

    <script src="/js/bootstrap.js"></script>
    <script src="/js/map.js"></script>

	<?
	if(isset($_GET['q'])){
		echo '<script>$(document).ready(function(){clearLayer();JamBaseSearch("'.$_GET['q'].'");});</script>';
	}		
	?>
	
</body>
</html>
