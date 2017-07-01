"use strict";

app.controller("NavCtrl", function($scope, $location, AuthFactory, DataFactory, LocationFactory, $timeout, Spotify, $rootScope, $state, $ionicModal, $ionicPopup) {


    //This determines if a user is logged in to trigger some ng-show elements in the navbar.html partial
    $scope.isLoggedIn = false;

    $scope.newArtist = {
        name: ""
    };


    $scope.newLocation = {
        name: ""
    };



     $ionicModal.fromTemplateUrl('partials/locationModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.locationModal = modal;
      });

      $scope.openLocationModal = function() {
        console.log("LOG");
        $scope.locationModal.show();
      };
      $scope.closeLocationModal = function() {
        $scope.locationModal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.locationModal.remove();
      });


      $ionicModal.fromTemplateUrl('partials/searchModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.searchModal = modal;
      });

      $scope.openSearchModal = function() {
        console.log("LOG");
        $scope.searchModal.show();
      };
      $scope.closeSearchModal = function() {
        $scope.searchModal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.searchModal.remove();
      });




    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.isLoggedIn = true;
            console.log("currentUser logged in", user, $scope.isLoggedIn);
            $scope.$apply();
        } else {
            $scope.isLoggedIn = false;
            console.log("currentUser logged in", $scope.isLoggedIn);
            $location.path("/");
        }
    });

    // logout firebase
    $scope.logout = () => {
        console.log("NO ONE IS LOGGED IN");
        AuthFactory.logout()
            .then(function(data) {
                $state.go("/");
                console.log(AuthFactory.getUser());
            }, function(error) {
                console.log("error occured on logout");
            });
    };

    $scope.getNewArtist = function() {
        Spotify.search($scope.newArtist.name, 'artist').
        then((response) => {
            console.log("Response From Spotify Search", response);
            $scope.newArtist.picture = response.data.artists.items[0].images[0].url;
        });
        DataFactory.getSingleShow($scope.newArtist)
            .then((response) => {
                // $route.reload();
            });
    };

    // if user enters new city this will change the city to search by in the Location Factory
    $scope.newCity = function() {
        LocationFactory.newCity($scope.newLocation.city);
        $scope.closeLocationModal();
        $state.go("showslist");
        $scope.newLocation.city = "";
    };

        // if user enters new city this will change the city to search by in the Location Factory
    $scope.loadNewCity = function() {
        LocationFactory.newCity($scope.newLocation.city);
        $scope.closeLocationModal();
        $state.reload();
        $scope.newLocation.city = "";
    };


    // $scope.reloadPage = function() {
    //     $route.reload();
    // };

    $scope.showLocation = function() {
        console.log("Show Location", LocationFactory.getCurrentCity());
    };

    // triggers the LocationFactory to get the current city - since it is a javascript method and not a promise, need to use a timeout to make sure the browser has had enough time to gather the info before sending it to the getCityByCoords function
    $scope.getCurrentLocation = function() {
        LocationFactory.getCoords()
            .then((coords) => {
                    $scope.currentLocation = coords;
                    return LocationFactory.getCityByCoords($scope.currentLocation.lat, $scope.currentLocation.long);
                },
                () => {
                    console.error("ERROR GETTING COORDINATES");
                })
            .then(() => {
                $("#loadingModal").modal('close');
                $location.url('/showslist');
                // $route.reload();
            });
    };

});
