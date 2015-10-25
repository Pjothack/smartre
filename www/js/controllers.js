angular.module('starter.controllers', [])
// URL to API that enables cross-origin requests to anywhere
 .value('CORSURL', '//cors-anywhere.herokuapp.com/')
 .value('APIURL', 'http://tittle.eu-gb.mybluemix.net/locations')
 .value('UPDATE_INTERVAL', '10000')


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  
})
.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location) {
 
    $scope.login = function() {
        $cordovaOauth.facebook("", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $location.path("/map");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };
 
})

.controller('MapCtrl', function($scope, $ionicLoading, $compile, $http, $timeout, $interval,CORSURL, APIURL, Categories,MapSettings,UPDATE_INTERVAL) {
      
      var markers = [];
      var markerObj = [];
      var infowindow = null;
      var updateMarkersPromise;
      var clearMarkers = function(){
        _.map(markerObj,function(item){
          item.setMap(null);
        })
      }
      var loading;




      function initialize() {

        var mapOptions = MapSettings;
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        $scope.map = map;


        map.addListener('zoom_changed', function() {
          _.map(markerObj,function(item,i){
            var t =  Math.round(markers[i].traffic.average*100) || 0;
            animateCircle(i,t,0)
          })
        });



      }
      //google.maps.event.addDomListener(window, 'load', initialize);
      initialize();


      $scope.clearAll = function(){
        clearMarkers();
        Categories.clear();
        updateActive();
      }

      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Loading...',
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
        loading = $ionicLoading.show({
          content: 'Loading...',
          showBackdrop: false
        });

        var selectedTags = Categories.getActive();
        clearMarkers();
        $http({
          method: 'GET',
          headers : {"content-type" : "application/json"},
          params: {limit:30, category: selectedTags.join(',')},
          url: CORSURL+APIURL
            }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available


            // hide loader
            $timeout(function(){
              $ionicLoading.hide();
            });

            var geocoder = new google.maps.Geocoder(); 
            var res = response.data;
            var traffic;
            var tag;
            markers = [];
            markerObj = [];
            infowindow = new google.maps.InfoWindow({
                  content: "content"
            });
            //Clear previous update promise
            $interval.cancel(updateMarkersPromise);

            //Start new update process
            updateMarkersPromise = $interval(updateMarkers, UPDATE_INTERVAL); 

            for(var i=0;i < res.length; i++){
                  markers.push(res[i]);
                  content = res[i].title +'<br>';
                  tag = Categories.getIcon(res[i].category);
                  var title = res[i].title;
                  // this is still random
                  traffic = Math.round(res[i].traffic.average*100) || 0;
                  // define activity class
                  var light = 'darkest';
                  if(traffic<25){
                    light = 'light';
                  }
                  else if(traffic<50){
                    light = 'medium';
                  }
                  else if(traffic<75){
                    light = 'dark';
                  }

                  // define label class
                  var className = "labels "+light;
                  // sale class, should come from markers[i].sale or something
                  if(res[i].discounts[0]){
                    content = res[i].title +'<br><span class="discount">'+ (res[i].discounts[0].description||'')+'</span>';
                    className += ' has-sale';
                  }

                  // Get center
                  var coords = new google.maps.LatLng(
                    res[i].latitude,
                    res[i].longitude
                    );        
                    // Set marker also
                    marker = new MarkerWithLabel({
                      position: coords, 
                      map: $scope.map,
                      title: title,
                      icon: ' ',
                      labelContent: '<span class="'+tag+'"></span><span class="ion-person-stalker activity icon"></span><span class="sale icon">%</span><svg class="progress" width="36" height="36" xmlns="http://www.w3.org/2000/svg"><g><circle id="circle_'+i+'" class="circle_animation" r="16" cy="18" cx="18" fill="none"/></g></svg>',
                      labelAnchor: new google.maps.Point(18, 18),
                      labelClass: className,
                      html: content                       
                    });
                    markerObj.push(marker);
                    animateCircle(i,traffic,500);
                    
                    google.maps.event.addListener(marker, 'click', function() {
                      infowindow.setContent(this.html)
                      infowindow.open($scope.map,this);
                    });
              }
            }, function errorCallback(response) {
              $ionicLoading.hide();
          });
      };



      var updateMarkers = function(){
        var selectedTags = Categories.getActive();
        $http({
          method: 'GET',
          headers : {"content-type" : "application/json"},
          params: {limit:30, category: selectedTags.join(',')},
          url: CORSURL+APIURL}).then(function successCallback(response) {
            var res = response.data;
            for(var i=0;i < res.length; i++){


                var traffic = Math.round(res[i].traffic.average*100 ) || 0;
                var light = 'darkest';
                  if(traffic<25){
                    light = 'light';
                  }else if(traffic<50){
                    light = 'medium';
                  } else if(traffic<75){
                    light = 'dark';
                  }
                
                var content = res[i].title +'<br>' +res[i].description;
                var tag = Categories.getIcon(res[i].category);

                var classes = "labels "+light;
                if(res[i].discounts[0]){
                    content = res[i].title +'<br><span class="discount">'+ (res[i].discounts[0].description||'')+'</span>';
                    classes += ' has-sale';
                }
                var labelContent = '<span class="'+tag+'"></span><span class="ion-person-stalker activity icon"></span><span class="sale icon">%</span><svg class="progress" width="36" height="36" xmlns="http://www.w3.org/2000/svg"><g><circle id="circle_'+i+'" class="circle_animation" r="16" cy="18" cx="18" fill="none"/></g></svg>';
                
                
                // update content
                markerObj[i].labelContent = labelContent;  
                markerObj[i].labelClass  = classes;
                animateCircle(i,traffic,500);

            }
          })  
      }




      $scope.categories = Categories.all();

      var animateCircle = function(id, traffic,time){
         $timeout(function(){
          if(document.getElementById('circle_'+id)){
            document.getElementById('circle_'+id).style.strokeDashoffset = (100-traffic);
          }
         },time);
      }

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


