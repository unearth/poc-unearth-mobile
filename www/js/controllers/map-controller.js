angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, $interval, Waypoints) {
    var coordinateObject = {
      latitude: null,
      longitude: null
    };
    var sendWaypointsObject = {waypoints: []};
    var allWaypoints = [];

    var layer = L.TileLayer.maskCanvas({
     radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
     useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
     color: '#00000',          // The color of the fog layer
     opacity: 0.8,             // Opacity of the fog area
     noMask: false,            // True results in normal (filled) circled, false is for transparent circles
     lineColor: '#A00'         // Color of the circle outline if noMask is true
    });

    // Create a map in the div #map
    L.mapbox.accessToken = mapboxAccessToken;
    var map = L.mapbox.map('map', mapboxLogin);

    // Watch GPS position and POST waypoints to database every time position updates
    navigator.geolocation.watchPosition(function(position) {
      coordinateObject.latitude  = position.coords.latitude;
      coordinateObject.longitude = position.coords.longitude;
      sendWaypointsObject.waypoints.push(coordinateObject);

      Waypoints.sendWaypoints(sendWaypointsObject);

      sendWaypointsObject.waypoints = [];
    });

    // GET waypoints array from server on app load and display fog overlay
    Waypoints.getWaypoints(function(waypointData) {
      for(var i = 0; i < waypointData.waypoints.length; i++) {
        var onePoint = [];
        onePoint.push(waypointData.waypoints[i].latitude);
        onePoint.push(waypointData.waypoints[i].longitude);
      }
      allWaypoints.push(onePoint);
      layer.setData(allWaypoints);
      map.addLayer(layer);
    });
  });
