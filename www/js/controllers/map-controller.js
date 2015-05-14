angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter, RenderService) {

    RenderService.loadMap();

    // Waypoints are retreived from server and entered into local storage.
    Waypoints.getWaypoints(function(data) {
      window.localStorage.waypoints = (JSON.stringify(data.waypoints));
      // Sets watch position that calls the map service when a new position is received.
      navigator.geolocation.watchPosition(function(position) {
        var currentCoordinates = [position.coords.latitude, position.coords.longitude];
        RenderService.setView(currentCoordinates);
        CoordinateFilter.handleCoordinate(position);
      });
    });

    // Re-renders map on change in local storage
    $scope.$on('storage', function() {
      var waypoints = JSON.parse(window.localStorage.waypoints);
      RenderService.renderLayer(waypoints);
    });

    $scope.setZoom = function() {
      $scope.active = !$scope.active;
      RenderService.handleZoom($scope.active);
    }

  });
