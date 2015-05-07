app.controller('SignUpController',['$scope', '$state', 'Authorization', function ($scope, $state, Authorization) {
  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.signUp = function(credentials) {
    Authorization.signUp(credentials).then( function (isAuthenticated) {
      // if (isAuthenticated) {
      //   $state.go('map');
      // } else {
      //   $state.go('signUp');
      // }
      return isAuthenticated;
    });
  };
}]);
