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
    
    // $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    // $scope.eventSource = {
    //         url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
    //         className: 'gcal-event',           // an option!
    //         currentTimezone: 'America/Chicago' // an option!
    // };
    /* event source that contains custom events on the scope */
    $scope.events = [
      // {title: 'All Day Event',start: new Date(y, m, 1)},
      // {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      // {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      // {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      // {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29)}
    ];
    // /* event source that calls a function on every view switch */
    // $scope.eventsF = function (start, end, timezone, callback) {
    //   var s = new Date(start).getTime() / 1000;
    //   var e = new Date(end).getTime() / 1000;
    //   var m = new Date(start).getMonth();
    //   var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
    //   callback(events);
    // };

    // $scope.calEventsExt = {
    //    color: '#f00',
    //    textColor: 'yellow',
    //    events: [ 
    //       {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //       {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //       {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29)}
    //     ]
    // };
    // /* alert on eventClick */
    // $scope.alertOnEventClick = function( date, jsEvent, view){
    //     $scope.alertMessage = (date.title + ' was clicked ');
    // };
    // /* alert on Drop */
    //  $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
    //    $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    // };
    // /* alert on Resize */
    // $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
    //    $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    // };
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
            '<input type="text" placeholder="title" ng-model="newEvent.title" ng-required="true"/><br>'+
            '<textarea ng-model="newEvent.message" name="message" class="form-control" rows="3" placeholder="Type event message here" ng-required="true"></textarea><br>'+
            '<input type="datetime-local" class="form-control" ng-model="newEvent.schedule" placeholder="due date" ng-required="true">'+
            '<input type="datetime-local" class="form-control" ng-model="newEvent.deadline" placeholder="due date" ng-required="true">'+
            '<select class="form-control" ng-model="newEvent.sectionId" ng-options="s.courseNumber+\' \'+s.sectionName for s in accessibleSections track by s.id" name="sectionId" >'+
                '<option value="">-- select section --</option>'+
            '</select><br>'+
            '<button type="submit" class="btn btn-primary" ng-click="addEventProcess()">Add event</button>'+
            '</form>',
         plain: true, 
       className: 'ngdialog-theme-default',
       controller: 'EventCtrl'
      });
        // $scope.events.push({
        //   title: 'result.title',
        //   start: new Date(),
        //   // end: new Date(y, m, d + 1),
        //   // className: ['openSesame']
        // });
        
    };
    $scope.refresh = function () {
      $scope.events.push({
          title: 'result.title',
          start: new Date(y-1, m, d),
          // end: new Date(y, m, d + 1),
          // className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {console.log('changeView');
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {console.log('render');
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
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: ''
        },
        // eventClick: $scope.alertOnEventClick,
        // eventDrop: $scope.alertOnDrop,
        // eventResize: $scope.alertOnResize,
        // eventRender: $scope.eventRender
      }
    };

    // $scope.changeLang = function() {
    //   if($scope.changeTo === 'Hungarian'){
    //     $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
    //     $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
    //     $scope.changeTo= 'English';
    //   } else {
    //     $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //     $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    //     $scope.changeTo = 'Hungarian';
    //   }
    // };
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
        for (var i = 0; i < sailsResponse.data.length; i++) {
          sailsResponse.data[i].start = sailsResponse.data[i].schedule;
          sailsResponse.data[i].end = sailsResponse.data[i].deadline;
          sailsResponse.data[i].className = ['openSesame'];
          $scope.events.push(sailsResponse.data[i])
        };
        $scope.renderCalender('myCalendar1');
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
      console.log($scope.selectedEvent);
    });

    $scope.$on('showCalendar',function(e){
      $scope.showEvent = false;
    });

    $scope.$on('hideEvent',function(e){
      $scope.showEvent = false;
    });



  }]);
})();