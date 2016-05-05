/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /***************************************************************************
   * Check the provided email address and password, and if they
   * match a real user in the database, sign in to Activity Overlord.
   ***************************************************************************/
  login: function (req, res) {
    
    // callback function
    var callback = function(err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      // Store user id in the user session
      req.session.authenticated = true;
      req.session.me = user.id;

      // All done- let the client know that everything worked.
      return res.ok(user);

      // // Compare password attempt from the form params to the encrypted password
      // // from the database (`user.password`)
      // require('machinepack-passwords').checkPassword({
      //   passwordAttempt: req.param('password'),
      //   encryptedPassword: user.encryptedPassword
      // }).exec({

      //   error: function (err){
      //     return res.negotiate(err);
      //   },

      //   // If the password from the form params doesn't checkout w/ the encrypted
      //   // password from the database...
      //   incorrect: function (){
      //     return res.notFound();
      //   },

      //   success: function (){

      //     // Store user id in the user session
      //     req.session.authenticated = true;
      //     req.session.me = user.id;

      //     // All done- let the client know that everything worked.
      //     return res.ok(user);
      //   }
      // });
    };
    
    // Try to look up user using the provided username, password and role
    User.findOne({
      username: req.param('username'),
      encryptedPassword: req.param('password')
    }, callback);
  },

  /***************************************************************************
   * Sign up for a user account.
   ***************************************************************************/
  signup: function(req, res) {

    var Passwords = require('machinepack-passwords');

    // Encrypt a string using the BCrypt algorithm.
    Passwords.encryptPassword({
      password: req.param('password'),
      difficulty: 10,
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return res.negotiate(err);
      },
      // OK.
      success: function(encryptedPassword) {
        require('machinepack-gravatar').getImageUrl({
          emailAddress: req.param('email')
        }).exec({
          error: function(err) {
            return res.negotiate(err);
          },
          success: function(gravatarUrl) {
          // Create a User with the params sent from
          // the sign-up form --> signup.ejs
            User.create({
              name: req.param('name'),
              title: req.param('title'),
              email: req.param('email'),
              encryptedPassword: encryptedPassword,
              lastLoggedIn: new Date(),
              gravatarUrl: gravatarUrl
            }, function userCreated(err, newUser) {
              if (err) {

                console.log("err: ", err);
                console.log("err.invalidAttributes: ", err.invalidAttributes)

                // If this is a uniqueness error about the email attribute,
                // send back an easily parseable status code.
                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
                  && err.invalidAttributes.email[0].rule === 'unique') {
                  return res.emailAddressInUse();
                }

                // Otherwise, send back something reasonable as our error response.
                return res.negotiate(err);
              }

              // Log user in
              req.session.me = newUser.id;

              // Send back the id of the new user
              return res.json({
                id: newUser.id
              });
            });
          }
        });
      }
    });
  },

  /***************************************************************************
   * Log out of Activity Overlord.
   * (wipes `me` from the sesion)
   ***************************************************************************/
  logout: function (req, res) {

    // Look up the user record from the database which is
    // referenced by the id in the user session (req.session.me)
    User.findOne(req.session.me, function foundUser(err, user) {
      if (err) return res.negotiate(err);

      // If session refers to a user who no longer exists, still allow logout.
      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists.');
        return res.backToHomePage();
      }

      // Wipe out the session (log out)
      req.session.me = null;

      // Either send a 200 OK or redirect to the home page
      return res.backToHomePage();

    });
  },

  /***************************************************************************
   * get all teachers
   ***************************************************************************/
  getTeachers: function (req, res) {
    User.find({
      role: 'Teacher'
    }, function (error, teachers){
      if (error) return res.negotiate(error);
      if (!teachers) return res.notFound();
      return res.ok(teachers);
    });
  },

  /***************************************************************************
   * get users given section id
   ***************************************************************************/
  getUsersBySection: function (req, res) {
    sails.log.info('getUsersBySection: ');
    UserSection.find({
      role: 'Student',
      sectionId: req.param('sectionId')
    }, function foundUserSections(error, studentSections){
      if (error) return res.negotiate(error);
      if (!studentSections) return res.notFound();

      var ids = [];
      for (var i = 0; i < studentSections.length; i++) {
        ids.push(studentSections[i].userId);
      };

      User
      .find({
        id : ids,
        role: 'Student'
      },function foundUsers(err, users){
        if (err) return res.negotiate(error);
        if (!users) return res.notFound();

        return res.ok(users);
      });
    });
  },

  searchUsers: function(req, res) {
    sails.log.info('searchUsers: ');
    sails.log.info(req.params.all());
    var query;
    for (var key in req.params.all()) {
      if (key != 'qry') {
        sails.log.info(key);
        query = key;
      }
    }

    User
    .find()
    .where({
      or:[
        {
          fName: {
            'contains': query
          }
        },
        {
          lName: {
            'contains': query
          }
        }
      ]
    })
    .exec(function findUsers(err, foundUsers){
      if (err) return res.negotiate(error);
      return res.ok(foundUsers);
    });

  },


  // Create a new user and tell the world about them.
  // This will be called every time a socket connects, so that each socket
  // represents one user--this is so that it's easy to demonstrate inter-user
  // communication by opening a bunch of tabs or windows.  In the real world,
  // you'd want multiple tabs to represent the same logged-in user.
  announce: function(req, res) {

    // Get the socket ID from the reauest
    var socketId = sails.sockets.getId(req);

    // Get the session from the request
    var session = req.session;

    User
    .findOne({
      id: req.param('id')
    })
    .exec(function(err, user) {
      if (err) {
        return res.serverError(err);
      }

      // Save this user in the session, indexed by their socket ID.
      // This way we can look the user up by socket ID later.
      session.users[socketId] = user;

      sails.log.debug('session.users: ');
      sails.log.debug(session.users);

      // Subscribe the connected socket to custom messages regarding the user.
      // While any socket subscribed to the user will receive messages about the
      // user changing their name or being destroyed, ONLY this particular socket
      // will receive "message" events.  This allows us to send private messages
      // between users.
      User.subscribe(req, user, 'message');

      // Get updates about users being created
      User.watch(req);

      // Get updates about rooms being created
      // Room.watch(req);

      // Publish this user creation event to every socket watching the User model via User.watch()
      User.publishCreate(user, req);

      res.json(user);

    });

  }
};
