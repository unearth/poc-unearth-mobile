angular.module('unearth.services', [])
  .factory('Authorization', function($http) {
    var login = function(email, password) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/login',
        processData: false,
        data: {
          'email': email,
          'password': password
        },
        headers:{'Content-Type':'application/JSON'}
      })
      .then(function(response) {
         window.localStorage.accessToken = response.data.token;
        return response.data;
      });
    };

    var signUp = function(email, password) {
      return $http({
        method: 'POST',
        url: 'http://162.243.134.216:3000/signup',
        processData: false,
        data: {
          'email': email,
          'password': password
          },
        headers:{'Content-Type':'application/JSON'}
      })
      .then(function(response) {
         window.localStorage.accessToken = response.data.token;
        return response.data;
      });
    };

    return {
      login: login,
      signUp: signUp
    };
  })

  .factory('Waypoints', function($http) {

    var getWaypoints = function(callback){
      return $http({
        method: 'GET',
        url: 'http://162.243.134.216:3000/waypoints',
        processData: false,
        headers: {
          'Content-Type':'application/JSON'
        }
      })
      .then(function(response) {
        console.log(response.data);
        callback(response.data);
      });
    };

    var sendWaypoints = function(waypoints) {
      return $http({
          method: 'POST',
          url: 'http://162.243.134.216:3000/waypoints',
          processData: false,
          data: waypoints,
          headers: {
            'Content-Type':'application/JSON'
          }
      })
      .then(function(response) {
        return response.data;
      });
    };

    return {
      getWaypoints: getWaypoints,
      sendWaypoints: sendWaypoints
    };
  });
