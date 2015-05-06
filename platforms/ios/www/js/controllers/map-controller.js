app.controller('MapController', ['$scope', '$interval', 'leafletData', 'Waypoints',
  function($scope, $interval, leafletData, Waypoints) {
    // angular.extend($scope, {
    //   center: {
    //       lat: 37.782651,
    //       lng: -122.446200,
    //       zoom: 12
    //   }
    // });

    leafletData.getMap().then(function(map) {
      map.setView(new L.LatLng(37.782651, -122.446200), 15);
    });

    var layer = L.TileLayer.maskCanvas({
     radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
     useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
     color: '#00000',          // The color of the fog layer
     opacity: 0.8,             // Opacity of the fog area
     noMask: false,            // True results in normal (filled) circled, false is for transparent circles
     lineColor: '#A00'         // Color of the circle outline if noMask is true
    });

    Waypoints.getWaypoints(function(responseData){
      console.log(responseData);
      layer.setData(responseData);
      leafletData.getMap().then(function(map) {
        map.addLayer(layer);
      });
    });
}]);
