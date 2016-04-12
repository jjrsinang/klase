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
  .controller('ClassActivitiesCtrl', ['$scope', '$http', 'toastr',function ($scope, $http, toastr) {
    $scope.activities = [];
	$scope.activitySelected = null;
    $scope.loading = true;
    
    /* **************************************************************
	 * Fetch activities
	 * **************************************************************/
	var getEvents = function (sectionId) {
      $scope.loading = false;
      console.log('PUT /event');
	  $http.put('/event', {
		sectionId: sectionId
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.activities = sailsResponse.data;
		  return;
	  })
	  .catch(function onError(sailsResponse){
		
		if (sailsResponse.status == 500) {
			toastr.error('Error :(.', 'Error');
			return;
		}
	  })
      .finally(function eitherWay(){
        $scope.loading = false;
      });
	};
    
	// call functions
	//getEvents();
    
    /* **************************************************************
     * show class event
     * **************************************************************/
    $scope.$on('classActivities',function(e, section){
      getEvents(section.id);
    });
    
    $scope.test = function(index) {
      $scope.activitySelected = $scope.activities[index];
    };
    
  }]);
})();