angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, $interval, Waypoints) {
    var coordinateObject = {
      latitude: null,
      longitude: null
    };
    var coordinateObjectCopy = {};
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

    // Creates a map in the div #map
    L.mapbox.accessToken = mapboxAccessToken;
    var map = L.mapbox.map('map', mapboxLogin);

    var dataSent = false;

    // Watches GPS position and POST waypoints to database every time position updates
    navigator.geolocation.watchPosition(function(position) {
      if(coordinateObject.latitude !== position.coords.latitude && coordinateObject.longitude !== position.coords.longitude) {
        coordinateObject.latitude = position.coords.latitude;
        coordinateObject.longitude = position.coords.longitude;
        coordinateObjectCopy = angular.copy(coordinateObject);
        sendWaypointsObject.waypoints.push(coordinateObjectCopy);
      }

      // Prevents transmission of empty waypoint data to server
      if(sendWaypointsObject.waypoints.length > 0) {
        console.log('sendWaypointsObject: ', sendWaypointsObject);
        Waypoints.sendWaypoints(sendWaypointsObject, function() {
          startWaypointGET();
          dataSent = true;
        });
      }

      if(dataSent === true) {
        sendWaypointsObject.waypoints = [];
        dataSent = false;
      }
    });

    var startWaypointGET = function() {
      var onePoint;
      $interval(function() {
        // GET waypoints array from server on app load and display fog overlay
        Waypoints.getWaypoints(function(waypointData) {
          console.log('waypointData: ', waypointData);
          // waypointData is an object with an array of waypoint objects
          // Loops through waypoints array and parses into format that can be read by fog overlay function
          for(var i = 0; i < waypointData.waypoints.length; i++) {
            onePoint = [];
            onePoint.push(waypointData.waypoints[i].latitude);
            onePoint.push(waypointData.waypoints[i].longitude);
            allWaypoints.push(onePoint);
          }
          map.removeLayer(layer);
          // Creates fog layer with user's waypoints as transparent "holes" in the fog
          layer.setData(allWaypoints);
          map.addLayer(layer);
        });
      }, 10000);    // Makes GET request for waypoints every 10 seconds
    }
  });
