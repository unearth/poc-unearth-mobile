app.factory('Authorization', function($http){
  var login = function(data) {
    return $http({
      method: 'POST',
      url: 'api/login',
      processData: false,
      data: data,
      headers:{'Content-Type':application/JSON}
    })
    .then(function(resp) {
       window.localStorage.accessToken = response.body.access_token;
      return resp.data;
    });
  };

  var signUp = function(data) {
    return $http({
      method: 'POST',
      url: 'api/signup',
      processData: false,
      data: data,
      headers:{'Content-Type':application/JSON}
    })
    .then(function(resp) {
       window.localStorage.accessToken = response.body.access_token;
      return resp.data;
    });
  };

  return {
    login: login,
    signUp: signUp
  }
})

app.factory('Waypoints', function($http){
  var getWaypoints = function(){
  return $http({
      method: 'GET',
      url: 'api/waypoints',
      processData: false,
      headers:{'Content-Type':application/JSON}
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  var sendWaypoints = function(){
  return $http({
      method: 'POST',
      url: 'api/waypoints',
      processData: false,
      data: data,
      headers:{'Content-Type':application/JSON}
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  return {
    getWaypoints: getWaypoints,
    sendWaypoints: sendWaypoints
  }
})
