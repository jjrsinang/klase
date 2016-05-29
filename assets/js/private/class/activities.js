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
 .controller('ClassActivitiesCtrl', ['$scope', '$http', 'toastr', '$cookies', 'Upload', 'ngDialog', function ($scope, $http, toastr, $cookies, Upload, ngDialog) {

  $scope.section = null;
  $scope.loggedInUserId = $cookies.get('id');
  $scope.loggedInUserRole = $cookies.get('role');

  $scope.activities = [];
  $scope.assignments = [];
  $scope.assignmentSubmissions = [];
  $scope.activitySelected = null;
  $scope.loading = true;
  $scope.assignment = {
    title: null,
    message: null,
    file: null,
    mark: null,
    dueDate: null
  };

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
        toastr.error('Error '+sailsResponse.status, 'Error');
        return;
      })
      .finally(function eitherWay(){
        $scope.loading = false;
      });
    };

    /* **************************************************************
     * Fetch assignments
     * **************************************************************/
     var getAssignments = function (sectionId) {
      console.log('PUT /sectionassignments');
      $http.put('/sectionassignments', {
        sectionId: sectionId,
        userId: $scope.loggedInUserRole=='Student' ? $scope.loggedInUserId : null
      })
      .then(function onSuccess(sailsResponse){
        $scope.assignments = sailsResponse.data;
        return;
      })
      .catch(function onError(sailsResponse){
        toastr.error('Error PUT /sectionassignments', 'Error ' + sailsResponse.status);
        return;
      })
      .finally(function eitherWay(){
        $scope.loading = false;
      });
    };

    /* **************************************************************
     * assignment
     * **************************************************************/
  // post assignment without upload
  var postAssignment = function() {
    console.log('POST /postassignment');
    $http.post('/postassignment', {
      message: $scope.assignment.message,
      title: $scope.assignment.title,
      mark: $scope.assignment.mark,
      dueDate: $scope.assignment.dueDate,
      sectionId: $scope.section.id,
      posterId: $scope.loggedInUserId
    })
    .then(function onSuccess(sailsResponse){
      clearPostFields();
      getAssignments($scope.section.id);
      return;
    })
    .catch(function onError(sailsResponse){
      toastr.error('Error :(.', 'Error ' + sailsResponse.status);
        return;
      });
  };

    // upload on file select or drop
    $scope.uploadAssignment = function (file) {
      Upload.upload({
        url: '/file/uploadassignment',
        data: {
          file: file,
        },
        file: file,
        fields: {
          'message': $scope.assignment.message,
          'title': $scope.assignment.title,
          'mark': $scope.assignment.mark,
          'dueDate': $scope.assignment.dueDate,
          'sectionId': $scope.section.id,
          'posterId': $scope.loggedInUserId
        }
      }).then(function (resp) {
        toastr.success('Success', resp.config.data.file.name + ' uploaded.');
        clearPostFields();
        getAssignments($scope.section.id);
      }, function (resp) {
        toastr.error('Error :(.', resp.status);
          clearPostFields();
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };

  // upload later on form submit or something similar
  $scope.submitAssignment = function() {
    if ($scope.assignment.dueDate < new Date()) {
      toastr.info('Cannot select past dates','Invalid date');
      return;
    }

    if ($scope.assignmentForm.$valid && $scope.assignment.file) {
      // toastr.info('valid','');
      $scope.uploadAssignment($scope.assignment.file);
    } else if ($scope.assignmentForm.$valid) {
      // toastr.info('valid din','');
      postAssignment();
    }
  };

  /* **************************************************************
   * Delete assignment
   * **************************************************************/
   $scope.deleteAssignment = function(assignmentId) {
    console.log('PUT /deleteassignment ' + assignmentId);
    
    $http.put('/deleteassignment', {
      id: assignmentId
    })
    .then(function onSuccess(sailsResponse){
      getAssignments($scope.section.id);
      return;
    })
    .catch(function onError(sailsResponse){
      toastr.error('Error :(.', 'Error ' + sailsResponse.status);
        return;
      });
  };

  var clearPostFields = function() {
    $scope.selectedSection = null;
    $scope.assignment = {
      title: null,
      message: null,
      disable: true,
      file: null,
      mark: null,
      dueDate: null
    };
    $scope.assignmentForm.$setPristine();
  };

    	// call functions
    	//getEvents();

      /* **************************************************************
       * show assignment event
       * **************************************************************/
       $scope.$on('classActivities',function(e, section){
        getAssignments(section.id);
      });

       $scope.$on('showClass',function(e, section){console.log('showClass: activities');
          $scope.section = section;
        });

       $scope.test = function(index) {
        $scope.activitySelected = $scope.activities[index];
      };

    /* **************************************************************
     * submit assignment
     * **************************************************************/
     $scope.onClickSubmitAssignment = function (assignmentId) {
        var dialog = ngDialog.open({
         template:  '<form name="submitAssignmentForm">'+
              '<h4>Submit assignment</h4>'+
              '<input type="text" placeholder="title" ng-model="assignmentSubmission.title" ng-required="true" maxlength="30"/>'+'<br>'+
              '<textarea placeholder="description" ng-model="assignmentSubmission.message" ng-required="true" rows="3"></textarea>'+'<br>'+
              '<br>'+
              '<div class="btn btn-default btn-file" ngf-select ng-model="assignmentSubmission.file" name="file"'+
                'ngf-max-size="\'20MB\'" ngf-min-height="100"'+
                'ngf-resize="{width: 100, height: 100}">Upload...</div>'+
                '{{ assignmentSubmission.file.name }}'+
              '<button type="submit" class="btn btn-primary" ng-click="submitAssignment()">'+
                '<span ng-show="!loading">Submit</span>'+
                '<span ng-show="loading" class="fa fa-spinner"></span>'+
              '</button>'+
              '</form>',
           plain: true, 
           className: 'ngdialog-theme-default',
           controller: ['$scope', '$http', 'toastr', '$cookies', 'Upload', 'ngDialog', function ($scope, $http, toastr, $cookies, Upload, ngDialog) {
                $scope.required = true;
                $scope.assignmentSubmission = {
                  title: null,
                  message: null,
                  file: null
                };
                $scope.loggedInUserId = $cookies.get('id');
                $scope.loading = false;

                var clearFields = function () {
                  $scope.assignmentSubmission = {
                    title: null,
                    message: null,
                    file: null
                  };
                  $scope.loading = false;
                  ngDialog.closeAll();
                };
                
                $scope.submitAssignment = function () {
                  if (!$scope.submitAssignmentForm.$valid) {
                    return;
                  }
                  $scope.loading = true;

                  if ($scope.assignmentSubmission.file) {
                    Upload.upload({
                      url: '/file/uploadassignmentsubmission',
                      data: {
                        file: $scope.assignmentSubmission.file,
                      },
                      file: $scope.assignmentSubmission.file,
                      fields: {
                        title: $scope.assignmentSubmission.title,
                        message: $scope.assignmentSubmission.message,
                        studentId: $scope.loggedInUserId,
                        assignmentId: assignmentId
                      }
                    }).then(function (resp) {
                      toastr.success('Success', resp.config.data.file.name + ' uploaded.');
                      clearFields();
                    }, function (resp) {
                      toastr.error('Error :(.', resp.status);
                      clearFields();
                    }, function (evt) {
                      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });

                  } else {
                    $http.post('/postassignmentsubmission',{
                      title: $scope.assignmentSubmission.title,
                      message: $scope.assignmentSubmission.message,
                      studentId: $scope.loggedInUserId,
                      assignmentId: assignmentId
                    })
                    .then(function onSuccess(sailsResponse){
                      $scope.loading = false;
                      clearFields();
                      toastr.success('Success '+sailsResponse.status, 'Success');
                    })
                    .catch(function onError(sailsResponse){
                      $scope.loading = false;
                      clearFields();
                      toastr.error('Error '+sailsResponse.status, 'Error');
                      return;
                    });
                  }
                };
            }]
          });
       };


    /* **************************************************************
     * view assignment
     * **************************************************************/
      $scope.onClickViewAssignment = function (assignmentId) {
        var dialog = ngDialog.open({
         template:  '<div>'+
              '<h4>Submitted assignment</h4>'+
              '<a href="" style="color: red; float: right;" ng-click="deleteAssignmentSubmission()" ng-show="loggedInUserId == assignmentSubmission.studentId">Delete</a>'+
              '<span ng-show="loading">Loading...</span>'+
              '<input type="text" ng-model="assignmentSubmission.title" ng-readonly="true"/>'+'<br>'+
              '<textarea ng-model="assignmentSubmission.message" rows="3" ng-readonly="true"></textarea>'+'<br>'+
              '{{ assignmentSubmission.postDate | date: \'EEE MMM d, yyyy h:mm a\' }}<br>'+
              '<input type="number" ng-model="assignmentSubmission.score" ng-readonly="true"/>'+'<br>'+
              '<br>'+
              '<a href="{{ origin + \'/images/\' + assignmentSubmission.filename }}" target="_blank" class="btn btn-primary" ng-hide="assignmentSubmission.filename.length == 0 || assignmentSubmission.filename == null">'+
                  '<span class="glyphicon glyphicon-file"></span>{{ assignmentSubmission.file }}'+
              '</a>'+
              '</div>',
           plain: true, 
           className: 'ngdialog-theme-default',
           controller: ['$scope', '$http', 'toastr', '$cookies', 'Upload', 'ngDialog', function ($scope, $http, toastr, $cookies, Upload, ngDialog) {
                $scope.assignmentSubmission = {
                  title: null,
                  message: null,
                  score: null,
                  postDate: null,
                  file: null,
                  filename: null
                };
                $scope.loggedInUserId = $cookies.get('id');
                $scope.loading = true;
                
                var getAssignment = function () {
                  console.log('PUT /submission');
                  $http.put('/submission',{
                    studentId: $scope.loggedInUserId,
                    assignmentId: assignmentId
                  })
                  .then(function onSuccess(sailsResponse){
                    $scope.assignmentSubmission = sailsResponse.data;
                    console.log($scope.assignmentSubmission);
                    $scope.loading = false;
                    return;
                  })
                  .catch(function onError(sailsResponse){
                    toastr.error('Error PUT /submission', 'Error ' + sailsResponse.status);
                    $scope.loading = false;
                    return;
                  });
                };

                getAssignment();

                $scope.deleteAssignmentSubmission = function () {
                  console.log('PUT /deletesubmission ' + $scope.assignmentSubmission.id);
                  $http.put('/deletesubmission', {
                    id: $scope.assignmentSubmission.id,

                  })
                  .then(function onSuccess(sailsResponse){
                    toastr.success('Success', 'Success ' + sailsResponse.status);
                    return;
                  })
                  .catch(function onError(sailsResponse){
                    toastr.error('Error :(.', 'Error ' + sailsResponse.status);
                    return;
                  });
                };
            }]
          });
       };


     $scope.showSubmitField = function (assignmentId) {
      if ($scope.loggedInUserRole == 'Teacher') {
        return false;
      }
      for (var i = 0; i < $scope.assignments.length; i++) {
        if ($scope.assignments[i].id == assignmentId) {
          if ($scope.assignments[i].submissions && 
              $scope.assignments[i].submissions.length > 0) {
            return false;
          }
        }
      };
      return true;
     };


    /* **************************************************************
     * view assignment 
     * **************************************************************/
     var getSubmissions = function (assignment) {
        console.log('PUT /submissions');
        $http.put('/submissions', {
          assignmentIds: [assignment.id]
        })
        .then(function onSuccess(sailsResponse){
          toastr.success('Success', 'Success ' + sailsResponse.status);
          $scope.assignmentSubmissions = sailsResponse.data;
          return;
        })
        .catch(function onError(sailsResponse){
          toastr.error('Error :(.', 'Error ' + sailsResponse.status);
          return;
        });
     };

     $scope.showActivity = function (assignment) {
      $scope.activitySelected = assignment;
      getSubmissions(assignment);
     };

     $scope.submitGrade = function (submissionId, score) {
        console.log('PUT /submitgrade');
        $http.put('/submitgrade', {
          id: submissionId,
          score: score
        })
        .then(function onSuccess(sailsResponse){
          toastr.success('Success', 'Success ' + sailsResponse.status);
          return;
        })
        .catch(function onError(sailsResponse){
          toastr.error('Error :(.', 'Error ' + sailsResponse.status);
          return;
        });
     };

     $scope.$on('showAssignment',function(e, assignment){
      $scope.assignmentSelected = assignment;
      // console.log($scope.selectedEvent);
    });

     $scope.datediff = function(first, second) {
      return new Date(first)-new Date(second);
     }


    }]);
})();