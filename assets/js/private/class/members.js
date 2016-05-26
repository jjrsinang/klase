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
  .controller('MembersCtrl', ['$scope', '$http', 'toastr', '$cookies', 'ngDialog', function ($scope, $http, toastr, $cookies, ngDialog) {
    $scope.members = [];
    $scope.loggedInUserRole = $cookies.get('role');

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
      $scope.$emit('fetchedMembers', $scope.section, $scope.members);
      //toastr.error('Success', 'Success ' + sailsResponse.status);
    })
    .catch(function onError(sailsResponse){
      toastr.error('Error :(.', 'Error ' + sailsResponse.status);
    });
  };

  /* **************************************************************
   * add/remove students
   * **************************************************************/
   $scope.addStudent = function () {
    var section = $scope.section;

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
        getMembers(section.id);
    });
   };

   $scope.removeStudent = function(student){
    var section = $scope.section;
    $http.put('/removestudent',{
      studentNo: student.studentNo,
      sectionId: section.id
    })
    .then(function onSuccess(sailsResponse){
      getMembers(section.id);
      toastr.success('Success', 'Success ' + sailsResponse.status);
    })
    .catch(function onError(sailsResponse){
      toastr.error('Error '+sailsResponse.status, 'Error');
    return;
    });

    };

  /* **************************************************************
   * show class event
   * **************************************************************/
  $scope.$on('getClassMembers',function(e, section){
    getMembers(section.id);
  });

  $scope.$on('showClass',function(e, section){console.log('showClass: members');
    $scope.section = section;
    getMembers(section.id);
  });
    
  }]);
})();