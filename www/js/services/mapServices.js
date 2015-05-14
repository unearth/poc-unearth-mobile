angular.module('unearth.mapServices', [])
  .factory('CoordinateFilter', function($rootScope, Waypoints) {
    var waypointsToBeSent = {waypoints: []};
    // Upon initialization the waypointsToBeSent obj and the allWaypoints obj needs to be retreived/initialized.

    var handleCoordinate = function(position) {
      var coordinateTuple = [];
      coordinateTuple[0] = position.coords.latitude;
      coordinateTuple[1] = position.coords.longitude;
      if (shouldStoreCoordinate(coordinateTuple)) {
        storeCoordinate(coordinateTuple);
      }
    };

    var storeCoordinate = function(coordinate) {

        // Sets the temp variable to either an empty array if local storage is clean or the current value in local storage.
        var temp = window.localStorage.waypoints;
        temp = (temp === null) ? [] : JSON.parse(temp);
        // Pushes the local storage data with the stored waypoints.
        temp.push(coordinate);
        // Updates local storage with new waypoints.
        window.localStorage.waypoints = JSON.stringify(temp);
        // Broadcasts change in local storage.
        $rootScope.$broadcast('storage');

        waypointsToBeSent.waypoints.push(coordinate);

        // Checks to see if the waypoints array is 3 or more.
      if (waypointsToBeSent.waypoints.length > 2) {
        // Sends waypoints to the database
        Waypoints.sendWaypoints(waypointsToBeSent, function(response) {
          if (response) {
            console.log('response received to storeCoordinate http request');
          } else {
            console.error('error on response to storeCoordiante http request');
          }
          // Resets the waypointsToBeSent array.
          waypointsToBeSent.waypoints = [];
        });
      }
    };

    var shouldStoreCoordinate = function(coordinate) {
      // Checks to make sure the coordinates has something to compare to, .005mi = 26ft.
      for (var i = 0; i < waypointsToBeSent.waypoints.length; i++) {
        if (calcDistance(coordinate, waypointsToBeSent.waypoints[i]) < 0.005) {
          return false;
        }
      }

      return true;
    };

    // Defines the to Radian function for use in the calcDistance function.
    if (typeof(Number.prototype.toRad) === "undefined") {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      };
    }

    // Calculate the distance between 2 waypoints, given their latitudes and longitudes, return distance in miles.
    var calcDistance = function(point1, point2) {

      var R = 6371; // Earth radius, in km.
      var lat1 = point1[0];
      var lon1 = point1[1];
      var lat2 = point2[0];
      var lon2 = point2[1];

      var dLat = (lat2 - lat1).toRad();
      var dLon = (lon2 - lon1).toRad();
      lat1 = lat1.toRad();
      lat2 = lat2.toRad();

      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var distance = R * c * 0.621371; // Converts distance from km to miles
      return distance;
    };


    return {
      handleCoordinate: handleCoordinate
    };
  });

// Logout does a post request to server for waypointsToBe.
// WaypointsToBeSent needs to be stored in local storage.
//
