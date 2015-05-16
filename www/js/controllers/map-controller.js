angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter, RenderMap, $interval) {

    // Sets geolocation.watchPosition options
    var positionOptions = {timeout: 10000, maximumAge: 60000, enableHighAccuracy: true};
    // Sets localStorage to a default coordinate if there is no local storage

    var waypoints;

    // Initializes the map render on load
    RenderMap.init();
    navigator.geolocation.getCurrentPosition(function(position) {
      window.localStorage.waypoints = window.localStorage.waypoints || [position.coords.latitude, position.coords.longitude];
      waypoints = JSON.parse(window.localStorage.waypoints);
      RenderMap.renderLayer(waypoints);
    });

    // Renders the fog overlay every 30 seconds
    $interval(function() {
      RenderMap.renderLayer(waypoints);
    }, 30000);

    // Waypoints are retrieved from server and entered into local storage.
    Waypoints.getWaypoints(function(data) {
      window.localStorage.waypoints = (JSON.stringify(data.waypoints));
    });

    // Sets watch position that calls the map service when a new position is received.
    navigator.geolocation.watchPosition(function(position) {
      CoordinateFilter.handleCoordinate(position);
    }, function(error) { console.log(error); }, positionOptions);


    // Updates waypoints with the most recently accumulated gps coordinates
    $scope.$on('storage', function() {
      waypoints = JSON.parse(window.localStorage.waypoints);
    });

    // Sets zoom level when zoom button is pressed
    $scope.setZoom = function() {
      RenderMap.handleZoom();
    }
  });
