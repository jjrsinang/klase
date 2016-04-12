(function() {
  'use strict';
  
  /**
   * @ngdoc function
   * @name klaseApp.controller:AboutCtrl
   * @description
   * # AboutCtrl
   * Controller of the klaseApp
   */
  angular.module('klaseApp')
    .controller('AboutCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
})();