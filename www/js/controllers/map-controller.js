angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter, RenderMap, $interval) {

    // Sets geolocation.watchPosition options
    var positionOptions = {timeout: 10000, maximumAge: 60000, enableHighAccuracy: true};
    // Sets localStorage to a default coordinate if there is no local storage

    window.localStorage.currentExpedition = window.localStorage.currentExpedition || 'solo';

    //if null or 'solo' expedition call getWaypoints and store in localStorage
    //

    var waypoints;

    // Initializes the map render on load
    RenderMap.init();

    if (window.localStorage.getItem('waypoints')) {
      if (window.localStorage.getItem('waypoints') !== "[]") {
        waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
        RenderMap.renderLayer(waypoints);
      }
    }

    // Renders the fog overlay every 30 seconds
    $interval(function() {
      waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
      RenderMap.renderLayer(waypoints);
    }, 30000);

    // Waypoints are retrieved from server and entered into local storage.
    Waypoints.getWaypoints(function(data) {
      window.localStorage.waypoints = (JSON.stringify(data.waypoints));

      waypoints = JSON.parse(window.localStorage.waypoints);

      if (window.localStorage.currentExpedition !== 'solo') {
        getGroupWaypoints(window.localStorage.currentExpedition, function(group) {
          window.localStorage.setItem('groupWaypoints', group.waypoints);
          waypoints.concat(window.localStorage.getItem('groupWaypoints'));
        });
      }
      // Sets watch position that calls the map service when a new position is received.
      navigator.geolocation.watchPosition(function(position) {
        CoordinateFilter.handleCoordinate(position);
      }, function(error) { console.log(error); }, positionOptions);
    });




    // Sets zoom level when zoom button is pressed
    $scope.setZoom = function() {
      RenderMap.handleZoom();
    }

  });

