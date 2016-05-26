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
	$scope.upcomingEvents = [];
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
	  console.log('PUT /event');
	  $http.put('/event', {
		  userId: $scope.loggedInUserId
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.events = sailsResponse.data;
		  // compute days left
		  var curDate = new Date();
		  for (var i = 0; i < $scope.events.length; i++) {
		  	$scope.events[i].timeLeftStart = mindiff(curDate, new Date($scope.events[i].schedule));
		  	$scope.events[i].timeLeftEnd = mindiff(curDate, new Date($scope.events[i].deadline));
		  	
		  	if ($scope.events[i].timeLeftStart > 0) {
		  		if ($scope.events[i].timeLeftStart > 60*24) {
		  			$scope.events[i].label = Math.round($scope.events[i].timeLeftStart / (60*24)) + ' days left';
		  		} else if ($scope.events[i].timeLeftStart > 60) {
		  			$scope.events[i].label = Math.round($scope.events[i].timeLeftStart / (60)) + ' hours left';
		  		} else {
		  			$scope.events[i].label = Math.round($scope.events[i].timeLeftStart) + ' minutes left';
		  		}
		  		$scope.upcomingEvents.push($scope.events[i]);
		  	} else if ($scope.events[i].timeLeftEnd > 0) {
		  		$scope.events[i].label = 'in progess';
		  		$scope.upcomingEvents.push($scope.events[i]);
		  	}
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
	var mindiff = function(first, second) {
	    return Math.round((second-first)/(1000*60));
	}
    
  }]);
})();