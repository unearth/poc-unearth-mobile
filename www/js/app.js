angular.module('unearth', ['ionic', 'leaflet-directive', 'ngCordova', 'angular-jwt', 'unearth.mapController', 'unearth.signUpController', 'unearth.loginController', 'unearth.services'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });
  })

  .run(function($state, $rootScope, jwtHelper) {
    $rootScope.$on('$stateChangeStart', function(e, to) {
      if (to.data && to.data.requireLogin) {
        if ((!!localStorage.getItem('accessToken') === false) ||
        (jwtHelper.isTokenExpired(localStorage.getItem('accessToken')))) {
          e.preventDefault();
          $state.go('login');
        }
      }
    });
  })


  .config(function($stateProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider) {

    jwtInterceptorProvider.tokenGetter = function(){
      return localStorage.getItem('accessToken');
    };

  $httpProvider.interceptors.push('jwtInterceptor');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController',
      data: {
        requireLogin: false
      }
    })

    .state('sign-up', {
      url: '/sign-up',
      templateUrl: 'templates/sign-up.html',
      controller: 'SignUpController',
      data: {
        requireLogin: false
      }
    })

    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      data: {
        requireLogin: true
      }
    })

    .state('tab.map', {
      url: '/map',
      data: {
        requireLogin: true
      },
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapController'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/map');

    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header containing XMLHttpRequest used to identify ajax call
    //that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
