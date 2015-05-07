app.factory('Authorization', function($http) {
  var login = function(email, password) {
    return $http({
      method: 'POST',
      url: 'api/login',
      processData: true,
      data: {
        'email': email,
        'password': password
        },
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
    .then(function(response) {
       window.localStorage.accessToken = response.body.access_token;
      return response.data;
    });
  };

  var signUp = function(email, password) {
    return $http({
      method: 'POST',
      url: 'api/signup',
      processData: true,
      data: {
        'email': email,
        'password': password
        },
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
    .then(function(response) {
       window.localStorage.accessToken = response.body.access_token;
      return response.data;
    });
  };

  return {
    login: login,
    signUp: signUp
  }
})

app.factory('Waypoints', function($http){
  var getWaypoints = function(cb){
    return $http({
      method: 'GET',
      url: 'http://162.243.134.216:3000/waypoints',
      processData: false,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(function(response) {
      cb(response.data);
    });
  };

  var sendWaypoints = function(waypoints){
  return $http({
      method: 'POST',
      url: 'http://162.243.134.216:3000/waypoints',
      processData: true,
      data: waypoints,
      headers: {
        'Content-Type':'application/JSON'
        //'Authorization': 'Bearer ' + token
      }
    })
    .then(function(response) {
      return response.data;
    });
  };

  return {
    getWaypoints: getWaypoints,
    sendWaypoints: sendWaypoints
  }
})
