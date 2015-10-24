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

      var markers = [];
      var infowindow = null;

 function onGeocodeComplete(i) {
            // Callback function for geocode on response from Google.
            // We wrap it in 'onGeocodeComplete' so we can send the
            // location index through to the marker to establish
            // content.
            var geocodeCallBack = function(results, status) {
                  if (status.toLowerCase() == 'ok') {
                      var content = markers[i].description;
                      tag = Categories.getIcon(markers[i].tags[0]);
                      var title = markers[i].title;
                      var rand = Math.floor(Math.random() * 100) + 1;

                      var light = 'light';
                      if(rand>25 && rand<50){
                        light = 'medium';
                      }
                      else if(rand>50){
                        light = 'dark';
                      }

                      // Get center
                      var coords = new google.maps.LatLng(
                        results[0]['geometry']['location'].lat(),
                        results[0]['geometry']['location'].lng()
                        );               
                        // Set marker also
                        marker = new MarkerWithLabel({
                          position: coords, 
                          map: $scope.map,
                          title: title,
                          icon: ' ',
                          labelContent: '<span class="'+tag+'"></span><span class="ion-person-stalker activity"></span><svg class="progress" width="36" height="36" xmlns="http://www.w3.org/2000/svg"><g><circle id="circle" class="circle_animation" r="16" cy="18" cx="18" style="stroke-dashoffset:'+(100-rand)+'"  fill="none"/></g></svg>',
                          labelAnchor: new google.maps.Point(22, 50),
                          labelClass: "labels "+light,
                          html: content                       
                        });
                        google.maps.event.addListener(marker, 'click', function() {
                          infowindow.setContent(this.html)
                          infowindow.open($scope.map,this);
                        });
                      }
            } // END geocodeCallBack()
            return geocodeCallBack;
        } // END onGeocodeComplete()


      var searchLocations = function() {
        var tag = Categories.getActive();
        $http({
          method: 'GET',
          headers : {"content-type" : "application/json"},
          url: corsURL+'http://visittampere.fi/api/search?limit=50&offset=0&tag=['+_.map(tag,function(item){return '"'+item+'"' })+']&type=location'
            }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            var geocoder = new google.maps.Geocoder(); 
            var res = response.data;
            markers = [];
            infowindow = new google.maps.InfoWindow({
                  content: "content"
            });
            for(var i=0;i < res.length; i++){
            markers.push(res[i]);
            geocoder.geocode( {'address': res[i].contact_info.address}, onGeocodeComplete(i));
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
        updateActive();
      }

      var updateActive = function(){
        $scope.selectedCategories = Categories.getActive();
        console.log($scope.selectedCategories );
      }

      updateActive();
      searchLocations();

      
    });


