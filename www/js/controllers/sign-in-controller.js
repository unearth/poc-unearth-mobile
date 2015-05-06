app.controller('SignInController',['$scope', '$state', 'Authorization', function ($scope, $state, Authorization) {
  $scope.signIn = function() {
    Authorization.login()
      .then(isAuthenticated) {
        if (isAuthenticated) {
          $state.go('map');
        } else {
          $state.go('sign-in');
        }
      };

  };
}]);