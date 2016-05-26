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
  .controller('ClassFeedCtrl', ['$scope', '$http', 'toastr', '$cookies', 'Upload', 'ngDialog', function ($scope, $http, toastr, $cookies, Upload, ngDialog) {
    
    $scope.posts = [];
    $scope.tab = 1;
	$scope.section = null;
	$scope.loggedInUserId = $cookies.get('id');
	$scope.loggedInUserRole = $cookies.get('role');
	$scope.loggedInUserName = $cookies.get('firstname') + ' ' + $cookies.get('lastname');
	$scope.file = null;

    
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
		  for (var i = 0; i < $scope.posts.length; i++) {
		  	$scope.posts[i].showCommentField = false;
		  	$scope.posts[i].commentTextField = null;
		  };
		  return;
	  })
	  .catch(function onError(sailsResponse){
		toastr.error('Error PUT /sectionposts.', 'Error ' + sailsResponse.status);
		return;
	  });
    };

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

    $scope.showComments = function(postId) {
    	for (var i = 0; i < $scope.posts.length; i++) {
    		if ($scope.posts[i].id == postId) {
    			$scope.posts[i].showComments = true;
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
			toastr.error('Error GET /post/'+postId, 'Error ' + sailsResponse.status);
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
			toastr.success('Success.', 'Success ' + sailsResponse.status);
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

    $scope.deleteComment = function (commentId) {
		console.log('PUT /deletecomment');
    	$http.put('/deletecomment', {
			id: commentId
		})
		.then(function onSuccess(sailsResponse){
			fetchFreshPost(postId);
			toastr.success('Success.', 'Success ' + sailsResponse.status);
			return;
		})
		.catch(function onError(sailsResponse){
			toastr.error('Error :(.', 'Error ' + sailsResponse.status);
			return;
		});
    };
	
	/* **************************************************************
     * show class event
     * **************************************************************/
    $scope.$on('classPosts',function(e, section){
      getPosts(section.id);
    });
	
	$scope.$on('showClass',function(e, section){console.log('showClass: feed');
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
	  	  clearPostFields();
		  getPosts($scope.section.id);
		  toastr.success('Success.', 'Success ' + sailsResponse.status);
		  return;
	  })
	  .catch(function onError(sailsResponse){
		toastr.error('Error :(.', 'Error ' + sailsResponse.status);
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
			  'sectionId': $scope.section.id,
			  'posterId': $scope.loggedInUserId
			}
        }).then(function (resp) {
        	toastr.success('Success', resp.config.data.file.name + ' uploaded.');
			clearPostFields();
			getPosts($scope.section.id);
        }, function (resp) {
			toastr.error('Error :(.', resp.status);
			clearPostFields();
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
	
	// upload later on form submit or something similar
    $scope.submit = function() {
      if ($scope.form.$valid && $scope.file) {
        $scope.upload($scope.file);
      } else if ($scope.form.$valid) {
        post();
      }
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
		  getPosts($scope.section.id);
		  toastr.success('Success.', 'Success ' + sailsResponse.status);
		  return;
	  })
	  .catch(function onError(sailsResponse){
		toastr.error('Error :(.', 'Error ' + sailsResponse.status);
		return;
	  });
	};

	var clearPostFields = function() {
		$scope.message = null;
       	$scope.selectedSection = null;
       	$scope.file = null;
       	$scope.form.$setPristine();
	};
	
	/* **************************************************************
	 * view profile
	 * **************************************************************/
	$scope.displayProfile = function (poster) {
		var bday = new Date(poster.birthday);
		var month = new Array();
			month[0] = "January";
			month[1] = "February";
			month[2] = "March";
			month[3] = "April";
			month[4] = "May";
			month[5] = "June";
			month[6] = "July";
			month[7] = "August";
			month[8] = "September";
			month[9] = "October";
			month[10] = "November";
			month[11] = "December";
		var str = '<div class="post img-rounded">'+
			        '<img class="avatar" ng-src="images/yeoman.png" />'+
			        '<span><b>'+poster.fName+' '+poster.mName+' ' +poster.lName+'</b></span>'+
			        '<br />'+
			        '<span>'+ (poster.studentNo ? poster.studentNo : poster.employeeNo) +'</span>'+
			        '<br />'+
			        '<span>'+(poster.course ? poster.course : poster.rank) +'</span>'+
			        '<br />'+
			        '<span>'+ (poster.college ? poster.college : "-") +'</span>'+
			        '<br />'+
			        '<span>'+ month[bday.getMonth()] +' ' + bday.getDate() + ', '+ bday.getFullYear() +'</span>'+
			    '</div>';
		
		var dialog = ngDialog.open({
	       template: str,
	         plain: true
	      });

      // $scope.$emit('requestShowProfile', poster);
	  //$scope.$emit('requestShowClass', section);
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