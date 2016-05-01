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
    $scope.members = [];

  /* **************************************************************
   * Fetch members
   * **************************************************************/
  var getMembers = function (sectionId) {
    console.log('PUT /membersbysection');
    $http.put('/membersbysection', {
      sectionId: sectionId
    })
    .then(function onSuccess(sailsResponse){
      $scope.members = sailsResponse.data;
      //toastr.error('Success', 'Success ' + sailsResponse.status);
    })
    .catch(function onError(sailsResponse){
      toastr.error('Error :(.', 'Error ' + sailsResponse.status);
    });
  };

  /* **************************************************************
   * show class event
   * **************************************************************/
  $scope.$on('getClassMembers',function(e, section){
    getMembers(section.id);
  });
    
  }]);
})();