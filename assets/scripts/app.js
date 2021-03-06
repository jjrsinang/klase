(function(){
'use strict';

/**
 * @ngdoc overview
 * @name klaseApp
 * @description
 * # klaseApp
 *
 * Main module of the application.
 */
angular
  .module('klaseApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.sortable',
    'LocalStorageModule',
    'ui-elements',
    'ui.calendar',
    'ui.bootstrap',
    'toastr',
    'compareTo',
    'ngFileUpload',
    'ngDialog',
    'angucomplete-alt'
  ])
  
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'ViewCtrl', // login.js
        controllerAs: 'view'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
})();