
var app = angular.module('unearth', ['ionic', 'leaflet-directive', 'ngCordova']);

// app.run(function($ionicPlatform, $location, $rootScope, $timeout) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)
//     if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//     }
//     if (window.StatusBar) {
//       // org.apache.cordova.statusbar required
//       StatusBar.styleLightContent();
//     }

//     $timeout(function() {
//       $location.path('/tab/dash');
//       $rootScope.$apply();
//     }, 5000);
//   });
// });

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  $stateProvider

  .state('sign-in', {
    url: '/sign-in',
    templateUrl: 'templates/sign-in.html'
  })
  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'MapController'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('map');

}]);