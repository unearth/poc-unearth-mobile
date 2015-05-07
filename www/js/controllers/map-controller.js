app.controller('MapController', ['$scope', '$interval', 'leafletData', 'Waypoints', '$cordovaGeolocation',
  function($scope, $interval, leafletData, Waypoints, $cordovaGeolocation) {
    var coordinateObject = {
      latitude: null,
      longitude: null
    };
    var sendWaypointsObject = {waypoints: []};

    var layer = L.TileLayer.maskCanvas({
     radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
     useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
     color: '#00000',          // The color of the fog layer
     opacity: 0.8,             // Opacity of the fog area
     noMask: false,            // True results in normal (filled) circled, false is for transparent circles
     lineColor: '#A00'         // Color of the circle outline if noMask is true
    });

    var geolocationOptions = {frequency: 3000, timeout: 50000, enableHighAccuracy: true};

    // var geolocationError = function(error) {
    //   console.log(error);
    // };


    // var geolocationSuccess = function(positionObject) {
    //   console.log(positionObject);
    //   coordinateObject.latitude = positionObject.coords.latitude;
    //   coordinateObject.longitude = positionObject.coords.longitude;
    //   localCoordinateArray.push(coordinateObject);

    //   leafletData.getMap().then(function(map) {
    //       map.setView(new L.LatLng(coordinateObject.latitude, coordinateObject.longitude), 15);
    //       layer.setData([[coordinateObject.latitude, coordinateObject.longitude]]);
    //       map.addLayer(layer);
    //   });
    // };

    // Waypoints.getWaypoints(function(responseData) {
    //   console.log(responseData);
    //   layer.setData(responseData);
    //   leafletData.getMap().then(function(map) {
    //     map.addLayer(layer);
    //   });
    // });

    // Geolocation options: timeout = time before error if no GPS data is returned
    //                      enableHighAccuracy = false: tries using network location first, then uses GPS
    var positionOptions = {timeout: 10000, enableHighAccuracy: false};

    // $cordovaGeolocation
    //   .getCurrentPosition(positionOptions)
    //   .then(function (position) {
    //     var latitude  = position.coords.latitude;
    //     var longitude = position.coords.longitude;
    //     // Sets view to current geolocation with zoom level 15 and place a transparent point at that location
    //     leafletData.getMap().then(function(map) {
    //       map.setView(new L.LatLng(latitude, longitude), 15);
    //       layer.setData([[latitude, longitude]]);
    //       map.addLayer(layer);
    //     });
    //   }, function(err) {
    //     // error
    //   });

    var watch = $cordovaGeolocation.watchPosition(geolocationOptions);
    watch.then(
      null,
      function(error) {
        console.log(error);
      },
      function(positionObject) {
        console.log(positionObject);
        coordinateObject.latitude = positionObject.coords.latitude;
        coordinateObject.longitude = positionObject.coords.longitude;
        sendWaypointsObject.waypoints.push(coordinateObject);

        Waypoints.sendWaypoints(sendWaypointsObject);

        leafletData.getMap().then(function(map) {
          map.setView(new L.LatLng(coordinateObject.latitude, coordinateObject.longitude), 15);
          layer.setData([[coordinateObject.latitude, coordinateObject.longitude]]);
          map.addLayer(layer);
      });
    });
}]);
