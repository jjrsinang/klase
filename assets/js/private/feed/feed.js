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
  .controller('FeedCtrl', ['$scope', '$http', 'toastr', '$cookies', 'Upload', function ($scope, $http, toastr, $cookies, Upload) {
    
    $scope.posts = [];
    $scope.tab = 1;
    $scope.accessibleSections = [];
    $scope.selectedSection = null;
	$scope.loggedInUserId = $cookies.get('id');
    $scope.loggedInUserRole = $cookies.get('role');
    $scope.file = null;
    
    /* **************************************************************
	 * Fetch posts
	 * **************************************************************/
    var getPosts = function () {
      console.log('PUT /posts');
	  $http.put('/posts', {
		userId: $scope.loggedInUserId
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.posts = sailsResponse.data;
		  return;
	  })
	  .catch(function onError(sailsResponse){
		
		if (sailsResponse.status != 200) {
			toastr.error('Error :(.', 'Error ' + sailsResponse.status);
			return;
		}
	  });
    };
    
    getPosts();
    
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
	 * comments
	 * **************************************************************/
    $scope.showCommentField = function(postId) {
    	for (var i = 0; i < $scope.posts.length; i++) {
    		if ($scope.posts[i].id == postId) {
    			$scope.posts[i].showCommentField = true;
    		}
		}
    };

    var fetchFreshPost = function (postId) {
    	console.log('GET /post/'+postId);
    	$http.get('/post/'+postId)
		.then(function onSuccess(sailsResponse){
			for (var i = 0; i < $scope.posts.length; i++) {
	    		if ($scope.posts[i].id == sailsResponse.data.id) {
	    			$scope.posts[i] = sailsResponse.data;
	    			$scope.posts[i].showCommentField = false;
		  			$scope.posts[i].commentTextField = null;
	    		}
			}
			return;
		})
		.catch(function onError(sailsResponse){
			toastr.error('Error :(.', 'Error ' + sailsResponse.status);
			return;
		});
    };

    var postComment = function (postId, comment) {
    	console.log('POST /postcomment');
    	$http.post('/postcomment', {
			postId: postId,
			commenterId: $scope.loggedInUserId,
			comment: comment
		})
		.then(function onSuccess(sailsResponse){
			fetchFreshPost(postId);
			return;
		})
		.catch(function onError(sailsResponse){
			toastr.error('Error :(.', 'Error ' + sailsResponse.status);
			return;
		});
    };

    $scope.postComment = function (postId) {
    	for (var i = 0; i < $scope.posts.length; i++) {
    		if ($scope.posts[i].id == postId) {
    			postComment(postId, $scope.posts[i].commentTextField);
    		}
		}
    };
    
    /* **************************************************************
     * post
     * **************************************************************/
    // post without upload
    var post = function() {
      console.log('POST /post');
	  $http.post('/post', {
		message: $scope.message,
		sectionId: $scope.selectedSection.id,
		posterId: $scope.loggedInUserId
	  })
	  .then(function onSuccess(sailsResponse){
	  	  clearPostFields();
		  getPosts();
		  return;
	  })
	  .catch(function onError(sailsResponse){
		toastr.error('Error '+sailsResponse.status, 'Error');
		return;
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
			  'sectionId': $scope.selectedSection.id,
			  'posterId': $scope.loggedInUserId
			}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
			console.log(resp.data);
			clearPostFields();
			getPosts();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            toastr.error('Error :(.', resp.status);
            clearPostFields();

        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    
    // upload later on form submit or something similar
    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file && $scope.message && $scope.selectedSection) {
        $scope.upload($scope.file);
      } else if ($scope.message && $scope.selectedSection) {
        post();
      }
    };

    var clearPostFields = function() {
		$scope.message = null;
       	$scope.selectedSection = null;
	};
    
    /* **************************************************************
	 * Delete post
	 * **************************************************************/
	$scope.deletePost = function(postId) {
	  console.log('DELETE /post ' + postId);
	  
	  $http.put('/deletepost', {
		id: postId
	  })
	  .then(function onSuccess(sailsResponse){
		  getPosts();
		  return;
	  })
	  .catch(function onError(sailsResponse){
		toastr.error('Error '+sailsResponse.status, 'Error');
		return;
	  });
	};
    
    /* **************************************************************
	 * display selected section
	 * **************************************************************/
	$scope.displaySelectedSection = function (section) {
      $scope.$emit('requestSetTab', 5);
	  $scope.$emit('requestShowClass', section);
	};
    
    /* **************************************************************
	 * view profile
	 * **************************************************************/
	$scope.displayProfile = function (poster) {
      $scope.$emit('requestShowProfile', poster);
	  //$scope.$emit('requestShowClass', section);
	};
    
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