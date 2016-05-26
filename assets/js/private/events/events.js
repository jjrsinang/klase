(function() {
'use strict';

/**
 * @ngdoc function
 * @name klaseApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the klaseApp
 */
angular.module('klaseApp')
  .controller('EventCtrl', ['$scope', '$compile', '$timeout', 'uiCalendarConfig', '$http', 'toastr', 'ngDialog', '$cookies', function ($scope, $compile, $timeout, uiCalendarConfig, $http, toastr, ngDialog, $cookies) {

    $scope.loggedInUserId = $cookies.get('id');
    $scope.loggedInUserRole = $cookies.get('role');
    $scope.accessibleSections = [];
    $scope.eventsList = [];
    $scope.showEvent = false;
    $scope.selectedEvent = null;
    $scope.newEvent = {
      title: null,
      message: null,
      schedule: null,
      deadline: null,
      sectionId: null
    };

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* event source that contains custom events on the scope */
    $scope.events = [];
    
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      var dialog = ngDialog.open({
       template: '<form name="newEventForm">'+
            '<input type="text" class="form-control" placeholder="title" ng-model="newEvent.title" ng-required="true"/><br>'+
            '<textarea ng-model="newEvent.message" name="message" class="form-control" rows="3" placeholder="Type event message here" ng-required="true"></textarea><br>'+
            'Start: <input type="datetime-local" class="form-control" ng-model="newEvent.schedule" placeholder="due date (yyyy-MM-dd)" ng-required="true">'+
            'End: <input type="datetime-local" class="form-control" ng-model="newEvent.deadline" placeholder="due date (yyyy-MM-dd)" ng-required="true">'+
            '<select class="form-control" ng-model="newEvent.sectionId" ng-options="s.courseNumber+\' \'+s.sectionName for s in accessibleSections track by s.id" name="sectionId" >'+
                '<option value="">-- select section --</option>'+
            '</select><br>'+
            '<button type="submit" class="btn btn-primary" ng-click="addEventProcess()">Add event</button>'+
            '</form>',
         plain: true, 
       className: 'ngdialog-theme-default',
       controller: 'EventCtrl'
      });
    };

    $scope.refresh = function () {
      $scope.events.push({
          title: 'result.title',
          start: new Date(y-1, m, d)
          // end: new Date(y, m, d + 1),
          // className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'uibTooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };

     /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
      var schedule = new Date(date.schedule);
      var deadline = new Date(date.deadline);
        var dialog = ngDialog.open({
         template:
              '<input type="text" class="form-control" value="'+date.title+'" ng-readonly="true"/><br>'+
              '<textarea class="form-control" rows="3" ng-readonly="true">'+date.message+'</textarea><br>'+
              '<input type="text" class="form-control" value="'+schedule+'" ng-readonly="true">'+
              '<input type="text" class="form-control" value="'+deadline+'" ng-readonly="true">'+
              '<input type="text" class="form-control" value="'+date.section.courseNumber + ' ' + date.section.sectionName+'" ng-readonly="true"/><br>',
           plain: true, 
         className: 'ngdialog-theme-default',
         controller: 'EventCtrl'
        });
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 420,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: ''
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    /* Change View */
    $scope.renderCalender = function (calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            // console.log('.', uiCalendarConfig.calendars[calendar]);
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    
    /* event sources array*/
    $scope.eventSources = [$scope.events];
    // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];


    /* **************************************************************
     * get sectios by user
     * **************************************************************/
    var getSections = function () {
      console.log('PUT /section');
      $http.put('/section', {
        userId: $scope.loggedInUserId
      })
      .then(function onSuccess(sailsResponse){
        $scope.accessibleSections = sailsResponse.data;
        return;
      })
      .catch(function onError(sailsResponse){
        toastr.error('Error '+sailsResponse.status, 'Error');
        return;
      });
    };
    
    getSections();


    /* **************************************************************
     * events
     * **************************************************************/
    $scope.addEventProcess = function () {
      if (!$scope.newEventForm.$valid) {
        return;
      }

      if ($scope.newEvent.schedule < new Date()) {
        toastr.info('Cannot select past dates for start date','Invalid date');
        return;
      }

      if ($scope.newEvent.deadline < new Date()) {
        toastr.info('Cannot select past dates for end date','Invalid date');
        return;
      }

      console.log('POST /createevent');
      $http.post('/createevent', {
        title: $scope.newEvent.title,
        message: $scope.newEvent.message,
        schedule: $scope.newEvent.schedule,
        deadline: $scope.newEvent.deadline,
        sectionId: $scope.newEvent.sectionId.id
      })
      .then(function onSuccess(sailsResponse){
        var result = sailsResponse.data;
        $scope.events.push({
          title: result.title,
          start: result.schedule,
          end: result.deadline
        });
        toastr.error('Success '+sailsResponse.status, 'Success');
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
        for (var i = 0; i < sailsResponse.data.length; i++) {
          sailsResponse.data[i].start = sailsResponse.data[i].schedule;
          sailsResponse.data[i].end = sailsResponse.data[i].deadline;
          sailsResponse.data[i].className = ['openSesame'];
          $scope.events.push(sailsResponse.data[i])
        };
        $scope.renderCalender('calendar');
        // $scope.eventsList = sailsResponse.data;
        return;
      })
      .catch(function onError(sailsResponse){
      toastr.error('Error '+sailsResponse.status, 'Error');
      return;
      });
    };

    getEvents();


    /* **************************************************************
     * show event event
     * **************************************************************/
    $scope.$on('showEvent',function(e, event){
      $scope.showEvent = true;
      $scope.selectedEvent = event;
      // console.log($scope.selectedEvent);
    });

    $scope.$on('showCalendar',function(e){
      $scope.showEvent = false;
      
      $timeout(function () {
          $scope.refresh();
          window.fireEvent('resize');
          $scope.renderCalender('calendar');
      }, 500);
    });

    $scope.$on('hideEvent',function(e){
      $scope.showEvent = false;
    });



  }]);
})();