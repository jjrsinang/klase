/**
 * PostController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    /**********************************************************/
    getAllPosts:  function (req, res) {
        Post
        .find()
        .populateAll()
        .exec(function foundSections(err, posts) {
            if (err) return res.negotiate(err);
            if (!posts) return res.notFound();
            
            sails.log.info('getAllPosts: ');
            //sails.log.debug(posts);
            
            return res.ok(posts);
        });
    },

    /**********************************************************/
    getPost:  function (req, res) {
        Post
        .findOne({
            id: req.param('id')
        })
        .populateAll()
        .exec(function foundPost(err, post) {
            if (err) return res.negotiate(err);
            if (!post) return res.notFound();
            
            sails.log.info('getPost: ');
            //sails.log.debug(posts);
            
            return res.ok(post);
        });
    },
    
    /**********************************************************/
    getPostsForUser: function (req, res) {
        
        UserSection
        .find()
        .where({
            userId: req.param('userId')
        })
        .exec(function foundSections(err, sections) {
            if (err) return res.negotiate(err);
            if (!sections) return res.notFound();
            //sails.log.debug(sections);
            
            var sectionIds = new Array();
            for (i = 0; i < sections.length; i++) {
                sectionIds.push(sections[i].sectionId);
            }
            //sails.log.debug(sectionIds);
            
            Post
            .find()
            .where({
                sectionId: sectionIds
            })
            .populateAll()
            .exec(function foundSections(err, posts) {
                if (err) return res.negotiate(err);
                if (!posts) return res.notFound();
                
                var string = 'getPostsForUser: [';
                for (i = 0; i < sections.length; i++) {
                    string = string + sections[i].id + ', ';
                }string = string + ']';
                //sails.log.info(string);
                //sails.log.debug(posts);
                
                return res.ok(posts);
            });
            
            //return res.ok();
        });
    },
    
    /**********************************************************/
    getPostsForSection: function (req, res) {
        Post
        .find()
        .where({
            sectionId: req.param('sectionId')
        })
        .populateAll()
        .exec(function foundSections(err, posts) {
            if (err) return res.negotiate(err);
            if (!posts) return res.notFound();
            
            sails.log.info('getPostsForSection: ');
            //sails.log.debug(posts);
            
            return res.ok(posts);
        });
    },
    
    /**********************************************************/
    postWithUpload: function(req, res) { // THIS IS THE WORKING ONE
        sails.log.info('postWithUpload: ');
        
        // stop if kulang ng data
        if (!req.body.message ||
            !req.body.sectionId ||
            !req.body.posterId ) {
            sails.log.error('kulang ng data!');
            return res.badRequest();
        }
        
		var uploadFile = req.file('file');
        var now = new Date();
        var originalName = '';
		sails.log.info(uploadFile);
         
        uploadFile.upload({
            dirname: '../public/images',//	Files will be uploaded to ./assets/images
            saveAs: function (__newFileStream, cb) {
                originalName = __newFileStream.filename;
                __newFileStream.filename = now.toString() + ' - ' + __newFileStream.filename;
                cb(null, __newFileStream.filename);
            }
        },function onUploadComplete (err, files) {
	    	if (err) return res.serverError(err);
            
            sails.log.debug(files);
            // copy file for permanent storage
            var fs = require('fs');
            
            fs.createReadStream(files[0].fd).pipe(fs.createWriteStream('/Users/jjsinang/Documents/Projects/klaseApp/assets/images/' + files[0].filename));
			
	    	sails.log.info(files);
            // create post if upload is successful
            Post.create({
               message: req.body.message,
               file: originalName,
               filename: files[0].filename,
               sectionId: req.body.sectionId,
               posterId: req.body.posterId,
               section: req.body.sectionId,
               poster: req.body.posterId,
               postDate: now
            }, function postCreated(err, newPost) {
                if (err) {
                    return res.negotiate(err);
                }
                return res.ok(newPost);
            });
	    });
    },
    
    /**********************************************************/
    post: function (req, res) {
        if (!req.param('message') ||
            !req.param('sectionId') ||
            !req.param('posterId')) {
            sails.log.error('post: insufficient params');
            return res.notFound();
        }

        Post.create({
            message: req.param('message'),
            sectionId: req.param('sectionId'),
            posterId: req.param('posterId'),
            section: req.param('sectionId'),
            poster: req.param('posterId'),
            postDate: new Date()
         }, function postCreated(err, newPost) {
             if (err) {
                return res.negotiate(err);
             }
             return res.ok(newPost);
         });
    },
    
    /**********************************************************/
    deletePost: function (req, res) {
        sails.log.info('deletePost: ' +req.param('id'));
        Post.destroy({
            id: req.param('id')
         }, function postDeleted(err, deleted) {
             if (err) {
                 return res.negotiate(err);
             }
             return res.ok(deleted);
         });
    },

    createComment: function (req, res) {
        sails.log.info('createComment: ');

        User
        .findOne({
            id: req.param('commenterId')
        })
        .exec(function findUser(err, user){
            if (err) return res.negotiate(err);
            if (!user) return res.notFound();

            PostResponse
            .create({
                message: req.param('comment'),
                responseDate: new Date(),
                commenter: user.fName + ' ' + user.lName,
                commenterId: req.param('commenterId'),
                postId: req.param('postId'),
                post: req.param('postId')
            })
            .exec(function createPostResponse(error, newResponse){
                if (error) return res.negotiate(error);
                if (!newResponse) return res.notFound();

                return res.ok(newResponse);
            });
        });
    }
};
