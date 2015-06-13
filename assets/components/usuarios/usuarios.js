angular.module('dashApp.usuarios',[]).controller('UsuariosController', ['$scope',UsuariosController]);
function UsuariosController($scope){
	this.heading = 'Welcome to The New Angular Router Demo!';
}

/*
$scope.userList.loading = true;
      $scope.userList.errorMsg = '';
      io.socket.get('/users', function (data, jwr) {
        if (jwr.error) {
          // Display generic error, since there are no expected errors.
          $scope.userList.errorMsg = 'An unexpected error occurred: '+(data||jwr.status);

          // Hide loading spinner
          $scope.userList.loading = false;
          return;
        }
        // Populate the userList with the newly fetched users.
        $scope.userList.contents = data;

        // Initially set `isActive` on the user referred to by `$scope.me`
        // because if you're loading this page, your user must be active.
        var currentUser = _.find($scope.userList.contents, {id: $scope.me.id});
        currentUser.isActive = true;

        // Also initially set `msUntilInactive` to whatever the server told us
        // on any user marked as `isActive` by the server.
        var activeUsers = _.each($scope.userList.contents, function (user){
          if (user.msUntilInactive > 0){
            user.isActive = true;
          }
        });

        // Hide loading spinner
        $scope.userList.loading = false;

        // Because `io.socket.on` isn't `io.socket.$on` or something
        // we have to do this to render our changes into the DOM.
        $scope.$apply();
		console.info($cope.userList.contents);
      });
*/