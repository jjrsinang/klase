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
    .controller('ChatController', ['$http','$log','$scope', '$cookies', function ($http, $log, $scope, $cookies) {
      $scope.predicate = '-id';
      $scope.reverse = false;
      $scope.chatList =[];
      $scope.loggedInUserName = $cookies.get('fullname');
      
      $scope.getAllchat = function(){
        // Socket connection can be initiated with io.socket.get call to /chat/addConv.
        io.socket.get('/chat/addconv');
        // Now retrieve the chat history upto now.
        $http.put('/chat/getconv',{
          user1: 1,
          user2: 2
        })
          .success(function(success_data){
             $scope.chatList = success_data;
             console.log(success_data);
          });
      };

      $scope.getAllchat();
      $scope.chatUser = $scope.loggedInUserName;
      $scope.chatMessage="";
      
      
      // io.socket.on() : Starts listening for server-sent events from Sails with the specified eventIdentity.
      // Will trigger the provided callback function when a matching event is received.
      io.socket.on('chat',function(obj){
        //Check whether the verb is created or not
        if(obj.verb === 'created'){
          console.log(obj)
          $scope.chatList.push(obj.data);
          // Add the data to current chatList
          // Call $scope.$digest to make the changes in UI
          $scope.$digest();
        }
      });
      
      // I use two models here chatUser and chatMessage. On send call sendMsg() function which is described as
      $scope.sendMsg = function(){
        console.log($scope.chatMessage);
        io.socket.post('/chat/addconv/',{
          message: $scope.chatMessage,
          sender: $cookies.get('id'),
          senderId: $cookies.get('id'),
          receiver: 1, // !!!!!!!change this!!!!!!!
          receiverId: 1,
          user: $scope.chatUser
        });
        $scope.chatMessage = "";
      };
    }]);
})();