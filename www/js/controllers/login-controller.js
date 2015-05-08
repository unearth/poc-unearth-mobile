angular.module('unearth.loginController', [])
  .controller('LoginController', function ($scope, $state, Authorization, $log) {
    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.login = function(credentials) {
      // Authorization.login(credentials).then( function (isAuthenticated) {
        if (true) {
          $state.go('tab.map');
        } else {
          $state.go('login');
        }
      // });
    };
  });
