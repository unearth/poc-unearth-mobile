angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter, RenderMap, $interval, Group, $rootScope, Markers) {


    // Sets geolocation.watchPosition options
    var positionOptions = {timeout: 10000, maximumAge: 60000, enableHighAccuracy: true};

    window.localStorage.currentExpedition = window.localStorage.currentExpedition || 'solo';

    var waypoints;
    var currentPosition;
    var initRender = true;

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

      // TODO: Group waypoints are only loaded on initial load, need to continuously get group data
      if (window.localStorage.currentExpedition !== 'solo') {
        Group.getGroupWaypoints(window.localStorage.currentExpedition, function(group) {
          window.localStorage.setItem('groupWaypoints', group.waypoints);
          waypoints.concat(window.localStorage.getItem('groupWaypoints'));
        });
      }
      // Sets watch position that calls the map service when a new position is received.
      navigator.geolocation.watchPosition(function(position) {
        //"initRender" if-block will only be called for the initial rendering of map.
        if (initRender) {
          CoordinateFilter.handleCoordinate(position);
          waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
          RenderMap.renderLayer(waypoints);
          RenderMap.centerView()
          initRender = false;
        } else {
          CoordinateFilter.handleCoordinate(position);
        }
      }, function(error) { console.log(error); }, positionOptions);
    });

    // Sets zoom level when zoom button is pressed
    $scope.setZoom = function() {
      RenderMap.handleZoom();
    };

    var once = false;
    $rootScope.$watch('addMarker', function() {
      if(once) {
        console.log('markeradd');
        RenderMap.createMarker(currentPosition);
      } else {
        once = true;
      }
    });
  });

