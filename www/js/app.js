angular.module('afloat', ['ionic', 'afloat.controllers', 'afloat.services', 'ngCordova', 'ngCookies', 'zingchart-angularjs'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    console.log('device is ready');

    window.plugin.notification.local.registerPermission(function(granted) {
      console.log('Permission has been granted: ' + granted);
    });
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('landing', {
    url: '/landing',
    controller: 'RegisterCtrl',
    templateUrl: 'templates/landing.html'
  })

  .state('signup', {
    url: '/signup',
    controller: 'RegisterCtrl',
    templateUrl: 'templates/signup.html'
  })

  .state('login', {
    url: '/login',
    controller: 'RegisterCtrl',
    templateUrl: 'templates/login.html'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.mood', {
      url: '/mood',
      views: {
        'tab-mood': {
          templateUrl: 'templates/tab-mood.html',
          controller: 'DashCtrl'
        }
      }
    })

  .state('tab.check', {
    url: '/check',
    views: {
      'tab-check': {
        templateUrl: 'templates/tab-check.html',
        controller: 'NightController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/landing');

});
