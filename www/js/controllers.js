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

.controller('MapCtrl', function($scope, $ionicLoading, $compile,$http,corsURL,Categories) {
      function initialize() {
        var myLatlng = new google.maps.LatLng(61.497779, 23.762384);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          backgroundColor: "#fff"
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
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
 
      $scope.searchLocations = function() {
        
        $http({
          method: 'GET',
          headers : {"content-type" : "application/json"},
          url: corsURL+'http://visittampere.fi/api/search?limit=10&offset=0&tag='+tag+'&type=location'
            }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
      };

      $scope.categories= Categories.get();
      
    });


