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
  .controller('ViewCtrl', ['$scope', '$cookies', '$http', 'toastr', function ($scope, $cookies, $http, toastr) {
    
    $scope.tab = 1;
    $scope.sidePanel = 0;
    $scope.showClass = false;
    $scope.showProfile = false;
    $scope.origin = window.location.origin;
    $scope.role = $cookies.get('role');
    
    $scope.loggedIn = false;
    $scope.login = {
      loading: false,
      username: null,
      password: null
    };
    
    // cookies
    $scope.firstname = $cookies.get('firstname') || 'Profile';
    
    var isLoggedIn = function () {
      console.log('GET /auth');
      // Submit request to Sails.
      $http.get('/auth')
      .then(function onSuccess (sailsResponse){
        //console.log(sailsResponse);
        //toastr.success('Authentication Successful', 'Success', {
        //    closeButton: true
        //});
        $scope.loggedIn = sailsResponse.data;
      })
      .catch(function onError(sailsResponse) {
        console.log('error');
        toastr.error('An unexpected error occurred, please try again.', 'Error', {
            closeButton: true
        });
      
      });
    };
    
    isLoggedIn();
    
    /* **************************************************************
     * Login
     * **************************************************************/
    $scope.loginPressed = function () {
      
      $scope.login.loading = true;
      
      // Submit request to Sails.
      console.log('PUT /login');
      $http.put('/login', {
        username: $scope.login.username,
        password: $scope.login.password
      })
      .then(function onSuccess (sailsResponse){
        // Refresh the page now that we've been logged in.
        $cookies.put('firstname', sailsResponse.data.fName);
        $cookies.put('fullname', sailsResponse.data.fName + ' ' + sailsResponse.data.mName + ' ' + sailsResponse.data.lName);
        $cookies.put('role', sailsResponse.data.role);
        $cookies.put('id', sailsResponse.data.id);
        $cookies.put('birthday', sailsResponse.data.birthday);
        
        $cookies.put('course', sailsResponse.data.course);
        $cookies.put('college', sailsResponse.data.college);
        $cookies.put('studentno', sailsResponse.data.studentNo);
        
        $cookies.put('employeeno', sailsResponse.data.employeeNo);
        $cookies.put('rank', sailsResponse.data.rank);
        
        window.location = '/';
      })
      .catch(function onError(sailsResponse) {
  
        // Invalid username / password combination.
        if (sailsResponse.status === 400 || 404) {
          toastr.error('Invalid username/password combination.', 'Error', {
            closeButton: true
          });
          return;
        }
  
        // Handle unknown error type(s).
        toastr.error('An unexpected error occurred, please try again.', 'Error', {
            closeButton: true
        });
        return;
  
      })
      .finally(function eitherWay(){
        $scope.login.loading = false;
      });
    };
    
    /* **************************************************************
     * Logout
     * **************************************************************/
    $scope.logoutPressed = function () {
      console.log('GET /logout');
      $http.get('/logout')
      .then(function onSuccess (){
        // Refresh the page now that we've been logged out.
        $cookies.remove('firstname');
        $cookies.remove('fullname');
        $cookies.remove('role');
        $cookies.remove('id');
        $cookies.remove('birthday');
        
        $cookies.remove('course');
        $cookies.remove('college');
        $cookies.remove('studentno');
        
        $cookies.remove('employeeno');
        
        window.location = '/';
      })
      .catch(function onError(sailsResponse) {
        // Handle unknown error type(s).
        toastr.error('An unexpected error occurred, please try again.', 'Error', {
            closeButton: true
        });
        return;
      });
    };
    
    
    /* **************************************************************
     * show class event
     * **************************************************************/
    $scope.$on('requestShowClass', function(e, section){
      $scope.showClass = true;
      $scope.$broadcast('showClass', section);
    });
    
    /* **************************************************************
     * get class activities event
     * **************************************************************/
    $scope.$on('getClassActivities', function(e, section){
      $scope.showClass = true;
      $scope.$broadcast('classActivities', section);
    });
    
    /* **************************************************************
     * get class posts event
     * **************************************************************/
    $scope.$on('getClassPosts', function(e, section){
      $scope.showClass = true;
      $scope.$broadcast('classPosts', section);
    });

    /* **************************************************************
     * get class grades event
     * **************************************************************/
    $scope.$on('getClassGrades', function(e, section){
      $scope.showClass = true;
      $scope.$broadcast('classGrades', section);
    });

    /* **************************************************************
     * get class members event
     * **************************************************************/
    $scope.$on('requestClassMembers', function(e, section){
      $scope.showClass = true;
      $scope.$broadcast('getClassMembers', section);
    });
    
    /* **************************************************************
     * show profile event
     * **************************************************************/
    $scope.$on('requestShowProfile', function(e, poster){
      $scope.showProfile = true;
      $scope.setTab(7);
      $scope.$broadcast('showProfile', poster);
    });
    
    /* **************************************************************
     * set tab event
     * **************************************************************/
    $scope.$on('requestSetTab', function(e, index){
      $scope.showClass = true;
      $scope.setTab(index);
    });
    
    /* **************************************************************
     * Setters
     * **************************************************************/
    $scope.isSet = function(checkTab) {
      return $scope.tab === checkTab;
    };

    $scope.setTab = function(activeTab) {
      $scope.tab = activeTab;
      
      if ($scope.tab == 2) {
        $scope.$broadcast('showLoggedInProfile');
      }
    };
    
    $scope.isPanel = function (checkPanel) {
      return $scope.sidePanel === checkPanel;
    };
    
    $scope.setPanel = function (activePanel) {
      $scope.sidePanel = activePanel;
    };
    
  }]);
})();