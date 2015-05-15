angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter, RenderMap) {
    // Initializes map
    RenderMap.init();

    var positionOptions = {timeout: 10000, maximumAge: 60000, enableHighAccuracy: true};
    window.localStorage.waypoints = window.localStorage.waypoints || null;

    // Waypoints are retreived from server and entered into local storage.
    Waypoints.getWaypoints(function(data) {
      window.localStorage.waypoints = (JSON.stringify(data.waypoints))
      // Sets watch position that calls the map service when a new position is received.
      navigator.geolocation.watchPosition(function(position) {
        CoordinateFilter.handleCoordinate(position);
      }, function(error) { console.log(error); }, positionOptions);
    });

    // Rerenders map on new stored waypoints
    $scope.$on('storage', function() {
      var waypoints = JSON.parse(window.localStorage.waypoints);
      RenderMap.renderLayer(waypoints);
    });

    $scope.setZoom = function() {
      RenderMap.handleZoom();
    }
  });
