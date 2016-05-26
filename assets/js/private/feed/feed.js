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
  .controller('FeedCtrl', ['$scope', '$http', 'toastr', '$cookies', 'Upload', 'ngDialog', function ($scope, $http, toastr, $cookies, Upload, ngDialog) {
    
    $scope.posts = [];
    $scope.tab = 1;
    $scope.accessibleSections = [];
    $scope.selectedSection = null;
	$scope.loggedInUserId = $cookies.get('id');
    $scope.loggedInUserRole = $cookies.get('role');
    $scope.loggedInUserName = $cookies.get('firstname') + ' ' + $cookies.get('lastname');
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
		  toastr.success('Success.', 'Success ' + sailsResponse.status);
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
			toastr.success('Success.', 'Success ' + sailsResponse.status);
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
       	$scope.form.$setPristine();
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
		  toastr.success('Success.', 'Success ' + sailsResponse.status);
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