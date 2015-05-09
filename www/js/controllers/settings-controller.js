angular.module('unearth.settingsController', [])
  .controller('SettingsController', function ($scope, $state, Authorization) {

    $scope.logout = function(){
      window.localStorage.removeItem('accessToken');
      $state.go('login');
    };
  });
