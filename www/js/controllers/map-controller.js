angular.module('unearth.controllers', [])
  .controller('MapController', function($scope, $interval, leafletData, Waypoints, $cordovaGeolocation) {

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

      // Geolocation options: timeout = time before error if no GPS data is returned
      //                      enableHighAccuracy = notification that asks user to turn on wifi for more accuracy
      var posOptions = {timeout: 10000, enableHighAccuracy: false};

      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;
          // Set view to current geolocation with zoom level 15 and place a transparent point at that location
          leafletData.getMap().then(function(map) {
            map.setView(new L.LatLng(lat, long), 15);
            layer.setData([[lat, long]]);
            map.addLayer(layer);
          });
        }, function(err) {
          // error
        });
  });
