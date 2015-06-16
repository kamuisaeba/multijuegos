angular.module('dashApp.usuarios',[]).controller('UsuariosController',[ 
function (){
    var myScope = this;
    var me = window.SAILS_LOCALS.me;
    myScope.userList = {};
	io.socket.get('/users', function (data, jwr) {
    myScope.userList.loading = true;
       myScope.userList.errorMsg = '';
      io.socket.get('/users', function (data, jwr) {
        if (jwr.error) {
          // Display generic error, since there are no expected errors.
           myScope.userList.errorMsg = 'An unexpected error occurred: '+(data||jwr.status);

          // Hide loading spinner
           myScope.userList.loading = false;
          return;
        }
        // Populate the myScope.userList with the newly fetched users.
         myScope.userList.contents = data;

        // Initially set `isActive` on the user referred to by ` me`
        // because if you're loading myScope page, your user must be active.
        var currentUser = _.find( myScope.userList.contents, {id:  me.id});
        currentUser.isActive = true;

        // Also initially set `msUntilInactive` to whatever the server told us
        // on any user marked as `isActive` by the server.
        var activeUsers = _.each( myScope.userList.contents, function (user){
          if (user.msUntilInactive > 0){
            user.isActive = true;
          }
        });

        // Hide loading spinner
         myScope.userList.loading = false;

        // Because `io.socket.on` isn't `io.socket.$on` or something
        // we have to do myScope to render our changes into the DOM.
         myScope.$apply();
		console.info(myScope.userList.contents);
      });
    });
}]);
