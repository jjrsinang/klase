/**
 * AssignmentController
 *
 * @description :: Server-side logic for managing assignments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    /**********************************************************/
    getPendingAssignmentsForUser: function (req, res) {
        UserSection
        .find()
        .where({
            userId: req.param('userId')
        })
        .exec(function foundSections(err, usersections) {
            if (err) return res.negotiate(err);
            if (!usersections) return res.notFound();
            //sails.log.debug(usersections);
            
            var sectionIds = new Array();
            for (i = 0; i < usersections.length; i++) {
                sectionIds.push(usersections[i].sectionId);
            }
            //sails.log.debug(sectionIds);
            
            Assignment
            .find()
            .where({
                sectionId: sectionIds
            })
            .exec(function foundAssignments(err2, assignments) {
                if (err2) return res.negotiate(err2);
                if (!assignments) return res.ok();
                
                var assignmentIds = new Array();
                for (i = 0; i < assignments.length; i++) {
                    assignmentIds.push(assignments[i].id);
                }

                AssignmentSubmission
                .find()
                .where({
                    assignmentId: assignmentIds,
                    studentId: req.param('userId')
                })
                .exec(function foundSubmissions(err3, submissions){

                    var pending = [];
                    for (var j = 0; j < assignments.length; j++) {
                        var hasSubmission = false;
                        for (var i = 0; i < submissions.length; i++) {
                            if (submissions[i].assignmentId == assignments[j].id) {
                                hasSubmission = true;
                            }
                        };
                        if (!hasSubmission) pending.push(assignments[j]);
                    };

                    return res.ok(pending);
                });
            }); 
        });
    },

    /**********************************************************/
    getAssignmentsForSection: function (req, res) {
        Assignment
        .find()
        .where({
            sectionId: req.param('sectionId')
        })
        .populateAll()
        .exec(function foundSections(err, assignments) {
            if (err) return res.negotiate(err);
            if (!assignments) return res.notFound();
            
            sails.log.info('getAssignmentsForSection: ');
            
            if (req.param('userId')) {
                var iteratee = function(assignment, mapCb) {
                    assignment.submissions = [];
                    AssignmentSubmission
                    .find({
                        assignmentId: assignment.id,
                        studentId: req.param('userId')
                    })
                    .exec(function(error, found) {
                        if (error) return mapCb(error);
                        assignment.submissions = found;
                        return mapCb(null, assignment);
                    });
                };

                var addFoundSubmissions = function(error, newAssignments) {
                    if (error) sails.log.error('ERROR');
                    return res.ok(newAssignments);
                };

                async.map(assignments, iteratee, addFoundSubmissions);
            } else {
                return res.ok(assignments);
            }
        });
    },

    /**********************************************************/
    postAssignmentWithUpload: function (req, res) {
        sails.log.info('postAssignmentWithUpload: ');
        
        // stop if kulang ng data
        if (!req.param('message') ||
            !req.param('title') ||
            !req.param('mark') ||
            !req.param('dueDate') ||
            !req.param('sectionId') ||
            !req.param('posterId')) {
            sails.log.error('postAssignment: insufficient params');
            return res.notFound();
        }
        
        var uploadFile = req.file('file');
        var now = new Date();
        var originalName = '';
        sails.log.info(uploadFile);
         
        uploadFile.upload({
            dirname: '../public/images',//  Files will be uploaded to ./assets/images
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
            // create assignment if upload is successful
            Assignment.create({
               title: req.body.title,
               message: req.body.message,
               mark: req.body.mark,
               dueDate: req.body.dueDate,
               file: originalName,
               filename: files[0].filename,
               postDate: now,
               sectionId: req.body.sectionId,
               posterId: req.body.posterId,
               poster: req.body.posterId,
            }, function postCreated(error, newAssignment) {
                if (error) {
                    return res.negotiate(err);
                }
                return res.ok(newAssignment);
            });
        });
    },

    /**********************************************************/
    postAssignment: function (req, res) {
        if (!req.param('message') ||
            !req.param('title') ||
            !req.param('mark') ||
            !req.param('dueDate') ||
            !req.param('sectionId') ||
            !req.param('posterId')) {
            sails.log.error('postAssignment: insufficient params');
            return res.notFound();
        }

        Assignment.create({
            title: req.param('title'),
            message: req.param('message'),
            mark: req.param('mark'),
            dueDate: req.param('dueDate'),
            postDate: new Date(),
            sectionId: req.param('sectionId'),
            posterId: req.param('posterId'),
            poster: req.param('posterId')
         }, function postCreated(err, newAssignment) {
             if (err) {
                return res.negotiate(err);
             }
             return res.ok(newAssignment);
         });
    },

    /**********************************************************/
    deleteAssignment: function (req, res) {
        sails.log.info('deleteAssignment: ' +req.param('id'));
        Assignment.destroy({
            id: req.param('id')
        }, function postDeleted(err, deleted) {
             if (err) {
                 return res.negotiate(err);
             }
             if (!deleted) es.notFound();
             return res.ok(deleted);
        });
    },

    /* **************************************************************
     * submissions
     * **************************************************************/
     postAssignmentSubmission: function (req, res) {
        if (!req.param('message') ||
            !req.param('title') ||
            !req.param('assignmentId') ||
            !req.param('studentId')) {
            sails.log.error('postAssignmentSubmission: insufficient params');
            return res.notFound();
        }

        AssignmentSubmission
        .create({
            title: req.param('title'),
            message: req.param('message'),
            score: 0,
            postDate: new Date(),
            assignmentId: req.param('assignmentId'),
            studentId: req.param('studentId'),
            student: req.param('studentId')
         }, function postCreated(err, newSubmission) {
             if (err) {
                return res.negotiate(err);
             }
             return res.ok(newSubmission);
         });
     },

    /**********************************************************/
     postAssignmentSubmissionWithUpload: function (req, res) {
        sails.log.info('postAssignmentSubmissionWithUpload: ');
        
        // stop if kulang ng data
        if (!req.param('message') ||
            !req.param('title') ||
            !req.param('assignmentId') ||
            !req.param('studentId')) {
            sails.log.error('postAssignmentSubmissionWithUpload: insufficient params');
            return res.notFound();
        }
        
        var uploadFile = req.file('file');
        var now = new Date();
        var originalName = '';
        sails.log.info(uploadFile);
         
        uploadFile.upload({
            dirname: '../public/images',//  Files will be uploaded to ./assets/images
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
            // create assignment if upload is successful
            AssignmentSubmission.create({
               title: req.body.title,
               message: req.body.message,
               score: 0,
               file: originalName,
               filename: files[0].filename,
               postDate: now,
               assignmentId: req.body.assignmentId,
               studentId: req.body.studentId,
               student: req.body.studentId
            }, function postCreated(error, newAssignment) {
                if (error) {
                    return res.negotiate(err);
                }
                return res.ok(newAssignment);
            });
        });
     },

     /**********************************************************/
     getSubmission: function (req, res) {
        AssignmentSubmission
        .findOne({
            studentId: req.param('studentId'),
            assignmentId: req.param('assignmentId')
        })
        .exec(function foundPost(err, submission) {
            if (err) return res.negotiate(err);
            if (!submission) return res.notFound();
            
            sails.log.info('getSubmission: ');
            //sails.log.debug(posts);
            
            return res.ok(submission);
        });
    },

    /**********************************************************/
     getSubmissions: function (req, res) {
        var criteria = {};
        if (req.param('assignmentIds')) {
            criteria.assignmentId = req.param('assignmentIds');
        }
        if (req.param('studentId')) {
            criteria.studentId = req.param('studentId');
        }

        AssignmentSubmission
        .find(criteria)
        .populateAll()
        .exec(function foundPost(err, submissions) {
            if (err) return res.negotiate(err);
            if (!submissions) return res.notFound();
            
            sails.log.info('getSubmissions: ');
            //sails.log.debug(posts);
            
            return res.ok(submissions);
        });
    },

    /**********************************************************/
    deleteSubmission: function (req, res) {
        sails.log.info('deleteSubmission: ' +req.param('id'));
        AssignmentSubmission.destroy({
            id: req.param('id')
        }, function postDeleted(err, deleted) {
             if (err) {
                 return res.negotiate(err);
             }
             if (!deleted) es.notFound();
             return res.ok(deleted);
        });
    },

    /**********************************************************/
    gradeSubmission: function (req, res) {
        sails.log.info('gradeSubmission: ' +req.param('id'));
        AssignmentSubmission
        .update({
            id: req.param('id')
        }, {
            score: req.param('score')
        })
        .exec(function postDeleted(err, deleted) {
             if (err) {
                 return res.negotiate(err);
             }
             if (!deleted) es.notFound();
             return res.ok(deleted);
        });
    }
};
