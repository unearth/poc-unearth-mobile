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
      var temp = window.localStorage.getItem('waypoints');
      temp = (temp === null) ? [] : JSON.parse(temp);
      // Pushes the local storage data with the stored waypoints.
      temp.push(coordinate);
      // Updates local storage with new waypoints.
      window.localStorage.setItem('waypoints', JSON.stringify(temp));

      waypointsToBeSent.waypoints.push(coordinate);

        // Checks to see if the waypoints array is 3 or more.
      if (waypointsToBeSent.waypoints.length > 2) {

        //check 'currentExpedition'
        //if 'Solo Expedition' then POST
        //else POST then GET all waypoints from group (except for current user)
        //set waypoints to the result of the current user waypoints and rest of the group waypoints combined
        //store waypoints in local storage
        //broadcast 'storage' event


        //solo waypoints are seperate from group waypoints
        //



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
  })

  /////////////////////////////////////////////
  // Map Rendering functions
  .factory('RenderMap', function() {

    var zoomLevel;
    var layer;
    var currentPosition;
    var map;
    L.mapbox.accessToken = mapboxAccessToken;

    // Load map
    var init = function() {
      zoomLevel = 13;

      layer = L.TileLayer.maskCanvas({
        radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
        useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
        color: '#00000',          // The color of the fog layer
        opacity: 0.8,             // Opacity of the fog area
        noMask: false,            // True results in normal (filled) circled, false is for transparent circles
        lineColor: '#A00'         // Color of the circle outline if noMask is true
      });

      // Creates a map in the div #map
      map = L.mapbox.map('map', mapboxLogin, {
        zoomControl: false
      });

      // Disables zoom
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();

    }

    // Sets zoom level to wide or zoom and centers view on current position
    var handleZoom = function() {
      if(zoomLevel === 13) {
        zoomLevel = 18;
      } else {
        zoomLevel = 13;
      }
      centerView();
    }

    // Draws the fog overlay and centers the map on the most recent coordinate
    var renderLayer = function(waypoints) {
      map.removeLayer(layer);
      layer.setData(waypoints);
      map.addLayer(layer);
      currentPosition = waypoints[waypoints.length - 1];
      centerView();

    };

    // Centers map on current position
    var centerView = function() {
      map.setView(currentPosition, zoomLevel);
    };

    var createMarker = function(coordinates) {
      L.marker(coordinates).addTo(map);
    };

    return {
      init: init,
      handleZoom: handleZoom,
      renderLayer: renderLayer,
      centerView: centerView,
      createMarker: createMarker
    };

  })

  .factory('Markers', function() {
    var placeMarker = function() {
      $rootScope.on('marker', function(latlng) {
        // Create a marker with passed lat lng
        console.log(latlng);
      })
    }

    return {
      placeMarker: placeMarker
    }
  });
