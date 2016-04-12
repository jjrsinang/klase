(function() {
'use strict';

/**
 * @ngdoc function
 * @name klaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the klaseApp
 */
angular.module('klaseApp')
  .controller('MembersCtrl', ['$scope', '$http', 'toastr',function ($scope, $http, toastr) {
    $scope.members = [
      {
        name: 'Alysa Dela Cruz'
      },
      {
        name: 'Belinda Chavez'
      },
      {
        name: 'Camille Landryto'
      },
      {
        name: 'Crenezza Louisse Valerio'
      },
      {
        name: 'Stephanie Pura'
      },
      {
        name: 'Ilonah Kris de Sena'
      },
      {
        name: 'Alodia Gosiengfiao'
      },
      {
        name: 'Jeanne Dumale'
      },
      {
        name: 'Cyen Lazam'
      }
    ];
    
  }]);
})();