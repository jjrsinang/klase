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
    .controller('ProfileCtrl', ['$scope', '$cookies', function ($scope, $cookies) {
      
      $scope.setdefault = function () {
        $scope.fullname = $cookies.get('fullname') || '-';
        $scope.course = $cookies.get('course') ? $cookies.get('rank') : '-';
        $scope.college = $cookies.get('college') || '-';
        $scope.birthday = $cookies.get('birthday') || '-';
      };
      
    /* **************************************************************
     * show profile event
     * **************************************************************/
    $scope.$on('showProfile', function(e, poster){
      $scope.fullname = poster.fName + " " + poster.mName + " " + poster.lName;
      $scope.course = poster.course != null ? poster.course : poster.rank;
      $scope.college = poster.college || '-';
      $scope.birthday = poster.birthday || '-';
    });
    
    /* **************************************************************
     * show profile event
     * **************************************************************/
     $scope.$on('showLoggedInProfile', function(e, poster){
      $scope.setdefault();
    });
     
    $scope.setdefault();
      
    }]);
})();