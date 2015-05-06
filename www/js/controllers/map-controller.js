app.controller('MapController', ['$scope', '$interval', 'leafletData', 'Waypoints', '$cordovaGeolocation',
  function($scope, $interval, leafletData, Waypoints, $cordovaGeolocation) {

    // Set initial view of map on San Francisco with zoom level 15
    leafletData.getMap().then(function(map) {
      map.setView(new L.LatLng(40, -150), 15);
    });

    var layer = L.TileLayer.maskCanvas({
     radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
     useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
     color: '#00000',          // The color of the fog layer
     opacity: 0.8,             // Opacity of the fog area
     noMask: false,            // True results in normal (filled) circled, false is for transparent circles
     lineColor: '#A00'         // Color of the circle outline if noMask is true
    });

    // Waypoints.getWaypoints(function(responseData){
    //   console.log(responseData);
      // layer.setData(responseData);
      // leafletData.getMap().then(function(map) {
      //   map.addLayer(layer);
      // });
    // });

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;
        leafletData.getMap().then(function(map) {
          map.setView(new L.LatLng(lat, long), 15);
          layer.setData([[lat, long]]);
          map.addLayer(layer);
        });
      }, function(err) {
        // error
      });


}]);
