
angular.module('starter')

/* 
*	Get JSON
*/
.factory('Categories',function($http, $q, $localStorage) {


      var categories =  [
        {
          id:0,
          icon:'ion-android-bar',
          name:'bar',
          title:'Bar'
        },
        {
          id:1,
          icon:'ion-fork',
          name:'restaurant',
          title:'Restaurant'
        },
        {
          id:2,
          icon:'ion-ios-football',
          name:'sports',
          title:'Sport'
        },
        {
          id:3,
          icon:'ion-coffee',
          name:'cafe',
          title:"Coffeehouse"
        },
        {
          id:4,
          icon:'ion-ios-cart',
          name:'shop',
          title:"Shop"
        },
        {
          id:5,
          icon:'ion-calendar',
          name:'event',
          title:"Events"
        }


      ];

      if(!$localStorage.categories || !_.isArray($localStorage.categories))
        $localStorage.categories = [];

	return {
		all: function(url,params) {
      return categories;
		},
    toggle: function(categoryId){
      var categoryPos = $localStorage.categories.length ? $localStorage.categories.indexOf(categoryId) : -1;
      categoryPos >= 0 ? $localStorage.categories.splice(categoryPos,1) : $localStorage.categories.push(categoryId);
    },
    getActive:function(){
      return $localStorage.categories;
    },
    getIcon:function(id){
      return _.result(_.findWhere(categories, { 'name': id }), 'icon') || 'ion-ios-location';
    },
    clear:function(){
      $localStorage.categories = [];
    }

	}

});