angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter, RenderMap, $interval) {
    // Initializes map

    var positionOptions = {timeout: 10000, maximumAge: 60000, enableHighAccuracy: true};
    window.localStorage.waypoints = window.localStorage.waypoints || JSON.stringify([[37, -122]]);
    var waypoints = JSON.parse(window.localStorage.waypoints);
    //console.log(waypoints);
    RenderMap.init();

    // Waypoints are retreived from server and entered into local storage.
    Waypoints.getWaypoints(function(data) {
      window.localStorage.waypoints = (JSON.stringify(data.waypoints));
      // Sets watch position that calls the map service when a new position is received.
      navigator.geolocation.watchPosition(function(position) {
        CoordinateFilter.handleCoordinate(position);
      }, function(error) { console.log(error); }, positionOptions);
    });


    // Rerenders map on new stored waypoints
    $scope.$on('storage', function() {
      waypoints = JSON.parse(window.localStorage.waypoints);
    });

    RenderMap.renderLayer(waypoints);
    $interval(function() {
      RenderMap.renderLayer(waypoints);
    }, 30000);

    $scope.setZoom = function() {
      RenderMap.handleZoom();
    }
  });
