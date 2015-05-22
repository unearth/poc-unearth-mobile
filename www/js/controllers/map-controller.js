angular.module('unearth.mapController', [])
  .controller('MapController', function($scope, Waypoints, CoordinateFilter, RenderMap, $interval, Group, $rootScope, Markers) {

    // Sets geolocation.watchPosition options
    var positionOptions = {timeout: 10000, maximumAge: 60000, enableHighAccuracy: false};

    if (!window.localStorage.getItem('currentExpedition')) {
      window.localStorage.setItem('currentExpedition', 'solo');
    }

    var initRender = true;
    var waypoints;
    var currentPosition;

    // Initializes the map render on load
    RenderMap.init();

    if (window.localStorage.getItem('waypoints') && window.localStorage.getItem('waypoints') !== "undefined") {
      if (window.localStorage.getItem('waypoints') !== "[]") {
        waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
        currentPosition = waypoints[waypoints.length - 1];
        RenderMap.renderLayer(waypoints);
      }
    }

    // Renders the fog overlay every 30 seconds
    $interval(function() {
      waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
      RenderMap.renderLayer(waypoints);
    }, 10000);


    // Waypoints are retrieved from server and entered into local storage.
    Waypoints.getWaypoints(function(data) {
      window.localStorage.waypoints = (JSON.stringify(data.waypoints));

      waypoints = JSON.parse(window.localStorage.waypoints);

      // TODO: Group waypoints are only loaded on initial load, need to continuously get group data
      if (window.localStorage.getItem('currentExpedition') && window.localStorage.getItem('currentExpedition') !== "undefined" && window.localStorage.getItem('currentExpedition') !== 'solo') {
        //$interval(function() {
          Group.getGroupWaypoints(window.localStorage.getItem('currentExpedition'), function(group) {
            console.log("group waypoints response: ", group);
            var groupWaypoints = [];
            for (var i = 0; i < group.waypoints.length; i++) {
              for (var j = 0; j < group.waypoints[i].waypoints.length; j++) {
                groupWaypoints.push(group.waypoints[i].waypoints[j]);
              }
            }
            console.log(groupWaypoints);
          window.localStorage.setItem('groupWaypoints', JSON.stringify(groupWaypoints));
          waypoints = groupWaypoints;
          window.localStorage.setItem('waypoints', JSON.stringify(groupWaypoints));
          console.log(waypoints);
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
        RenderMap.addMarkerListener();
      } else {
        once = true;
      }
    });


  });

