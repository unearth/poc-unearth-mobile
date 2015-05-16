angular.module('unearth.signUpController', [])
  .controller('SignUpController', function ($scope, $state, Authorization) {

    $scope.invalidLogin = false;

    $scope.credentials = {
      email: '',
      password: '',
      password2: ''
    };

    $scope.clearError = function(signUpForm) {
      signUpForm.$submitted = false;
    };

    $scope.redirectToLogin = function(){
      $state.go('login');
    };

    $scope.signUp = function(isValid, credentials) {
      if (isValid) {
        if (credentials.password === credentials.password2) {
          Authorization.signUp(credentials.email, credentials.password)
            .then( function (isAuthenticated) {
              if (isAuthenticated) {
                $state.go('tab.map');
              } else {
                $scope.invalidLogin = true;
              };
            });
        };
      };
    };
  });
