/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  ////////////////////////////////////////////////////////////
  // Server-rendered HTML webpages
  ////////////////////////////////////////////////////////////

  'GET /signup': {view: 'signup'},
  'GET /auth': 'PageController.auth',
  'GET /': 'PageController.showHomePage',

  ////////////////////////////////////////////////////////////
  // JSON API
  ////////////////////////////////////////////////////////////

  // User enrollment + authentication
  'POST /signup': 'UserController.signup',
  //'GET /loginpage': {view: 'loginpage'},
  'PUT /login': 'UserController.login',
  'GET /logout': 'UserController.logout',
  'PUT /membersbysection': 'UserController.getUsersBySection',
  'GET /user/search?:qry': 'UserController.searchUsers',
  
  // Section
  'PUT /section': 'SectionController.getSectionsByUser',
  'GET /allsections': 'SectionController.getAllSections',
  
  // event
  'PUT /event': 'EventController.getEventsByUser',
  'POST /createevent': 'EventController.createEvent',
  
  // activities/assignment
  'PUT /sectionassignments': 'AssignmentController.getAssignmentsForSection',
  'POST /file/uploadassignment': 'AssignmentController.postAssignmentWithUpload',
  'POST /postassignment': 'AssignmentController.postAssignment',
  'PUT /deleteassignment': 'AssignmentController.deleteAssignment',
  'POST /postassignmentsubmission': 'AssignmentController.postAssignmentSubmission',
  'POST /file/uploadassignmentsubmission': 'AssignmentController.postAssignmentSubmissionWithUpload',
  'PUT /submission': 'AssignmentController.getSubmission',
  'PUT /deletesubmission': 'AssignmentController.deleteSubmission',
  'PUT /submissions': 'AssignmentController.getSubmissions',
  'PUT /submitgrade': 'AssignmentController.gradeSubmission',
  
  // posts
  'PUT /posts': 'PostController.getPostsForUser',
  'PUT /sectionposts': 'PostController.getPostsForSection',
  'POST /file/upload': 'PostController.postWithUpload',
  'POST /post': 'PostController.post',
  'PUT /deletepost': 'PostController.deletePost',
  'POST /postcomment': 'PostController.createComment',
  'GET /post/:id': 'PostController.getPost',
  
  // chat
  'PUT /chat/getconv': 'ChatController.getConvForUsers',
  'PUT /chat/getthread': 'ChatController.getThreadsForUser',

  // classmaster
  'GET /teachers': 'UserController.getTeachers',
  'PUT /addstudent': 'SectionController.addStudentToSection',
  'PUT /removestudent': 'SectionController.removeStudentFromSection',
  'PUT /changeteacher': 'SectionController.changeSectionTeacher',
  'PUT /addsection': 'SectionController.addSection',
  

  // '/': {
  //   view: 'homepage'
  // }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
