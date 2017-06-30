"use strict";

var app = angular.module("ShowsAround", ["LocalStorageModule", "spotify", "ionic"]);

//initializes firebase
app.run(function($rootScope, $location, FBCreds, AuthFactory, $state) {
    firebase.initializeApp(FBCreds);
    $rootScope.isSpotify = false;
});

let isAuth = (AuthFactory) =>
    new Promise((resolve, reject) => {
        AuthFactory.isAuthenticated()
            .then((userExists) => {
                if (userExists) {
                    console.log('Authenicated, go ahead');
                    resolve();
                } else {
                    console.log('Authenticated reject, GO AWAY');
                    reject();
                }
            });
    });



app.config(function($stateProvider, $urlRouterProvider) {
    // ********
    // ngRoute
    // ********

    // the routeProvider will help link partial URLS with their respective controllers
    //.state the url ends with a specific path, ngRoute will load a certain URL partial that is controlled by a certain partial
    // these will be display in the <div ng-view></div> on the index.html.


    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: 'partials/firebaselogin.html',
            controller: 'AuthCtrl'

        })
        .state('setlocation', {
            url: "/setlocation",
            templateUrl: 'partials/setlocation.html',
            controller: 'NavCtrl',
            resolve: { isAuth }
        })
        .state('spotify', {
            url: "/spotify",
            templateUrl: 'partials/spotifylogin.html',
            controller: 'AuthCtrl',
            resolve: { isAuth }
        })
        .state('showslist', {
            templateUrl: 'partials/shows-list.html',
            controller: "ShowsListCtrl",
            resolve: { isAuth }
        })
        .state('trackedshows', {
            templateUrl: 'partials/trackedshows.html',
            controller: "TrackedShowsCtrl",
            resolve: { isAuth }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
});




// *******
// SPOTIFY
// *******

// angular-spotify is an angularjs plugin that helps deal with iteracting with the spotify API. More info can be found at https://github.com/eddiemoore/angular-spotify#usage
app.config(function(SpotifyProvider, SpotifyCreds) {
    SpotifyProvider.setClientId(`${SpotifyCreds.ClientId}`);
    SpotifyProvider.setRedirectUri(`${SpotifyCreds.RedirectUri}`);
    SpotifyProvider.setScope(`${SpotifyCreds.Scope}`);
});


// *******
// Ionic
// *******


app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know.state you are doing. It stops the viewport
      // from snapping.state text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});








