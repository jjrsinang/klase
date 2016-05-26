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
  .controller('ClassCtrl', ['$scope', '$http', 'toastr',function ($scope, $http, toastr) {
    $scope.tab = 1;
    $scope.section = null;
    $scope.members = [];
    
    /* **************************************************************
     * show class event
     * **************************************************************/
    $scope.$on('showClass',function(e, section){
      $scope.section = section;
      
      if ($scope.tab == 1) {
        $scope.$emit('getClassPosts', $scope.section);
      }
      else if ($scope.tab == 2) {
        $scope.$emit('getClassActivities', $scope.section);
      }
      else if ($scope.tab == 3) {
        $scope.$emit('getClassGrades', $scope.section);
      }
      else if ($scope.tab == 4) {
        $scope.$emit('requestClassMembers', $scope.section);
      }
    });

    $scope.$on('fetchedMembers',function(e, section, members){
      $scope.members = members;
    });
    
    /* **************************************************************
     * get class activities
     * **************************************************************/
    $scope.getActivities = function () {
      $scope.$emit('getClassActivities', $scope.section);
    };
    
    /* **************************************************************
     * Setters
     * **************************************************************/
    $scope.isSet = function(checkTab) {
      return $scope.tab === checkTab;
    };

    $scope.setTab = function(activeTab) {
      $scope.tab = activeTab;
    };
    
  }]);
})();