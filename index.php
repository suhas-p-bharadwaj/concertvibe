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
    <link href='httxp://api.tiles.mapbox.com/mapbox.js/v1.3.0/mapbox.ie.css' rel='stylesheet' >
    <![endif]-->
    <link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>  </head>
  <body>

    <div class="container-fluid">
      <div class="row-fluid">
          <!--Nav content-->
            <div class="header-bar" id="header">
              <div class="header-container">
                <h1 class="span2">
                  <a href="/" class="logo">ConcertVibe</a>
                </h1>
                <!--Search content-->
                <div id="search-box" class="span8" >
                  <div id="dialog">
                    <input id="q" name="q" placeholder="Enter a band" type="text" value="Phish">
                    <input id="search-btn" class="search btn primary" name="" type="submit" value="Go">
                  </div>
                </div>

                <nav id="secondary-menu" class="span2">
                  <ul class="clearfix">
                    <li><a href="#"><div class="main-text nav-link">About Us</div></a></li>
                  </ul>
                </nav>
            </div>
          </div>
        <!--Body content-->
        <div id="map" style="position:absolute; top:60px; bottom:0; width:100%;"></div>
        <!-- Sidebar -->
        <div class="sidebar">
          <!-- HTML for FED formatting, CLEAR WHEN API IS WORKIN' -->
          <div class="concert-meta leaflet-popup-content-wrapper">
            <h3>When and where</h3>
            <div class="marker-date">July 17th, 2013</div>
            <div class="marker-place">Alpharetta, GA</div>
            <div class="marker-title">Verizon Wireless Amphitheatre at Encore Park</div>
          </div>
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
          <div class="leaflet-popup-content-wrapper">
            <div class="marker-description">
              <h3>Setlist</h3>
               <ol>
                  <h4>Set One:</h4>
                  <li>Kill Devil Falls <a class="rdio-play"></a></li>
                  <li>Mound <a class="rdio-play"></a></li>
                  <li>Bathtub Gin <a class="rdio-play"></a></li>
                  <li>Army of One <a class="rdio-play"></a></li>
                  <li>Rift <a class="rdio-play"></a></li>
                  <li>Horn <a class="rdio-play"></a></li>
                  <li>Possum <a class="rdio-play"></a></li>
                  <li>Pebbles and Marbles <a class="rdio-play"></a></li>
                  <li>Ocelot <a class="rdio-play"></a></li>
                  <li>Cavern <a class="rdio-play"></a></li>
                  <li>Run Like an Antelope <a class="rdio-play"></a></li>
               </ol>
               <ol>
                  <h4>Set Two:</h4>
                  <li>Rock and Roll <b>*</b> <a class="rdio-play"></a></li>
                  <li>Heartbreaker <a class="rdio-play"></a></li>
                  <li>Makisupa Policeman <a class="rdio-play"></a></li>
                  <li>Chalk Dust Torture <a class="rdio-play"></a></li>
                  <li>Wilson <a class="rdio-play"></a></li>
                  <li>Tweezer <a class="rdio-play"></a></li>
                  <li>Silent in the Morning <a class="rdio-play"></a></li>
                  <li>Birds of a Feather <a class="rdio-play"></a></li>
                  <li>Joy <a class="rdio-play"></a></li>
                  <li>Harry Hood <a class="rdio-play"></a></li>
                  <li>Character Zero <a class="rdio-play"></a></li>
               </ol>
               <ol>
                  <div><b>Set Two:</b></div>
                  <li>A Day in the Life <b>*</b> <a class="rdio-play"></a></li>
                  <li>Tweezer Reprise <a class="rdio-play"></a></li>
               </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>



  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" ></script>
  <script src="https://raw.github.com/rdio/jquery.rdio.js/master/jquery.rdio.min.js" ></script>

  <script src="/js/bootstrap.js"></script>
  <script src="/js/map.js"></script>

</body>
</html>
