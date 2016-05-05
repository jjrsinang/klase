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
  .controller('GradesCtrl', ['$scope', '$http', 'toastr', '$cookies', 'Upload', 'ngDialog', function ($scope, $http, toastr, $cookies, Upload, ngDialog) {
    $scope.section = null;
    $scope.loggedInUserId = $cookies.get('id');
    $scope.loggedInUserRole = $cookies.get('role');

    $scope.total = 0;
    $scope.activities = [];
    $scope.students = [];

    /* **************************************************************
     * Fetch grades
     * **************************************************************/
    var getMembers = function (sectionId) {
      console.log('PUT /membersbysection');
      $http.put('/membersbysection', {
        sectionId: sectionId
      })
      .then(function onSuccess(sailsResponse){
        $scope.students = sailsResponse.data;

        // get assignments for this section
        $http.put('/sectionassignments', {
          sectionId: sectionId,
          userId: $scope.loggedInUserRole=='Student' ? $scope.loggedInUserId : null
        })
        .then(function onSuccess(sailsResponse2){
          var activities = sailsResponse2.data;
          
          var assignmentIds = [];
          for (var i = 0; i < activities.length; i++) {
            assignmentIds.push(activities[i].id);
          };

          var dummyAssignments = [];
          for (var i = 0; i < assignmentIds.length; i++) {
            dummyAssignments.push({assignmentId:assignmentIds[i],score:0});
          };

          for (var i = 0; i < $scope.students.length; i++) {
            $scope.students[i].assignments = dummyAssignments;
          }

          for (var num = 0; num < $scope.students.length; num++) {
            // get submissions
            console.log('PUT /submissions');
            $http.put('/submissions', {
              assignmentIds: assignmentIds,
              studentId: $scope.students[num].id
            })
            .then(function onSuccess(sailsResponse3){
              if (sailsResponse3.data && sailsResponse3.data.length > 0) {
                // console.log('student id: '+sailsResponse3.data[0].student.id);
                var assignments = sailsResponse3.data;
                
                var tempAssignments = [];
                for (var i = 0; i < assignmentIds.length; i++) {
                  tempAssignments.push({assignmentId:assignmentIds[i],score:0});
                };

                for (var i = 0; i < $scope.students.length; i++) {
                  for (var j = 0; j < tempAssignments.length; j++) {
                    for (var k = 0; k < assignments.length; k++) {
                      // console.log('assid '+tempAssignments[j].assignmentId + ' == ' +assignments[k].assignmentId);
                      // console.log('studid '+$scope.students[i].id +' == ' +assignments[k].student.id);
                      if (tempAssignments[j].assignmentId == assignments[k].assignmentId &&
                          $scope.students[i].id == assignments[k].student.id &&
                          $scope.students[i].id == sailsResponse3.data[0].student.id) {
                        // console.log(tempAssignments[j].score);
                        // console.log(assignments[k].score);
                        tempAssignments[j].score = assignments[k].score;
                      }
                    };
                  };

                  if ($scope.students[i].id == sailsResponse3.data[0].student.id) {
                    // console.log(tempAssignments);
                    $scope.students[i].assignments = tempAssignments;
                  }

                  $scope.students[i].total = 0;
                  for (var j = 0; j < $scope.students[i].assignments.length; j++) {
                    $scope.students[i].total += $scope.students[i].assignments[j].score;
                  };
                }

                // console.log('students:');
                // console.log($scope.students);
              }

              return;
            })// get submissions END
            .catch(function onError(sailsResponse3){
              return;
            });
          };
          
        })// get assignments for this section END
        .catch(function onError(sailsResponse2){
          toastr.error('Error PUT /sectionassignments', 'Error ' + sailsResponse2.status);
          return;
        });

      })
      .catch(function onError(sailsResponse){
        toastr.error('Error :(.', 'Error ' + sailsResponse.status);
      });
    };

    var getActivities = function (sectionId) {
      console.log('PUT /sectionassignments');
      $http.put('/sectionassignments', {
        sectionId: sectionId,
        userId: $scope.loggedInUserRole=='Student' ? $scope.loggedInUserId : null
      })
      .then(function onSuccess(sailsResponse){
        $scope.activities = sailsResponse.data;
        $scope.total = 0;
        for (var i = 0; i < $scope.activities.length; i++) {
          $scope.total += $scope.activities[i].mark;
        };
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
     * show assignment event
     * **************************************************************/
     $scope.$on('classGrades',function(e, section){console.log('classGrades');
        //getActivities(section.id);
        //getMembers(section.id);

      });

     $scope.$on('showClass',function(e, section){console.log('showClass: grades');
        $scope.section = section;
        getActivities(section.id);
        getMembers(section.id);
      });
    
  }]);
})();