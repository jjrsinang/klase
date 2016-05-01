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
  .controller('SidepanelCtrl', ['$scope', '$http', 'toastr', '$cookies', function ($scope, $http, toastr, $cookies) {
    $scope.sections = [];
	$scope.events = [];
	$scope.loggedInUserId = $cookies.get('id');
    
	/* **************************************************************
	 * Fetch sections
	 * **************************************************************/
    var getSections = function () {
	  console.log('PUT /section');
	  $http.put('/section', {
		  userId: $scope.loggedInUserId
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.sections = sailsResponse.data;
		  return;
	  })
	  .catch(function onError(sailsResponse){
		toastr.error('Error '+sailsResponse.status, 'Error');
		return;
	  });
    };
	
	/* **************************************************************
	 * Fetch events
	 * **************************************************************/
	var getEvents = function () {
	  console.log('GET /event');
	  $http.get('/event', {
		  
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.events = sailsResponse.data;
		  return;
	  })
	  .catch(function onError(sailsResponse){
		toastr.error('Error '+sailsResponse.status, 'Error');
		return;
	  });
	};
	
	/* **************************************************************
	 * display selected section
	 * **************************************************************/
	$scope.displaySelectedSection = function (index) {
	  $scope.$emit('requestShowClass', $scope.sections[index]);
	};
    
	// call functions
    getSections();
	getEvents();
    
  }]);
})();