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
  .controller('Sidepanel2Ctrl', ['$scope', '$http', 'toastr', '$cookies', function ($scope, $http, toastr, $cookies) {
    $scope.sections = [];
	$scope.assignments = [];
	$scope.loggedInUserId = $cookies.get('id');
	$scope.loggedInUserRole = $cookies.get('role');
    
	/* **************************************************************
	 * Fetch pending assignments
	 * **************************************************************/
	var getAssignments = function () {
	  console.log('PUT /pendingassignments');
	  $http.put('/pendingassignments', {
		  userId: $scope.loggedInUserId
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.assignments = sailsResponse.data;
		  // compute days left
		  var curDate = new Date();
		  for (var i = 0; i < $scope.assignments.length; i++) {
		  	var diff = datediff(curDate, new Date($scope.assignments[i].dueDate));
		  	if (diff < 0) {
		  		$scope.assignments[i].isLate = true;
		  	} else {
		  		$scope.assignments[i].isLate = false;
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
	 * display selected event
	 * **************************************************************/
	$scope.displaySelectedAssignment = function (index) {
	  $scope.$emit('requestShowAssignment', $scope.assignments[index]);
	};
    
	// call functions
	if ($scope.loggedInUserRole == 'Student') {
		getAssignments();
	}

	/* **************************************************************
	 * ulits
	 * **************************************************************/
	var datediff = function(first, second) {
	    return Math.round(second-first);
	}
    
  }]);
})();