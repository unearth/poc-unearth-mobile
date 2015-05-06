app.controller('MapController', ['$scope', 'leafletData', function($scope, leafletData) {
  var layer = L.TileLayer.maskCanvas({
   radius: 25,               // Radius in pixels or in meters (see useAbsoluteRadius)
   useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
   color: '#00000',          // The color of the layer
   opacity: 0.8,             // Opacity of the fog area
   noMask: false,            // True results in normal (filled) circled, instead masked circles
   lineColor: '#A00'         // Color of the circle outline if noMask is true
  });

  layer.setData(data);
  leafletData.getMap().then(function(map) {
    map.addLayer(layer);
  });
}]);