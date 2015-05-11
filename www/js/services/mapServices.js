

//         coordinateObject.latitude = position.coords.latitude;
//         coordinateObject.longitude = position.coords.longitude;
//         coordinateObjectCopy = angular.copy(coordinateObject); // data caching held in service
//         sendWaypointsObject.waypoints.push(coordinateObjectCopy);

//       // Prevents transmission of empty waypoint data to server
//       if(sendWaypointsObject.waypoints.length > 0) {
//         console.log('sendWaypointsObject: ', sendWaypointsObject);
//         Waypoints.sendWaypoints(sendWaypointsObject, function() {
//           startWaypointGET();
//           dataSent = true;
//         });
//       }

//       if(dataSent === true) {
//         sendWaypointsObject.waypoints = [];
//         dataSent = false;
//       }
//     });

// // nav service returns pos.coords.lat/lng
// // ensure it's unique (/certain distance) from last coord recorded in cache
// // if it is, add it to cache, rerender layer, add it to waypointsToBePosted
// // postWaypoints (at interval - interval break if no auth)
// // if it isn't
// // disregard points that are x distance from last point calculated
// //



//       var onePoint;
//       $interval(function() {
//         // GET waypoints array from server on app load and display fog overlay
//         Waypoints.getWaypoints(function(waypointData) {
//           console.log('waypointData: ', waypointData);
//           // waypointData is an object with an array of waypoint objects
//           // Loops through waypoints array and parses into format that can be read by fog overlay function
//           for(var i = 0; i < waypointData.waypoints.length; i++) {
//             onePoint = [];
//             onePoint.push(waypointData.waypoints[i].latitude);
//             onePoint.push(waypointData.waypoints[i].longitude);
//             allWaypoints.push(onePoint);
//           }
//           map.removeLayer(layer);
//           // Creates fog layer with user's waypoints as transparent "holes" in the fog
//           layer.setData(allWaypoints);
//           map.addLayer(layer);
//         });
//       }, 10000);    // Makes GET request for waypoints every 10 seconds
//     });
