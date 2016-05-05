(function() {
  'use strict';
  
  /**
   * @ngdoc function
   * @name klaseApp.controller:AboutCtrl
   * @description
   * # AboutCtrl
   * Controller of the klaseApp
   */
  angular.module('klaseApp')
    .controller('ChatController', ['$http','$log','$scope', '$cookies', 'ngDialog', function ($http, $log, $scope, $cookies, ngDialog) {
      $scope.predicate = '-id';
      $scope.reverse = false;
      $scope.chatList =[];
      $scope.threadList =[];
      $scope.selectedThread = null;
      $scope.loggedInUserName = $cookies.get('fullname');
      $scope.loggedInUserId = $cookies.get('id');
      $scope.testObj = null;
      
      $scope.getAllchat = function(thread){

        // Socket connection can be initiated with io.socket.get call to /chat/addConv.
        io.socket.get('/chat/addconv');
        // Now retrieve the chat history upto now.
        $http.put('/chat/getconv',{
          user1: thread.participant1.id,
          user2: thread.participant2.id
        })
        .success(function(success_data){
           $scope.chatList = success_data;
           // console.log(success_data);
        });
      };

      $scope.getAllThreads = function(){
        // Now retrieve the chat history upto now.
        $http.put('/chat/getthread',{
          id: $scope.loggedInUserId
        })
        .success(function(success_data){
           $scope.threadList = success_data;
           // console.log(success_data);
        });
      };

      $scope.selectThread = function (thread) {
        $scope.selectedThread = thread;
        $scope.getAllchat(thread);
      };

      // $scope.getAllchat();
      $scope.getAllThreads();
      $scope.chatUser = $scope.loggedInUserName;
      $scope.chatMessage="";
      
      
      // io.socket.on() : Starts listening for server-sent events from Sails with the specified eventIdentity.
      // Will trigger the provided callback function when a matching event is received.
      // io.socket.on('chat',function(obj){
      //   //Check whether the verb is created or not
      //   // if(obj.verb === 'created'){
      //     console.log(obj);
      //     $scope.chatList.push(obj.data);
      //     // Add the data to current chatList
      //     // Call $scope.$digest to make the changes in UI
      //     $scope.$digest();
      //   // }
      // });

      io.socket.on('message',function(obj){
        //Check whether the verb is created or not
        console.log(obj);
        if(obj.verb === 'created' && 
          obj.data.threadId == $scope.selectedThread.id &&
          ($scope.loggedInUserId == obj.data.receiver || $scope.loggedInUserId == obj.data.senderId)){

          $scope.chatList.push(obj.data);
          // Add the data to current chatList
          // Call $scope.$digest to make the changes in UI
          $scope.$digest();
        }
      });
      
      // I use two models here chatUser and chatMessage. On send call sendMsg() function which is described as
      $scope.sendMsg = function(partnerId){
        // console.log($scope.chatMessage);
        var thread = $scope.selectedThread;

        if (!partnerId) {
          partnerId = thread.participant1.id == $cookies.get('id') ? thread.participant2.id : thread.participant1.id;
        }

        io.socket.post('/chat/addconv/',{
          message: $scope.chatMessage,
          sender: $cookies.get('id'),
          senderId: $cookies.get('id'),
          receiver: partnerId,
          receiverId: partnerId,
          user: $scope.chatUser
        });
        $scope.chatMessage = "";
      };

      $scope.sendMsg2 = function () {
        $scope.sendMsg($scope.testObj.originalObject.id);
        ngDialog.closeAll();
      };


      /* **************************************************************
       * new message
       * **************************************************************/
      $scope.showNewMessagePopup = function () {
        $scope.chatMessage = "";
        var dialog = ngDialog.open({
         template: '<angucomplete-alt id="members"'+
                      'placeholder="Search members"'+
                      'pause="400"'+
                      'selected-object="testObj"'+
                      'remote-url="http://localhost:1337/user/search?"'+
                      'title-field="fName,lName"'+
                      'description-field="role"'+
                      'input-class="form-control form-control-small"></angucomplete-alt><br>'+
                      '<div class="col-lg-12">'+
                        '<form>'+
                            '<div>'+
                                '<textarea class="form-control" rows="3" ng-model="chatMessage" placeholder="Type your message here"></textarea>'+
                            '</div>'+
                            '<button class="btn btn-default col-lg-2 col-md-2" ng-click="sendMsg2()">Send</button>  '+
                        '</form>'+
                      '</div>',
           plain: true, 
         className: 'ngdialog-theme-default',
         controller: 'ChatController'
        });
      };

    }]);
})();