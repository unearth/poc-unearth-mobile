angular.module('unearth.settingsController', [])
  .controller('SettingsController', function ($scope, $state, Authorization) {

    $scope.logout = function(){
      window.localStorage.removeItem('accessToken');
      $state.go('login');
    };
  });

  //   $scope.credentials = {
  //     email: '',
  //     password: ''
  //   };

  //   $scope.redirectToSignUp = function(){
  //     $state.go('sign-up');
  //   }

  //   $scope.login = function(credentials) {
  //     Authorization.login(credentials.email, credentials.password).then( function (isAuthenticated) {
  //       if (true) {
  //         $state.go('tab.map');
  //       } else {
  //         $state.go('login');
  //       }
  //     });
  //   };
  // });
