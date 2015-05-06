app.factory('Authorization', function($http) {
  var login = function(data) {
    return $http({
      method: 'POST',
      url: 'api/login',
      processData: false,
      data: data,
      headers:{'Content-Type':application/JSON}
    })
    .then(function(response) {
       window.localStorage.accessToken = response.body.access_token;
      return response.data;
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
    var data = [
    [37.782651, -122.447100],
    [37.782745, -122.446600],
    [37.782842, -122.446100],
    [37.782919, -122.445600],
    [37.782992, -122.445100],

    [37.782745, -122.444600],
    [37.782842, -122.444100],
    [37.782919, -122.443600],
    [37.782992, -122.443100],

    [37.782745, -122.442600],
    [37.782842, -122.442100],
    [37.782919, -122.441600],
    [37.782992, -122.441100]

    ];

    return cb(data);
  // return $http({
  //     method: 'GET',
  //     url: 'api/waypoints',
  //     processData: false,
  //     headers:{'Content-Type': 'application/JSON'}
  //   })
  //   .then(function(response) {
  //     cb(response.data);
  //   });
  };

  var sendWaypoints = function(){
  return $http({
      method: 'POST',
      url: 'api/waypoints',
      processData: false,
      data: data,
      headers:{'Content-Type':application/JSON}
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
