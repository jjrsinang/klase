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
    postToSection: function(req, res) { // THIS IS THE WORKING ONE
        sails.log.info('postToSection: ');
        //sails.log.debug(req.body);
        //sails.log.debug(req.body.message);
        //sails.log.debug(req.body.sectionId );
        //sails.log.debug(req.body.posterId);
        //sails.log.debug(req.query);
        //sails.log.debug(req.params);
        
        // stop if kulang ng data
        if (!req.body.message ||
            !req.body.sectionId ||
            !req.body.posterId ) {
            sails.log.error('kulang ng data!');
            return res.badRequest();
        }
        
		var uploadFile = req.file('file');
		//sails.log.info(uploadFile);
         
        uploadFile.upload({
            dirname: '../public/images',//	Files will be uploaded to ./assets/images
            saveAs: function (__newFileStream, cb) {
                cb(null, __newFileStream.filename);
            }
        },function onUploadComplete (err, files) {
	    	if (err) return res.serverError(err);
            
            sails.log.debug(files);
            // copy file for permanent storage
            var fs = require('fs');
            fs.createReadStream(files[0].fd).pipe(fs.createWriteStream('/Users/MacBook/Documents/Projects/test/testProject/assets/images/' + files[0].filename));
			
	    	sails.log.info(files);
            // create post if upload is successful
            Post.create({
               message: req.body.message,
               file: files[0].filename,
               filename: files[0].filename,
               sectionId: req.body.sectionId,
               posterId: req.body.posterId,
               section: req.body.sectionId,
               poster: req.body.posterId,
               postDate: new Date()
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
    }
};
