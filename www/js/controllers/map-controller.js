angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter) {

    var layer = L.TileLayer.maskCanvas({
     radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
     useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
     color: '#00000',          // The color of the fog layer
     opacity: 0.8,             // Opacity of the fog area
     noMask: false,            // True results in normal (filled) circled, false is for transparent circles
     lineColor: '#A00'         // Color of the circle outline if noMask is true
    });

    // Creates a map in the div #map
    L.mapbox.accessToken = mapboxAccessToken;
    var map = L.mapbox.map('map', mapboxLogin);

    // Retreived waypoints from server insert into local storage.
    Waypoints.getWaypoints(function(data) {
      window.localStorage.waypoints = (JSON.stringify(data.waypoints));
      //sets watch position that calls the map service when a new position is received.
      navigator.geolocation.watchPosition(function(position) {
        CoordinateFilter.handleCoordinate(position);
      });
    });

    // Rerender map for any change in localStorage.

    $scope.$on('storage', function() {
      var waypoints = JSON.parse(window.localStorage.waypoints);
      map.removeLayer(layer);
      layer.setData(waypoints);
      map.addLayer(layer);
    });

  });
