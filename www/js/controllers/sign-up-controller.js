app.controller('SignInController',['$scope', '$state', function ($scope, $state) {
  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.signIn = function(credentials) {
    Authorization.login(credentials).then( function (isAuthenticated) {
      if (isAuthenticated) {
        $state.go('map');
      } else {
        $state.go('signIn');
      }
    });
  };
}]);