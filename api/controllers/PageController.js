/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  
  /***************************************************************************
   * authentication
   ***************************************************************************/
  auth: function (req, res) {
	if (!req.session.me) {
	  sails.log.debug('Authentication failure: no one is logged in');
	  return res.ok(false);
	}
	sails.log.debug('Authentication success');
	return res.ok(true);
  },
  
  /***************************************************************************
   * redirect to homepage
   ***************************************************************************/
  showHomePage: function (req, res) {

    // If not logged in, show the login page
    if (!req.session.me) {
      return res.view('loginpage');
    }
	
	return res.view('homepage');
  
    // Otherwise, look up the logged-in user and show the logged-in view,
    // bootstrapping basic user data in the HTML sent from the server
    User.findOne(req.session.me, function (err, user){
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('loginpage');
      }

      return res.view('homepage', {
        me: {
          id: user.id,
          name: user.name,
          email: user.email,
		  username: user.username,
          title: user.title,
          isAdmin: !!user.admin,
          gravatarUrl: user.gravatarUrl
        }
      });

    });
  },

};
