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
  .controller('ClassmasterCtrl', ['$scope', '$http', 'toastr', function ($scope, $http, toastr) {
    $scope.allSections = [];
    
    var getSections = function () {
      console.log('GET /allsections');
	  $http.get('/allsections', {
		  
	  })
	  .then(function onSuccess(sailsResponse){
		  $scope.allSections = sailsResponse.data;
		  return;
	  })
	  .catch(function onError(sailsResponse){
		
		if (sailsResponse.status == 500) {
			toastr.error('Error :(.', 'Error');
			return;
		}
	  });
    };
    
    getSections();
    
  }]);
})();