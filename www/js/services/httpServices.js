angular.module('unearth.httpServices', [])
  .factory('Authorization', function($http) {

    var loginError = function (error) {
      //For login this would return invalid username or password.
      return false;
    };

    var signUpError = function (error) {
      //If there is already a current user with email in signUp this will need to send proper response to controller.
      return false;
    };

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
      }, loginError);
    };

    var signUp = function(email, password) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/signup',
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
      }, signUpError);
    };

    return {
      login: login,
      signUp: signUp
    };
  })

  .factory('Waypoints', function($http) {
    //needs to handle get waypoint requests for user and group waypoints
    var getWaypoints = function(callback){
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

    var getGroups = function(callback) {
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/group',
        processData: false,
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        //response returns group ID, group name, and pending group invitations.
        callback(response.data);
      });
    };

    var groupCreate = function(groupName, groupId, callback) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/group/create',
        processData: false,
        data: {
          groupName: groupName,
          groupID: groupId
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
          groupID: groupId
        },
        headers: {'Content-Type':'application/JSON'}
      })
      .then(function(response) {
        callback(response.data);
      });
    };

    var groupJoin = function(choice, groupId, callback) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/group/' + choice,
        processData: false,
        data: {
          groupID: groupId
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
      getGroups: getGroups,
      groupInvite: groupInvite,
      groupJoin: groupJoin,
      groupCreate: groupCreate
    };
  });
