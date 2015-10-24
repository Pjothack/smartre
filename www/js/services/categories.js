
angular.module('starter')

/* 
*	Get JSON
*/
.factory('Categories',['$http','$q', function($http, $q) {

	return {
		get: function(url,params) {
			var categories =  [
        {
          id:0,
          icon:'ion-android-bar',
          name:'restaurant',
          title:'Nightlife'
        },
        {
          id:1,
          icon:'ion-ios-football-outline',
          name:'sport',
          title:'Sport'
        },
        {
          id:2,
          icon:'ion-coffee',
          name:'coffee',
          title:"Coffeehouse"
        }

      ];
      return categories;
		}
	}

}]);