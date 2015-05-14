angular.module('unearth.renderServices', [])
  .factory('RenderService', function() {
    var layer = L.TileLayer.maskCanvas({
      radius: 25,               // Radius in pixels or in meters of transparent circles (see useAbsoluteRadius)
      useAbsoluteRadius: true,  // True: r in meters, false: r in pixels
      color: '#00000',          // The color of the fog layer
      opacity: 0.8,             // Opacity of the fog area
      noMask: false,            // True results in normal (filled) circled, false is for transparent circles
      lineColor: '#A00'         // Color of the circle outline if noMask is true
    });

    // Creates a map in the div #map
    L.mapbox.accessToken = mapboxAccessToken;

    var wideMap,
        zoomMap,
        currentMap = 'zoom';

    var currentCoords;

    var loadMap = function() {
      wideMap = L.mapbox.map('widemap', mapboxLogin, {
        zoomControl: false
      });

      zoomMap = L.mapbox.map('zoommap', mapboxLogin, {
        zoomControl: false
      });

      // window.localStorage.waypoints = null;
      var loadData = JSON.parse(window.localStorage.waypoints);

      if (loadData === null) {
        loadData = [[38, -100]];  // Centers map on USA if no previous local data is found
      }

      currentCoords = loadData[loadData.length - 1];
      currentMap = wideMap;

      setView(currentCoords);

      wideMap.touchZoom.disable();
      wideMap.doubleClickZoom.disable();
      zoomMap.touchZoom.disable();
      zoomMap.doubleClickZoom.disable();
    }


    var setView = function(coords) {
      wideMap.setView(coords, 13);
      zoomMap.setView(coords, 18);
      currentCoords = coords;
    }

    var renderLayer = function(waypoints) {
      if(currentMap === 'zoom') {
        renderZoomLayer(waypoints);
      } else {
        renderWideLayer(waypoints);
      }
    }

    // Renders the layers for both maps
    var renderZoomLayer = function(waypoints) {
      zoomMap.removeLayer(layer);
      layer.setData(waypoints);
      zoomMap.addLayer(layer);
    }

    var renderWideLayer = function(waypoints) {
      wideMap.removeLayer(layer);
      layer.setData(waypoints);
      wideMap.addLayer(layer);
    }


    var handleZoom = function(active) {
      if (!active) {
        currentMap = 'wide';
      } else {
        currentMap = 'zoom';
      }
    }


    return {
      loadMap: loadMap,
      renderLayer: renderLayer,
      handleZoom: handleZoom,
      setView: setView
    }
  });
