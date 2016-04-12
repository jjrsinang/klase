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
  .controller('FeedCtrl', ['$scope', '$http', 'toastr', '$cookies', function ($scope, $http, toastr, $cookies) {
    
    $scope.posts = [];
    $scope.tab = 1;
    $scope.accessibleSections = [];
    $scope.selectedSection = null;
	$scope.loggedInUserId = $cookies.get('id');
    $scope.loggedInUserRole = $cookies.get('role');
    
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
		
		if (sailsResponse.status != 200) {
			toastr.error('Error :(.', 'Error ' + sailsResponse.status);
			return;
		}
	  });
    };
	
	getSections();
    
    /* **************************************************************
     * post
     * **************************************************************/
    // post without upload
    var post = function() {
      console.log('POST /post');
	  $http.post('/post', {
		message: $scope.message,
		sectionId: $scope.selectedSection,
		posterId: $scope.loggedInUserId
	  })
	  .then(function onSuccess(sailsResponse){
		  getPosts();
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
			  'sectionId': $scope.selectedSection,
			  'posterId': $scope.loggedInUserId
			}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
			console.log(resp.data);
			getPosts();
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