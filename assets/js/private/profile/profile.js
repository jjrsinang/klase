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
      $scope.loggedInUserRole = $cookies.get('role');
      $scope.setdefault = function () {
        if ($scope.loggedInUserRole == 'Student') {
          $scope.fullname = $cookies.get('fullname');
          $scope.course = $cookies.get('course');
          $scope.idNo = $cookies.get('studentno');
          $scope.college = $cookies.get('college');
          $scope.birthday = $cookies.get('birthday');
        } else {
          $scope.fullname = $cookies.get('fullname');
          $scope.course = $cookies.get('rank');
          $scope.idNo = $cookies.get('employeeno');
          $scope.college = '-';
          $scope.birthday = $cookies.get('birthday');
        }
      };
      
    /* **************************************************************
     * show profile event
     * **************************************************************/
    $scope.$on('showProfile', function(e, poster){
      // $scope.fullname = poster.fName + " " + poster.mName + " " + poster.lName;
      // $scope.course = poster.course != null ? poster.course : poster.rank;
      // $scope.college = poster.college || '-';
      // $scope.birthday = poster.birthday || '-';
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