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
  .controller('ClassmasterCtrl', ['$scope', '$http', 'toastr', 'ngDialog', '$cookies', function ($scope, $http, toastr, ngDialog, $cookies) {
    $scope.allSections = [];
    $scope.saveTeacherLoading = false;
    $scope.availableTeachers = [];
    $scope.role = $cookies.get('role');

    var getSections = function () {
      console.log('GET /allsections');
	  $http.get('/allsections', {
		  
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.allSections = sailsResponse.data;
		  $scope.selectedTeacher = [];
		  for (var i = 0; i < $scope.allSections.length; i++) {
		  	$scope.selectedTeacher.push($scope.allSections[i].teacher.id);
		  };
		  return;
	  })
	  .catch(function onError(sailsResponse){
		toastr.error('Error '+sailsResponse.status, 'Error');
		return;
	  });
    };

    var getAvailableTeachers = function() {
    	console.log('GET /teachers');

    	$http.get('/teachers')
    	.then(function onSuccess(sailsResponse){
			$scope.availableTeachers = sailsResponse.data;
    	})
    	.catch(function onError(sailsResponse){
    		toastr.error('Error '+sailsResponse.status, 'Error');
			return;
    	});
    };
    
    if ($scope.role == 'Admin') {
    	$scope.setTab(4);
    	getSections();
    	getAvailableTeachers();
    }

    /* **************************************************************
	 * add student
	 * **************************************************************/
	 $scope.addStudent = function (section) {
	 	var dialog = ngDialog.open({
	 	 template: '<input type="text" placeholder="student no" ng-model="studentNo"/>'+
	 	 			'<button type="submit" class="btn btn-primary" ng-click="addStudent()">Add</button>'+
	 	 			'<span ng-show="loading" class="fa fa-spinner"></span>'+
	 	 			'<span ng-show="!loading && success">Success!</span>'+
	 	 			'<span ng-show="!loading && fail">Fail!</span>',
    	 plain: true, 
	 	 className: 'ngdialog-theme-default',
	 	 controller: ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
	        $scope.studentNo = null;
	        $scope.loading = false;
	        $scope.success = false;
	        $scope.fail = false;

	        $scope.addStudent = function(){
	        	$scope.loading = true;
	        	$http.put('/addstudent',{
	        		studentNo: $scope.studentNo,
	        		sectionId: section.id
	        	})
		    	.then(function onSuccess(sailsResponse){
					$scope.availableTeachers = sailsResponse.data;
					$scope.loading = false;
					$scope.success = true;
					$scope.fail = false;
		    	})
		    	.catch(function onError(sailsResponse){
		    		$scope.loading = false;
		    		$scope.success = false;
		    		$scope.fail = true;
		    		toastr.error('Error '+sailsResponse.status, 'Error');
					return;
		    	});

	        };
	     }]
	 	});

		dialog.closePromise.then(function (data) {
		    getSections();
		});
	 };

	/* **************************************************************
	 * remove student
	 * **************************************************************/
	 $scope.removeStudent = function (section) {
	 	var dialog = ngDialog.open({
	 	 template: '<input type="text" placeholder="student no" ng-model="studentNo"/>'+
	 	 			'<button type="submit" class="btn btn-primary" ng-click="removeStudent()">Remove</button>'+
	 	 			'<span ng-show="loading" class="fa fa-spinner"></span>'+
	 	 			'<span ng-show="!loading && success">Success!</span>'+
	 	 			'<span ng-show="!loading && fail">Fail!</span>',
    	 plain: true, 
	 	 className: 'ngdialog-theme-default',
	 	 controller: ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
	        $scope.studentNo = null;
	        $scope.loading = false;
	        $scope.success = false;
	        $scope.fail = false;

	        $scope.removeStudent = function(){
	        	$scope.loading = true;
	        	$http.put('/removestudent',{
	        		studentNo: $scope.studentNo,
	        		sectionId: section.id
	        	})
		    	.then(function onSuccess(sailsResponse){
					$scope.availableTeachers = sailsResponse.data;
					$scope.loading = false;
					$scope.success = true;
					$scope.fail = false;
		    	})
		    	.catch(function onError(sailsResponse){
		    		$scope.loading = false;
		    		$scope.success = false;
		    		$scope.fail = true;
		    		toastr.error('Error '+sailsResponse.status, 'Error');
					return;
		    	});

	        };
	     }]
	 	});

		dialog.closePromise.then(function (data) {
		    getSections();
		});
	 };

	 /* **************************************************************
	 * change teacher
	 * **************************************************************/
	 $scope.saveTeacher = function(section) {
	 	if (!$scope.selectedTeacher[section.id]) {
	 		return;
	 	}
	 	for (var i = 0; i < $scope.allSections.length; i++) {
	 		if ($scope.allSections[i].id == section.id) {
	 			console.log("Current teacher: "+$scope.allSections[i].teacher.fName);
	 			if ($scope.allSections[i].teacher.id == $scope.selectedTeacher[section.id].id) {
 					return;
 				}
 				$scope.saveTeacherLoading = true;
	 			for (var j = 0; j < $scope.availableTeachers.length; j++) {
		 			if ($scope.availableTeachers[j].id == $scope.selectedTeacher[section.id].id) {
						console.log("New teacher: "+$scope.availableTeachers[j].fName);

						$http.put('/changeteacher',{
			        		newTeacherId: $scope.selectedTeacher[section.id].id,
			        		oldTeacherId: $scope.allSections[i].teacher.id,
			        		sectionId: section.id
			        	})
				    	.then(function onSuccess(sailsResponse){
							$scope.saveTeacherLoading = false;
							getSections();
							toastr.success('Success '+sailsResponse.status, 'Success');
				    	})
				    	.catch(function onError(sailsResponse){
				    		$scope.saveTeacherLoading = false;
				    		toastr.error('Error '+sailsResponse.status, 'Error');
							return;
				    	});
						break;
		 			}
		 		};
		 		break;
	 		}
	 	};
	 };

	 /* **************************************************************
	 * add section
	 * **************************************************************/
	 $scope.addSection = function () {
	 	var dialog = ngDialog.open({
	 	 template:  '<form name="newSectionForm">'+
	 	 			'<input type="text" placeholder="course no" ng-model="newSection.courseNo" ng-required="required" maxlength="30"/>'+'<br>'+
	 	 			'<input type="text" placeholder="course title" ng-model="newSection.courseTitle" ng-required="required" maxlength="100"/>'+'<br>'+
	 	 			'<input type="number" placeholder="units" ng-model="newSection.units" ng-required="required" min="0" max="100"/>'+'<br>'+
	 	 			'<select placeholder="section type" ng-model="newSection.sectionType" ng-required="required">'+
	 	 				'<option value="">-- select section type --</option>'+
	 	 				'<option value="Lecture" >Lecture</option>'+
	 	 				'<option value="Laboratory">Laboratory</option>'+
	 	 			'</select>'+'<br>'+
	 	 			'<input type="text" placeholder="section name" ng-model="newSection.sectionName" ng-required="required" maxlength="15"/>'+'<br>'+
	 	 			'<input type="text" placeholder="schedule" ng-model="newSection.schedule" ng-required="required" maxlength="60"/>'+'<br>'+
	 	 			'<input type="number" placeholder="max slots" ng-model="newSection.slotsLimit" ng-required="required" min="10"/>'+'<br>'+
	 	 			'<select class="form-control" ng-model="newSection.teacherId" ng-options="t.fName+\' \'+t.lName for t in availableTeachers track by t.id" >'+
              			'<option value="">-- select teacher --</option>'+
          			'</select>'+'<br>'+
	 	 			'<button type="submit" class="btn btn-primary" ng-click="addSectionFn()">'+
	 	 				'<span ng-show="!loading">Add section</span>'+
            			'<span ng-show="loading" class="fa fa-spinner"></span>'+
	 	 			'</button>'+
	 	 			'</form>',
    	 plain: true, 
	 	 className: 'ngdialog-theme-default',
	 	 controller: ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
	        $scope.newSection = {
	        	courseNo: null,
	        	courseTitle: null,
	        	units: null,
	        	sectionType: null,
	        	sectionName: null,
	        	schedule: null,
	        	slotsLimit: null,
	        	teacherId: null
	        };
	        $scope.loading = false;
	        $scope.availableTeachers = [];

	        var getAvailableTeachers = function() {
		    	console.log('GET /teachers');

		    	$http.get('/teachers')
		    	.then(function onSuccess(sailsResponse){
					$scope.availableTeachers = sailsResponse.data;
		    	})
		    	.catch(function onError(sailsResponse){
		    		toastr.error('Error '+sailsResponse.status, 'Error');
					return;
		    	});
		    };
		    
		    getAvailableTeachers();

	        $scope.addSectionFn = function(){console.log($scope.newSection);
	        	if (!$scope.newSection.courseNo ||
	        		!$scope.newSection.courseTitle ||
	        		!$scope.newSection.units ||
	        		!$scope.newSection.sectionType ||
	        		!$scope.newSection.sectionName ||
	        		!$scope.newSection.schedule ||
	        		!$scope.newSection.slotsLimit ||
	        		!$scope.newSection.teacherId) {
	        		toastr.error('Error', 'Please fill all fields');
	        		return;
	        	}
	        	$scope.loading = true;
	        	$http.put('/addsection',{
	        		courseNo: $scope.newSection.courseNo,
		        	courseTitle: $scope.newSection.courseTitle,
		        	units: $scope.newSection.units,
		        	sectionType: $scope.newSection.sectionType,
		        	sectionName: $scope.newSection.sectionName,
		        	schedule: $scope.newSection.schedule,
		        	slotsLimit: $scope.newSection.slotsLimit,
		        	teacherId: $scope.newSection.teacherId.id
	        	})
		    	.then(function onSuccess(sailsResponse){
					getSections();
					$scope.loading = false;
					toastr.success('Success '+sailsResponse.status, 'Success');
		    	})
		    	.catch(function onError(sailsResponse){
		    		$scope.loading = false;
		    		toastr.error('Error '+sailsResponse.status, 'Error');
					return;
		    	});

	        };
	     }]
	 	});
	 };
    
  }]);
})();