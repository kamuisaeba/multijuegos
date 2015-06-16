/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
	//Registro de un usario
	signup: function(req, res) {
		var Passwords = require("machinepack-passwords");
		console.info("entramos en crear");
		Passwords.encryptPassword({
			password: req.param('password')
		}).exec({
			// An unexpected error occurred.
			error: function(err) {
				console.info("fallo en encriptacion");
				return res.negotiate(err);
			},
			// OK.
			success: function(encrypted) {
				console.info("entrando en crear usuario");
				User.create({
					name: req.param("name"),
					username: req.param("username"),
					email: req.param("email"),

					encryptedPassword: encrypted
				}, function userCreated(err, newUser) {
					if (err) {
						//console.info("error resolviendo");
						//console.info(err);
						return res.negotiate(err);
					}
					// Log user in
					req.session.me = newUser.id;

					// Send back the id of the new user
					return res.json({
						id: newUser.id
					});
				});
			},
		});
	},
	//Funcion de login de usuario
	login: function(req, res) {
		User.findOne().
		where({
			or: [{
				email: req.param("username")
			}, {
				username: req.param("username")
			}]
		}).exec(function(err, user) {
			if (err) return res.negotiate();
			if (!user) return res.notFound();
			var Passwords = require("machinepack-passwords");
			Passwords.checkPassword({
				passwordAttempt: req.param("password"),
				encryptedPassword: user.encryptedPassword,
			}).exec({
				// An unexpected error occurred.
				error: function(err) {
					return res.negotiate();
				},
				// Password attempt does not match already-encrypted version
				incorrect: function() {
					return res.notFound();
				},
				// OK.
				success: function() {
					req.session.me = user.id;
					return res.ok();
				},
			});
		});
	},
	//Funcion de logout de un usuario
	logout: function(req, res) {
		User.findOne(req.session.me, function foundUser(err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.notFound();
			User.update(user.id, {
				online : false
			}).exec(function(err) {
				if (err) return res.negotiate(err);

				// Tell anyone who is allowed to hear about it
				User.publishUpdate(req.session.me, {
					justBecameOffline: true,
					user: user.username
				});			
			req.session.me = null;
			return res.goHome();
		});
	});
	},
	forgetPassword: function(req, res) {
		//TODO
	},

	setOnline: function(req, res) {
		console.info(req.session.me);
		// Look up the currently-logged-in user
		User.findOne(req.session.me).exec(function(err, user) {
			if (err) return res.negotiate(err);
			if (!user) {
				return res.notFound('User associated with socket "coming online" no longer exists.');
			}

			// 15s timeout until inactive
			var INACTIVITY_TIMEOUT = 15 * 1000;

			// Update the `lastActive` timestamp for the user to be the server's local time.
			User.update(user.id, {
				lastLoggedIn: new Date(),
				online : true
			}).exec(function(err) {
				if (err) return res.negotiate(err);

				// Tell anyone who is allowed to hear about it
				User.publishUpdate(req.session.me, {
					justBecameActive: true,
					msUntilInactive: INACTIVITY_TIMEOUT,
					user: user.username
				});

				return res.ok();
			});
		});
	},

	findOnlineUsers: function(req, res) {
		User.watch(req);

		User.find({
			where: {
				online: true
			}
		}).exec(function(err, users) {
			if (err) return res.negotiate(err);
			var prunedUsers = [];
			_.each(users, function(user) {
				if (req.isSocket) {
					User.subscribe(req, user.id);
				}
				// Only send down white-listed attributes
				// (e.g. strip out encryptedPassword from each user)
				prunedUsers.push({
					id: user.id,
					name: user.name,
					email: user.email,
					username: user.title,
					lastLoggedIn: user.lastLoggedIn,

					// Add a property called "msUntilInactive" so the front-end code knows
					// how long to display this particular user as active.
					msUntilInactive: (function() {
						var _msUntilLastActive;
						var now = new Date();
						_msUntilLastActive = (user.lastLoggedIn.getTime() + 15 * 1000) - now.getTime();
						if (_msUntilLastActive < 0) {
							_msUntilLastActive = 0;
						}
						return _msUntilLastActive;
					})()
				});
			});

			// Finally, send array of users in the response
			return res.json(prunedUsers);
		});
	}
};