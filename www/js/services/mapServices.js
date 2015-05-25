angular.module('unearth.mapServices', [])
  .factory('CoordinateFilter', function($rootScope, Waypoints) {
    var waypointsToBeSent = {waypoints: []};

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
  .factory('RenderMap', function($rootScope, Markers, Modal, MarkersHTTP) {

    var zoomLevel;
    var layer;
    var currentPosition;
    var map;
    var markerModal;
    var markerCoords;
    L.mapbox.accessToken = mapboxAccessToken;

    // Load map
    var init = function() {
      zoomLevel = 12;

      layer = L.TileLayer.maskCanvas({
        radius: 100,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
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

      Modal.createModal('templates/marker-modal.html')
        .then(function(modal) {
          markerModal = modal;
        });

      // Disables zoom
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();

    };

    // Sets zoom level to wide or zoom and centers view on current position
    var handleZoom = function(type) {
      var zoomLevels = [3, 5, 8, 12, 16];

      switch (type) {
        case 'plus':
          nextZoomIndex = zoomLevels.indexOf(zoomLevel) + 1;
          if (nextZoomIndex < zoomLevels.length - 1) {
            zoomLevel = zoomLevels[nextZoomIndex];
          } else {
            zoomLevel = 16;
          }
          break;
        case 'minus':
          nextZoomIndex = zoomLevels.indexOf(zoomLevel) - 1;
          if (nextZoomIndex >= 0) {
            zoomLevel = zoomLevels[nextZoomIndex];
          } else {
            zoomLevel = 3;
          }
          break;
        }
      centerView();
    };

    // Draws the fog overlay and centers the map on the most recent coordinate
    var renderLayer = function(waypoints) {
      map.removeLayer(layer);
      if (waypoints) {
        layer.setData(waypoints);
        currentPosition = waypoints[waypoints.length - 1];
      } else {
        layer.setData([0,0]);
      }
      map.addLayer(layer);
      MarkersHTTP.getMarkers().then(function(){
        displayMarkers(JSON.parse(window.localStorage.markers));
      });
    };

    // Centers map on current position
    var centerView = function() {
      map.setView(currentPosition, zoomLevel);
    };

    var displayMarkers = function (markerArr) {
      if(window.localStorage.getItem('currentExpedition') !== 'solo') {
        for (var i = 0; i < markerArr.length; i++) {
          if (markerArr[i].group_id === JSON.parse(window.localStorage.getItem('currentExpedition'))) {
          L.marker(markerArr[i].location)
            .bindPopup (
              ['<h1>', markerArr[i].name, '</h1>',
              '<div>', markerArr[i].description, '</div>',
              '<img src=', markerArr[i].image_url, '>'
              ].join(''))
            .addTo(map);
          }
        }
      }
    };

    var addMarkerListener = function() {
      map.on('click', function(event) {
        console.log('click');
        console.log(event.latlng);
        markerCoords = [event.latlng.lat, event.latlng.lng];
        markerModal.show();
        // createMarker([event.latlng.lat, event.latlng.lng]);
      });
    };


    var createMarker = function(name, description, imageData) {
      console.log('in createMarker');
      var newMarker = L.marker(markerCoords).bindPopup(
        ['<div class="map-popup">',
        '<h1 class="col-center popup-title">', name, '</h1>',
        '<p>', description, '</p>',
        '<img src=', imageData, '>',
        '</div>'].join('')
      );
      map.off('click');
      newMarker.addTo(map);
      newMarker.openPopup();

      markerModal.hide();

      // Calls function to save new marker to local storage and make POST request
      storeMarker({
        groupId: window.localStorage.currentExpedition,
        location: markerCoords,
        name: name,
        description: description,
        imageUrl: imageData
      });
    };


    var storeMarker = function(markerObj) {
      markerArray = window.localStorage.getItem('markers');
      if(markerArray && markerArray !== 'undefined' && markerArray !== 'null'){
        markerArray = JSON.parse(markerArray);
      } else {
        markerArray = [];
      }
        markerArray.push(markerObj);
        window.localStorage.setItem('markers', JSON.stringify(markerArray));
        Markers.postMarkers(markerObj);
    };

    return {
      init: init,
      handleZoom: handleZoom,
      renderLayer: renderLayer,
      centerView: centerView,
      displayMarkers: displayMarkers,
      createMarker: createMarker,
      addMarkerListener: addMarkerListener
    };

  })

  .factory('Markers', function($rootScope, MarkersHTTP) {
    var placeMarker = function() {
      $rootScope.$on('marker', function(latlng) {
        // Create a marker with passed lat lng
        console.log(latlng);
      });
    };

    var postMarkers = function(markerObj) {
      MarkersHTTP.postMarkers(markerObj);
    };


    return {
      placeMarker: placeMarker,
      postMarkers: postMarkers
    };
  })

  .factory('Modal', function($ionicModal, Group) {
    var inviteModal;
    var pendingModal;
    var groupsDataObj;

    var inviteData = {
      group: '',
      email: ''
    };

    var createInviteModal = function(url) {
      createModal(url)
      .then(function(modal) {
        inviteModal = modal;
        inviteModal.show();
      });
    };

    var groupsData = function() {
      return groupsDataObj;
    };

    var createPendingModal = function() {
      createModal('templates/pendingRequests-modal.html').then(function(newModal) {
        pendingModal = newModal;
        pendingModal.show();
      });
    };

    var saveGroupsData = function(data) {
      groupsDataObj = data;
    };

    var createModal = function(url) {
      return $ionicModal.fromTemplateUrl(url, {
        animation: 'slide-in-up'
      });
    };

    var setInviteData = function(data) {

      if (data.email) {
        inviteData.email = data.email;
      }

      if (data.group) {
        inviteData.group = data.group;
      }
    };

    var closeInviteModal = function() {
      Group.groupInvite(inviteData.email, inviteData.group, function(response) {
        console.log(response);
      });
      inviteData.email = '';
      inviteData.group = '';
      inviteModal.hide();
    };

    var closePending = function() {
      pendingModal.hide();
    };

    return {
      createModal: createModal,
      createInviteModal: createInviteModal,
      closeInviteModal: closeInviteModal,
      setInviteData: setInviteData,
      saveGroupsData: saveGroupsData,
      groupsData: groupsData,
      createPendingModal: createPendingModal,
      closePending: closePending
    };

  });
