angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter) {

    var zoomLayer = L.TileLayer.maskCanvas({
     radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
     useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
     color: '#00000',          // The color of the fog layer
     opacity: 0.8,             // Opacity of the fog area
     noMask: false,            // True results in normal (filled) circled, false is for transparent circles
     lineColor: '#A00'         // Color of the circle outline if noMask is true
    });

    var wideLayer = L.TileLayer.maskCanvas({
     radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
     useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
     color: '#00000',          // The color of the fog layer
     opacity: 0.8,             // Opacity of the fog area
     noMask: false,            // True results in normal (filled) circled, false is for transparent circles
     lineColor: '#A00'         // Color of the circle outline if noMask is true
    });

    // Creates a map in the div #map
    L.mapbox.accessToken = mapboxAccessToken;
    var widemap = L.mapbox.map('widemap', mapboxLogin, {
      zoomControl: false
    });var widemap = L.mapbox.map('widemap', mapboxLogin, {
      zoomControl: false
    });

    window.localStorage.waypoints = null;
    var loadData = JSON.parse(window.localStorage.waypoints);

    if (loadData === null) {
      loadData = [[38, -100]];
    }

    var firstView = loadData[loadData.length - 1];


    widemap.setView(firstView, 5);

    widemap.touchZoom.disable();
    widemap.doubleClickZoom.disable();

    //waypoints are retreived from server and entered into local storage.
    Waypoints.getWaypoints(function(data) {
      window.localStorage.waypoints = (JSON.stringify(data.waypoints));
      //sets watch position that calls the map service when a new position is received.
      navigator.geolocation.watchPosition(function(position) {
        widemap.setView([position.coords.latitude, position.coords.longitude], 18);
        CoordinateFilter.handleCoordinate(position);
      });
    });

    // on change in localStorage, rerender map.

    $scope.$on('storage', function() {
      var waypoints = JSON.parse(window.localStorage.waypoints);
      widemap.removeLayer(zoomLayer);
      zoomLayer.setData(waypoints);
      widemap.addLayer(zoomLayer);
    });

  });
