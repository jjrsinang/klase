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
  .controller('ClassFeedCtrl', ['$scope', '$http', 'toastr', '$cookies', 'Upload', function ($scope, $http, toastr, $cookies, Upload) {
    
    $scope.posts = [];
    $scope.tab = 1;
	$scope.section = null;
	$scope.loggedInUserId = $cookies.get('id');
	$scope.loggedInUserRole = $cookies.get('role');
	
    
    /* **************************************************************
	 * Fetch posts
	 * **************************************************************/
    var getPosts = function (sectionId) {
	  console.log('PUT /sectionposts');
	  $http.put('/sectionposts', {
		sectionId: sectionId
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.posts = sailsResponse.data;
		  console.log($scope.posts);
		  return;
	  })
	  .catch(function onError(sailsResponse){
		
		if (sailsResponse.status != 200) {
			toastr.error('Error :(.', 'Error ' + sailsResponse.status);
			return;
		}
	  });
    };
	
	/* **************************************************************
     * show class event
     * **************************************************************/
    $scope.$on('classPosts',function(e, section){
      getPosts(section.id);
    });
	
	$scope.$on('showClass',function(e, section){console.log('showClass');
      $scope.section = section;
    });
	
	/* **************************************************************
     * post
     * **************************************************************/
	// post without upload
    var post = function() {
      console.log('POST /post');
	  $http.post('/post', {
		message: $scope.message,
		sectionId: $scope.section.id,
		posterId: $scope.loggedInUserId
	  })
	  .then(function onSuccess(sailsResponse){
		  getPosts($scope.section.id);
		  return;
	  })
	  .catch(function onError(sailsResponse){
		
		if (sailsResponse.status != 200) {
			toastr.error('Error :(.', 'Error ' + sailsResponse.status);
			return;
		}
	  });
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: '/file/upload',
            data: {
			  file: file,
			},
			file: file,
			fields: {
			  'message': $scope.message || 'this is a test upload using 3rd party plugin',
			  'sectionId': $scope.section.id,
			  'posterId': $scope.loggedInUserId
			}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
			console.log(resp.data);
			getPosts($scope.section.id);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
			toastr.error('Error :(.', resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
	
	// upload later on form submit or something similar
    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file && $scope.message) {
        $scope.upload($scope.file);
      } else if ($scope.message) {
        post();
      }
    };
	
	/* **************************************************************
	 * Delete post
	 * **************************************************************/
	$scope.deletePost = function(postId) {
	  console.log('DELETE /post ' + postId);
	  return;
	  $http.delete('/post', {
		id: postId
	  })
	  .then(function onSuccess(sailsResponse){
		  getPosts($scope.section.id);
		  return;
	  })
	  .catch(function onError(sailsResponse){
		
		if (sailsResponse.status != 200) {
			toastr.error('Error :(.', 'Error ' + sailsResponse.status);
			return;
		}
	  });
	};
	
	
	/* **************************************************************
	 * Events
	 * **************************************************************/
	
	window.onbeforeunload = function (e) {
	  if ($scope.message || $scope.file) {
		console.log($scope.message);
		console.log($scope.file);
		return "Leaving this page will discard any unsaved changes you have made.";
	  }
	 };
	
	//$scope.$on('$locationChangeStart', function( event ) {
	//	var answer = confirm("Are you sure you want to leave this page?");
	//	if (!answer) {
	//		event.preventDefault();
	//	}
	//});
	
    
    /* **************************************************************
	 * Setters
	 * **************************************************************/
    $scope.isSet = function(checkTab) {
      return $scope.tab === checkTab;
    };
	
    $scope.setTab = function(activeTab) {
      $scope.tab = activeTab;
    };
    
  }]);
})();