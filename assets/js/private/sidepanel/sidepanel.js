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
		  for (var i = 0; i < $scope.events.length; i++) {
		  	$scope.events[i].daysLeft = daydiff(new Date(), new Date($scope.events[i].schedule));
		  };
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

	/* **************************************************************
	 * display selected event
	 * **************************************************************/
	$scope.displaySelectedEvent = function (index) {
	  $scope.$emit('requestShowEvent', $scope.events[index]);
	};

	/* **************************************************************
	 * display calendar
	 * **************************************************************/
	$scope.displayCalendar = function (index) {
	  $scope.$emit('requestShowCalendar');
	};
    
	// call functions
    getSections();
	getEvents();

	/* **************************************************************
	 * ulits
	 * **************************************************************/
	var daydiff = function(first, second) {
	    return Math.round((second-first)/(1000*60*60*24));
	}
    
  }]);
})();