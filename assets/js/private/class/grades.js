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
  .controller('GradesCtrl', ['$scope', '$http', 'toastr',function ($scope, $http, toastr) {
    $scope.activities = [
      {
        name: 'Exer 1',
        mark: 10
      },
      {
        name: 'Exer 2',
        mark: 10
      },
      {
        name: 'Assignment 1',
        mark: 15
      },
      {
        name: 'Exer 3',
        mark: 10
      }
    ];
    
    $scope.students = [
      {
        studentNumber: '2012-09876',
        name: 'Danny Doe',
        scores: [
          {id:1,score:10}, {id:2,score:10}, {id:3,score:15}, {id:3,score:10}
        ]
      },
      {
        studentNumber: '2012-12582',
        name: 'Mary Manda',
        scores: [
          {id:1,score:9}, {id:2,score:9}, {id:3,score:14}, {id:3,score:10}
        ]
      },
      {
        studentNumber: '2012-93520',
        name: 'Julie Peterson',
        scores: [
          {id:1,score:8}, {id:2,score:10}, {id:3,score:12}, {id:3,score:10}
        ]
      }
    ];
    
  }]);
})();