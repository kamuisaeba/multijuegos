angular.module('dashApp', ['ngNewRouter', 'toastr','dashApp.usuarios']).controller('DashCtrl', ['$router', 'toastr', '$http', '$scope',
	function ($router, toastr, $http, $scope) {
		// Just a hack so we can type `SCOPE` in the Chrome inspector.
		SCOPE = $scope;

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

		// Let Sails know we've come online.
		io.socket.put('/me/online', {
			_csrf: window.SAILS_LOCALS._csrf
		}, function(unused, jwr) {
			if (jwr.error) {
				console.error('Error announcing new socket connection to Sails:', jwr);
				return;
			}

			// OK! Now Sails knows we're online.
		});
		$router.config([
			{ path: '/',			redirectTo: '/usuarios'},
			{ path: '/usuarios',			component: {'usuarios' : 'usuarios' }},
		]);

	}
]);