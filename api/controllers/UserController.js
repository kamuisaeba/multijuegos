/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	//Registro de un usario
	signup : function(req,res){
		var Passwords = require("machinepack-passwords");
		console.info("entramos en crear");
		Passwords.encryptPassword({
			 password: req.param('password')
			}).exec({
			// An unexpected error occurred.
			error: function (err){
				console.info("fallo en encriptacion");
				return res.negotiate(err);
			},
			// OK.
			success: function (encrypted){
				console.info("entrando en crear usuario");
				User.create({
					name: req.param("name"),
					email:req.param("email"),
					encryptedPassword: encrypted
				},function userCreated(err,newUser){
					console.info("resolviendo");
					if (err) {
						console.info("error resolviendo");
						console.info(err);
						return res.negotiate(err); 
					}
					return res.ok();
				});
			},
			});
	},
	//Funcion de login de usuario
	login : function (req,res){
		User.findone({email:req.param("email")}).exec (function (err,user){
			if (err) return res.negotiate();
			if (!user) return res.notFound();
			var Passwords = require ("machinepack-passwords");
			Passwords.checkPassword({
			passwordAttempt: req.param("password"),
			encryptedPassword: user.encryptedPassword,
			}).exec({
			// An unexpected error occurred.
			error: function (err){
				return res.negotiate();
			},
			// Password attempt does not match already-encrypted version
			incorrect: function (){
				return res.notFound();
			},
			// OK.
			success: function (){
				req.session.me = id;
				return res.ok();
			},
			});			
		});
	},
	//Funcion de logout de un usuario
	logout : function (req,res){
		
	},
	forgetPassword: function (req,res){
		
	}
};

