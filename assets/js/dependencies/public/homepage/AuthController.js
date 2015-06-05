authApp.controller('AuthController',['$scope','$http','toastr',function($scope,$http,toastr){
	$scope.signupForm = {
		loading : false
	};
	$scope.submitSignupForm = function(){
		console.info("entrando en signup form");
		$http.post("/signup", {
			name:	$scope.signupForm.fullname,
			email:	$scope.signupForm.email,
			username: $scope.signupForm.username,
			password: $scope.signupForm.password
		})
		.then(function onSuccess(sailsResponse){
			window.location = '/';
		}).catch(function onError(sailsResponse){
			var emailAddressAlreadyInUse = sailsResponse.status == 409;

			if (emailAddressAlreadyInUse) {
				toastr.error('That email address has already been taken, please try again.', 'Error');
				return;
			}
		})
			.finally(function eitherWay(){
			$scope.signupForm.loading = false;
		});	
	};
	
	//Controlador del formulario de login
	$scope.submitLoginForm = function(){
		$http.put('/login',{
			username: $scope.loginForm.username,
			password: $scope.loginForm.password
		}).then(function onSuccess(sailsResponse){
			window.location = '/';
		}).catch (function onError(sailsReponse){
		  // Handle known error type(s).
		  // Invalid username / password combination.
		  if (sailsResponse.status === 400 || 404) {
			// $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
			//
			toastr.error('Invalid email/password combination.', 'Error', {
			  closeButton: true
			});
			return;
		  }
			toastr.error('An unexpected error occurred, please try again.', 'Error', {
				closeButton: true
			});
			return;
    	}).finally(function eitherWay(){
      		$scope.loginForm.loading = false;	
		});
	};
	//Controlador del formulario de recordar password
	$scope.submitForgetPasswordForm = function(){
		console.info("click en submit loginForm");	
	};
	
}]);