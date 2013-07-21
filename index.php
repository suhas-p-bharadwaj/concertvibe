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
    <script src="//www.rdio.com/api/api.js?client_id=ToUS9OYepTGDQ6fRIUJn7A"></script>
    <link href='httxp://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.ie.css' rel='stylesheet' >
    <link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>  
    <script src="/js/rdio-utils.js"></script>
 </head>
  <body>
    <div class="container-fluid">
      <div class="row-fluid">
          <!--Nav content-->
            <div class="header-bar" id="header">
              <div class="header-container">
                <h1 class="logo-header">
                  <a href="/" class="logo">ConcertVibe</a>
                </h1>
                <!--Search content-->
                <div id="search-box">
                  <div id="dialog">
                    <input id="q" name="q" placeholder="Search for your a band" type="text" value="Phish">
                    <button id="search-btn" class="search btn primary" name="" type="submit" value="Go">
                      <img src="images/search.svg" alt="" />
                    </button>
                  </div>
                </div>
            </div>
          </div>
        <!--Body content-->
        <div id="map" style="position:absolute; top:0; bottom:0; width:100%;"></div>
        
        <!-- Sidebar -->
        <div class="sidebar">
          
          <div id="content">
	          
          </div>
          
          <div class="leaflet-popup-content-wrapper">
              <a href="#"><h3 class="about-header">About</h3></a>
              <p class="about-section">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, commodi, harum, atque quasi saepe provident placeat blanditiis quos minus nihil sed maiores aliquid temporibus nobis non! Iure consequuntur laudantium quam?
              </p>
          </div>
        </div>
      </div>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
        
    <script src="/js/bootstrap.js"></script>
    <script src="/js/map.js"></script>

</body>

</html>
