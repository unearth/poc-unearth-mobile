angular.module('unearth.loginController', [])
  .controller('LoginController', function ($scope, $state, Authorization) {

    $scope.invalidLogin = false;

    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.redirectToSignUp = function(){
      $state.go('sign-up');
    };

    $scope.clearError = function(loginForm) {
      loginForm.$submitted = false;
      $scope.invalidLogin = false;
    };

    $scope.login = function(isValid, credentials) {

      if (isValid) {
        Authorization.login(credentials.email, credentials.password)
          .then( function (isAuthenticated) {
            if (isAuthenticated) {
              $state.go('tab.map');
            } else {
              $scope.invalidLogin = true;
            }
          });
      };
    };
  });
