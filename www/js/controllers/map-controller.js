angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter, RenderMap, $interval, Group, $rootScope, Markers) {

    var initRender = true;
    var currentExpedition = window.localStorage.getItem('currentExpedition');
    var currentPosition;
    // Sets geolocation.watchPosition options
    var positionOptions = {timeout: 10000, maximumAge: 60000, enableHighAccuracy: false};
    // Sets
    var waypoints = window.localStorage.getItem('waypoints');

    if (waypoints === "undefined") {
      waypoints = JSON.parse(waypoints);
    } else {
      waypoints = null;
    }

    if (currentExpedition === null || currentExpedition === "undefined") {
      window.localStorage.setItem('currentExpedition', 'solo');
    }


    // Initializes the map.
    RenderMap.init();


    // Initial render of the fog layer and waypoints.
    if (waypoints !== null) {
      if (waypoints !== "[]") {
        currentPosition = waypoints[waypoints.length - 1];
        RenderMap.renderLayer(waypoints);
      }
    }

    //
    var storeGroupWaypoints = function(callback) {
      currentExpedition = window.localStorage.getItem('currentExpedition');

      Group.getGroupWaypoints(currentExpedition,

        function(group) {
          console.log("group waypoints response: ", group);
          var groupWaypoints = [];

          for (var i = 0; i < group.waypoints.length; i++) {
            for (var j = 0; j < group.waypoints[i].waypoints.length; j++) {
              groupWaypoints.push(group.waypoints[i].waypoints[j]);
            }
          }

          window.localStorage.setItem('groupWaypoints', JSON.stringify(groupWaypoints));
          // Group
          callback(groupWaypoints);
        }
      );
    };

    // Waypoints are retrieved from server and entered into local storage.
    Waypoints.getWaypoints(

      function(data) {
        // Stores waypoint data into local storage.
        window.localStorage.setItem('waypoints', JSON.stringify(data.waypoints));

        // This runs if the current expedition is set to a group id.
        if (currentExpedition !== 'solo') {
          storeGroupWaypoints(function(groupWaypoints) {
            combinedGroupWaypoints = combineWaypoints(groupWaypoints);
            RenderMap.renderLayer(combinedGroupWaypoints);
            RenderMap.centerView();
            initRender = false;
          });
        }

        navigator.geolocation.watchPosition(
          // Sets watch position that calls the map service when a new position is received.
          function(position) {
            //"initRender" if-block will only be called for the initial rendering of map.
            if (initRender) {
              CoordinateFilter.handleCoordinate(position);
              waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
              // If waypoints is empty this will not fire
              if (waypoints !== null) {
                if (waypoints.length > 0) {
                  RenderMap.renderLayer(waypoints);
                  RenderMap.centerView();
                  initRender = false;
                }
              }
            } else {
              CoordinateFilter.handleCoordinate(position);
            }
          },

          function(error) { console.log(error); },

          // This last parameter adds the position option specifications from above.
          positionOptions
        );
      }
    );

    var combineWaypoints = function(groupWaypoints) {
      var currentWaypoints = window.localStorage.getItem('waypointsToBeSent');
      return currentWaypoints.concat(groupWaypoints);
    };

    // Renders the fog overlay every 30 seconds
    $interval(

      function() {
        // Updates current expedition to value in local storage.
        currentExpedition = window.localStorage.getItem('currentExpedition');

        if (currentExpedition === 'solo') {
          // Retreives waypoints for solo then renders.
          Waypoints.getWaypoints(function(data) {
            // This checks to make sure its not an empty array.
            if (waypoints[0] !== undefined) {
              RenderMap.renderLayer(waypoints);
            }
          });
        } else {
          // Retreives waypoints for group then renders.
          storeGroupWaypoints(function(groupWaypoints) {
            window.localStorage.setItem('waypoints', JSON.stringify(groupWaypoints));
            RenderMap.renderLayer(groupWaypoints);
          });
        }
      }, 10000);

    // Sets zoom level when zoom button is pressed
    $scope.setZoom = function() {
      RenderMap.handleZoom();
    };

    // This catches an error on intial load by preventing first addMarker call.
    var once = false;
    $rootScope.$watch('addMarker', function() {
      if(once) {
        console.log('markeradd');
        RenderMap.addMarkerListener();
      } else {
        once = true;
      }
    });

  });

