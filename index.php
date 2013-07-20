<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=7,IE=9">   
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">

  <title>ConcertVibe</title>

  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/bootstrap-responsive.min.css">

  <!-- Load Leaflet+MapBox CSS/JS -->
  <script src='http://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.js'></script>
  <link href='http://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.css' rel='stylesheet' />
  <!--[if lte IE 8]>
    <link href='http://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.ie.css' rel='stylesheet' >
  <![endif]-->
  
</head>
  <body>
    
    <div class="container-fluid">
      <div class="row-fluid">
        
        <div class="span10">
          
          <!--Nav content-->
          <div class="header-bar" id="header">
            <div class="container clearfix">
            <div class="full-col">
            <h1>
              <a href="/"><div class="white" id="logo">ConcertVibe&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></a>
            </h1>

            <nav id="main-menu">
            <ul class="clearfix">
                
            </ul>
            </nav>
            <nav id="secondary-menu">
            <ul class="clearfix">
              <li><a href="/" onclick="if ($('#q').is(':visible')) { $('#search-box').slideUp('fast'); } else { $('#search-box').slideDown('fast',function() {$('input[type=text]', this).focus()}); }; return false;"><div class="main-text">Search</div></a></li>
              <li><a href="#"><div class="main-text">About Us</div></a></li>
            </ul>
            </nav>

            </div>
            </div>
        </div>
        <!--Search content-->
        <div id="search-box" >
          <div class="container clearfix">
          <div class="full-col">
          <div id="dialog">
          
          <input id="q" name="q" placeholder="Enter a band" type="text" value="Phish">
          <input id="search-btn" class="search btn primary" name="" type="submit" value="Go">
          
          </div>
          </div>
          </div>
        </div>
          <!--Body content-->
          <div id="map" style="position:absolute; top:60px; bottom:0; width:100%;"></div>
        </div>        
      </div>
    </div>
    
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
    <script src="https://raw.github.com/rdio/jquery.rdio.js/master/jquery.rdio.min.js" ></script>
        
    <script src="/js/bootstrap.js"></script>
    <script src="/js/map.js"></script>
  
  </body>
</html>
