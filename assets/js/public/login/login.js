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
    $scope.showCalendar = false;
    $scope.showAssignment = false;
    $scope.origin = window.location.origin;
    $scope.role = $cookies.get('role');
    $scope.isConnected = false;

    $scope.loggedIn = false;
    $scope.login = {
      loading: false,
      username: null,
      password: null
    };
    
    // cookies
    $scope.firstname = $cookies.get('firstname') || 'Profile';
    

    /* **************************************************************
     * Socket Subscription
     * **************************************************************/
     var subscribe = function () {
        // Announce that a new user is online--in this somewhat contrived example,
        // this also causes the CREATION of the user, so each window/tab is a new user.
        io.socket.get("/user/announce", {id: $cookies.get('id')}, function(data){

          // Get the current list of users online.  This will also subscribe us to
          // update and destroy events for the individual users.
          //io.socket.get('/user', updateUserList);

          // Get the current list of chat rooms. This will also subscribe us to
          // update and destroy events for the individual rooms.
          //io.socket.get('/room', updateRoomList);

        });


        // Listen for the "user" event, which will be broadcast when something
        // happens to a user we're subscribed to.  See the "autosubscribe" attribute
        // of the User model to see which messages will be broadcast by default
        // to subscribed sockets.
        io.socket.on('user', function messageReceived(message) {

          switch (message.verb) {

            // Handle user creation
            case 'created':
              // addUser(message.data);
              break;

            // Handle a user changing their name
            case 'updated':

              // // Get the user's old name by finding the <option> in the list with their ID
              // // and getting its text.
              // var oldName = $('#user-'+message.id).text();

              // // Update the name in the user select list
              // $('#user-'+message.id).text(message.data.name);

              // // If we have a private convo with them, update the name there and post a status message in the chat.
              // if ($('#private-username-'+message.id).length) {
              //   $('#private-username-'+message.id).html(message.data.name);
              //   postStatusMessage('private-messages-'+message.id,oldName+' has changed their name to '+message.data.name);
              // }

              break;

            // Handle user destruction
            case 'destroyed':
              // removeUser(message.id);
              break;

            // Handle private messages.  Only sockets subscribed to the "message" context of a
            // User instance will get this message--see the onConnect logic in config/sockets.js
            // to see where a new user gets subscribed to their own "message" context
            case 'messaged':
              receivePrivateMessage(message.data);
              break;

            default:
              break;
          }

        });

        console.log('Socket is now connected!');
        $scope.isConnected = true;

        // When the socket disconnects, hide the UI until we reconnect.
        io.socket.on('disconnect', function() {
          // Hide the chat UI
          $scope.isConnected = false;
        });
     };

    /* **************************************************************
     * Auth
     * **************************************************************/
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
        // subscribe();
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
        $cookies.put('lastname', sailsResponse.data.lName);
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
        $cookies.remove('lastname');
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
      $scope.showCalendar = false;
      $scope.showProfile = false;
      $scope.showClass = true;
      $scope.showEvent = false;
      $scope.showAssignment = false;
      $scope.$broadcast('showClass', section);
      $scope.$broadcast('hideEvent');
    });

    /* **************************************************************
     * show event event
     * **************************************************************/
    $scope.$on('requestShowEvent', function(e, event){
      $scope.showCalendar = false;
      $scope.showProfile = false;
      $scope.showClass = false;
      $scope.showEvent = true;
      $scope.showAssignment = false;
      $scope.$broadcast('showEvent', event);
    });

    /* **************************************************************
     * show assignment event
     * **************************************************************/
    $scope.$on('requestShowAssignment', function(e, assignment){
      $scope.showCalendar = false;
      $scope.showProfile = false;
      $scope.showClass = false;
      $scope.showEvent = false;
      $scope.showAssignment = true;
      $scope.$broadcast('showAssignment', assignment);
    });

    /* **************************************************************
     * show calendar event
     * **************************************************************/
    $scope.$on('requestShowCalendar', function(e){
      $scope.showCalendar = true;
      $scope.showProfile = false;
      $scope.showClass = false;
      $scope.showEvent = false;
      $scope.showAssignment = false;
      $scope.$broadcast('showCalendar');
      $scope.$broadcast('hideEvent');
    });
    
    /* **************************************************************
     * get class activities event
     * **************************************************************/
    $scope.$on('getClassActivities', function(e, section){
      $scope.showCalendar = false;
      $scope.showProfile = false;
      $scope.showClass = true;
      $scope.showEvent = false;
      $scope.showAssignment = false;
      $scope.$broadcast('classActivities', section);
      $scope.$broadcast('hideEvent');
    });
    
    /* **************************************************************
     * get class posts event
     * **************************************************************/
    $scope.$on('getClassPosts', function(e, section){
      $scope.showCalendar = false;
      $scope.showProfile = false;
      $scope.showClass = true;
      $scope.showEvent = false;
      $scope.showAssignment = false;
      $scope.$broadcast('classPosts', section);
      $scope.$broadcast('hideEvent');
    });

    /* **************************************************************
     * get class grades event
     * **************************************************************/
    $scope.$on('getClassGrades', function(e, section){
      $scope.showCalendar = false;
      $scope.showProfile = false;
      $scope.showClass = true;
      $scope.showEvent = false;
      $scope.showAssignment = false;
      $scope.$broadcast('classGrades', section);
      $scope.$broadcast('hideEvent');
    });

    /* **************************************************************
     * get class members event
     * **************************************************************/
    $scope.$on('requestClassMembers', function(e, section){
      $scope.showCalendar = false;
      $scope.showProfile = false;
      $scope.showClass = true;
      $scope.showEvent = false;
      $scope.showAssignment = false;
      $scope.$broadcast('getClassMembers', section);
      $scope.$broadcast('hideEvent');
    });
    
    /* **************************************************************
     * show profile event
     * **************************************************************/
    $scope.$on('requestShowProfile', function(e, poster){
      $scope.showCalendar = false;
      $scope.showProfile = true;
      $scope.showClass = false;
      $scope.showEvent = false;
      $scope.showAssignment = false;
      // $scope.setTab(99);
      $scope.$broadcast('showProfile', poster);
      $scope.$broadcast('hideEvent');
    });
    
    /* **************************************************************
     * set tab event
     * **************************************************************/
    $scope.$on('requestSetTab', function(e, index){
      $scope.showCalendar = false;
      $scope.showProfile = false;
      $scope.showClass = true;
      $scope.showEvent = false;
      $scope.showAssignment = false;
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

      if ($scope.tab <= 4) {
        $scope.showCalendar = false;
        $scope.$broadcast('hideEvent');
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