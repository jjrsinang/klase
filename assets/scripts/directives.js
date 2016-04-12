(function(){
    'use strict';
    
    var app = angular.module('ui-elements', []);

    app.directive('klaseHeader', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-header.html'
      };
    });
    
    app.directive('klaseLogin', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-login.html'
      };
    });
    
    app.directive('klaseSidepanel', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-sidepanel.html'
      };
    });
    
    app.directive('klaseFeed', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-feed.html'
      };
    });
    
    app.directive('klaseProfile', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-profile.html'
      };
    });
    
    app.directive('klaseMessages', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-message.html'
      };
    });
    
    app.directive('klaseClassMaster', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-classmaster.html'
      };
    });
    
    app.directive('klaseClass', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-class.html'
      };
    });
    
    app.directive('klaseCalendar', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/main-calendar.html'
      };
    });
    
    app.directive('klaseClassPosts', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/class-posts.html'
      };
    });
    
    app.directive('klaseClassActivities', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/class-activities.html'
      };
    });
    
    app.directive('klaseClassActivity', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/class-activity.html'
      };
    });
    
    app.directive('klaseClassGrades', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/class-grades.html'
      };
    });
    
    app.directive('klaseClassMembers', function() {
      return {
        restrict: 'E',
        templateUrl: 'views/class-members.html'
      };
    });
    
  })();
