angular.module('unearth.signUpController', [])
  .controller('SignUpController', function ($scope, $state, Authorization) {

    $scope.credentials = {
      email: '',
      password: '',
      password2: ''
    };

    $scope.signUp = function(credentials) {
      if (credentials.password === credentials.password2) {
        Authorization.signUp(credentials.email, credentials.password)
          .then( function (isAuthenticated) {
          if (isAuthenticated) {
            $state.go('tab.map');
          } else {
            $state.go('signUp');
          }
        });
      }
    };
  });
