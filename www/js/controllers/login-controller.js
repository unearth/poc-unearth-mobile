app.controller('LoginController',['$scope', '$state', 'Authorization', '$log', function ($scope, $state, Authorization, $log) {
  $scope.credentials = {
    email: '',
    password: ''
  };

  $scope.login = function(credentials) {
    $log.log(credentials)
    Authorization.login(credentials).then( function (isAuthenticated) {
      if (isAuthenticated) {
        $state.go('tab/map');
      } else {
        $state.go('login');
      }
    });
  };
}]);
