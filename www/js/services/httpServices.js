angular.module('unearth.httpServices', [])
  .factory('Authorization', function($http) {

    var login = function(email, password) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/login',
        processData: false,
        data: {
          email: email,
          password: password
        },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        window.localStorage.accessToken = response.data.token;
        return true;
      },

      //If error return false.
      function(){ return false; }
      );
    };

    var signUp = function(email, password, username) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/signup',
        processData: false,
        data: {
          name: username,
          email: email,
          password: password
          },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        window.localStorage.accessToken = response.data.token;
        return true;
      },

      //If error return false.
      function(){ return false; }
      );
    };

    return {
      login: login,
      signUp: signUp
    };
  })

  .factory('MarkersHTTP', function($http) {

    var getMarkers = function() {
      return $http({
        method: 'GET',
        url: 'http://localhost:3000/marker',
        processData: false,
        header: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        window.localStorage.setItem('markers', response.data);
        return true;
      },
      //If error return false.
      function(){ return false; }
      );
    };

    var postMarkerImage = function(fd, callback) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/marker/image',
        processData: false,
        data: fd,
        transformRequest:angular.identity,
        headers:{'Content-Type':undefined}
      })
      .then(function(response){
        callback(response);
      });
    };

      // {
      //   groupId: window.localStorage.currentExpedition,
      //   location: markerCoords,
      //   name: name,
      //   description: description,
      //   imageUrl: ''
      // }

    var postMarkers = function(marker) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/marker',
        data: {
          "markers": [marker]
        },
        processData: false,
        header: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        return true;
      },
      //If error return false.
      function(){ return false; }
      );
    };

    return {
      getMarkers: getMarkers,
      postMarkerImage: postMarkerImage,
      postMarkers: postMarkers
    };
  })

  .factory('Waypoints', function($http) {
    //needs to handle get waypoint requests for user and group waypoints
    var getWaypoints = function(callback) {
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/waypoints',
        processData: false,
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    var sendWaypoints = function(waypoints, callback) {
      console.log('waypoints sent: ', waypoints);
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/waypoints',
        processData: false,
        data: waypoints,
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response);
      });
    };

    return {
      getWaypoints: getWaypoints,
      sendWaypoints: sendWaypoints
    };
  })

  .factory('Group', function($http) {

    var getGroupWaypoints = function(groupId, callback) {
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/group/waypoints',
        processData: false,
        headers: {
          'Content-Type': 'application/JSON',
          'groupid': groupId
        }
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    var getGroups = function(callback) {
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/group',
        processData: false,
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        //response returns group ID, group name, username, and pending group invitations.
        callback(response.data);
      });
    };

    var groupCreate = function(groupName, groupDescription, callback) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/group/create',
        processData: false,
        data: {
          groupName: groupName,
          groupDescription: groupDescription,
          emails: ['trav@trav.com']
        },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    var groupInvite = function(email, groupId, callback) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/group/invite',
        processData: false,
        data: {
          email: email,
          groupId: groupId
        },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(
        //If succcess...
        function(success) {callback(success);},

        //If error...
        function(error){callback(error);}
      );
    };

    var getInvites = function(callback) {
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/group/invites',
        processData: false,
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    var groupJoin = function(choice, groupId, callback) {
      console.log(groupId);
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/group/' + choice,
        processData: false,
        data: {
          groupId: groupId
        },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    // TODO: INCOMPLETE
    // var syncGroups = function(email, callback) {
    //   getGroups(email, function(results) {
    //     var groups = window.localStorage.groups;
    //     var groupObj = {};
    //     for(var i = 0; i < groups.length; i++) {
    //       groupObj[groups[i].id] = groups[i].name;
    //       if(!groups[i].id){
    //         // Post group to database
    //       }
    //     }
    //     for(var j = 0; i < results.length; j++) {
    //       if(groupObj[results[j].id] === undefined){
    //         // De-register from group
    //       }
    //     }
    //   });
    // };

    return {
      getGroupWaypoints: getGroupWaypoints,
      getGroups: getGroups,
      groupInvite: groupInvite,
      groupJoin: groupJoin,
      groupCreate: groupCreate,
      getInvites: getInvites
    };
  });

