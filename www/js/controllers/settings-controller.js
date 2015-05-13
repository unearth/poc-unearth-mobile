angular.module('unearth.settingsController', [])
  .controller('SettingsController', function ($scope, $state, Authorization) {

    $scope.logout = function(){
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('waypoints');
      $state.go('login');
    };
  });
