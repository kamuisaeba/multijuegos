dashboardApp.controller('DashboardController',['$scope','$http','toastr',function($scope,$http,toastr){
	// Just a hack so we can type `SCOPE` in the Chrome inspector.
  SCOPE=$scope;

  /////////////////////////////////////////////////////////////////////////////////
  // When HTML is rendered... (i.e. when the page loads)
  /////////////////////////////////////////////////////////////////////////////////

  // Set up initial objects
  // (kind of like our schema for the page)
  $scope.userProfile = {
    properties: {},
    errorMsg: '',
    saving: false,
    loading: false
  };

  $scope.userList = {
    loading: false,
    errorMsg: '',
    contents: []
  };

  $scope.changePasswordForm = {
    saving: false,
    errorMsg: '',
    properties: {}
  };

  // Pull representation of the current visitor from data bootstrapped into the
  // EJS view from ther server (i.e. `SAILS_LOCALS`)
  $scope.me = window.SAILS_LOCALS.me;


}]);