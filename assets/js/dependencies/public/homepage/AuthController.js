authApp.controller('AuthController',['$scope','$http',function($scope,$http){
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
				console.info("correcto");
				console.info(sailsResponse);
		}).catch(function onError(sailsResponse){
				console.info("incorrecto");
				console.info(sailsResponse);
		})
			.finally(function eitherWay(){
				console.info("finalmente");
			$scope.signupForm.loading = false;
		});	
	};
	
	//Controlador del formulario de login
	$scope.submitLoginForm = function(){
		console.info("click en submit loginForm");	
	};
	//Controlador del formulario de recordar password
	$scope.submitForgetPasswordForm = function(){
		console.info("click en submit loginForm");	
	};
	
}]);