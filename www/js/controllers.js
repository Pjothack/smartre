angular.module('starter.controllers', [])
// URL to API that enables cross-origin requests to anywhere
 .value('corsURL', '//cors-anywhere.herokuapp.com/')

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  
})

.controller('MapCtrl', function($scope, $ionicLoading, $compile, $http, corsURL, Categories,MapSettings) {
      function initialize() {

        var mapOptions = MapSettings;
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        

        $scope.map = map;
      }
      //google.maps.event.addDomListener(window, 'load', initialize);
      initialize();

      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };

      var searchLocations = function() {
        var tag = Categories.getActive();
        $http({
          method: 'GET',
          headers : {"content-type" : "application/json"},
          url: corsURL+'http://visittampere.fi/api/search?limit=50&offset=0&tag=bar&type=location'
            }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            var geocoder = new google.maps.Geocoder(); 
            var res = response.data;
            for(var i=0;i < res.length; i++){
              console.log();
              var title = res[i].title;
                geocoder.geocode({
                    address : res[i].contact_info.address, 
                    //region: 'no' 
                  },
                    function(results, status) {
                      if (status.toLowerCase() == 'ok') {
                      // Get center
                      var coords = new google.maps.LatLng(
                        results[0]['geometry']['location'].lat(),
                        results[0]['geometry']['location'].lng()
                        );                        
                        // Set marker also
                        marker = new google.maps.Marker({
                          position: coords, 
                          map: $scope.map,
                          title: title,
                          content: title,
                          icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        });
               
                        }
                    }
                );
              }
            }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      };
      $scope.categories = Categories.all();

      $scope.toggleCategory = function(id){
        Categories.toggle(id);
        searchLocations();
      }

      
    });


