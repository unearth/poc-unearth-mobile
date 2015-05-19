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
      function(){return false});
    };

    var signUp = function(email, password, username) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/signup',
        processData: false,
        data: {
          username: username,
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
      function(){return false});
    };

    return {
      login: login,
      signUp: signUp
    };
  })

  .factory('Markers', function($http) {

    var getMarkers = function() {
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/marker',
        processData: false,
        header: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        window.localStorage.setItem('markers', response.data);
        return true;
      },

      //If error return false.
      function(){return false});
    }

    var postMarkers = function() {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/marker',
        processData: false,
        header: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        return true;
      },

      //If error return false.
      function(){return false});
    }
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

    var getGroupWaypoints = function(groupID, callback) {
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/group/waypoints',
        processData: false,
        headers: {'Content-Type': 'application/JSON'}
      })
      .then(function(respose) {
        callback(response.data);
      });
    };

    var getGroups = function(callback) {
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/group/groups',
        processData: false,
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        //response returns group ID, group name, username, and pending group invitations.
        callback(response.data);
      });
    };

    var groupInvite = function(email, groupID, callback) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/group/invite',
        processData: false,
        data: {
          email: email,
          groupID: groupID
        },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    var groupJoin = function(choice, groupID, callback) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/group/' + choice,
        processData: false,
        data: {
          groupID: groupID
        },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    var groupCreate = function(groupID, callback) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/group/create',
        processData: false,
        data: {
          groupID: groupID
        },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    return {
      getGroupWaypoints: getGroupWaypoints,
      getGroups: getGroups,
      groupInvite: groupInvite,
      groupJoin: groupJoin,
      groupCreate: groupCreate
    };
  });

