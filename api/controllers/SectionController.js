/**
 * SectionController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    /**********************************************************/
    getAllSections:  function (req, res) {
        Section
        .find()
        .populateAll()
        .exec(function foundSections(err, sections) {
            if (err) return res.negotiate(err);
            if (!sections) return res.notFound();
            
            sails.log.info('getAllSections: ');

            var iteratee = function(section, mapCb) {
                UserSection.count({
                    role: 'Student',
                    sectionId: section.id
                })
                .exec(function(error, found) {
                    if (error) return mapCb(error);
                    section.availableSlots = found;
                    return mapCb(null, section);
                });
            };

            var addAvailableSlots = function(error, newSections) {
                if (error) sails.log.error('ERROR');
                return res.ok(newSections);
            };

            async.map(sections, iteratee, addAvailableSlots);

        });
    },
    
    /**********************************************************/
    getSectionsByUser: function (req, res) {
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
            
            Section
            .find()
            .where({
                id: sectionIds
            })
            .populateAll()
            .exec(function foundSections(err, sections) {
                if (err) return res.negotiate(err);
                if (!sections) return res.notFound();

                sails.log.info('getSectionsByUser: ');
                
                return res.ok(sections);
            });
        });
    },

    /**********************************************************/
    addSection: function (req, res) {
        if (!req.param('courseNo') || 
            !req.param('courseTitle') || 
            !req.param('units') || 
            !req.param('sectionType') || 
            !req.param('sectionName') || 
            !req.param('schedule') || 
            !req.param('slotsLimit') ||
            !req.param('teacherId')) {
            sails.log.error('addSection: unsufficient params');
            return res.notFound();
        }

        Section
        .create({
            courseNumber: req.param('courseNo'),
            courseTitle: req.param('courseTitle'),
            units: req.param('units') + '.0',
            sectionType: req.param('sectionType'),
            sectionName: req.param('sectionName'),
            sectionSchedule: req.param('schedule'),
            slotsLimit: req.param('slotsLimit'),
            semester: '1st Sem 15-16',
            teacher: req.param('teacherId'),
            teacherId: req.param('teacherId')
        })
        .exec(function afterCreate(err, newSection){
            if (err) return res.negotiate(err);
            if (!newSection) {
                sails.log.error('addSection: !newSection');
                return res.notFound();
            }

            return res.ok(newSection);
        });
    },

    /**********************************************************/
    addStudentToSection: function (req, res) {
        if (!req.param('studentNo') || !req.param('sectionId')) {
            return res.notFound();
        }
        User
        .findOne({studentNo: req.param('studentNo')})
        .exec(function foundStudent(err, student){
            if (err) return res.negotiate(err);
            if (!student) return res.notFound();

            UserSection
            .create({
                userId: student.id,
                role: 'Student',
                sectionId: req.param('sectionId')
            })
            .exec(function created(error, newUserSection){
                if (err) return res.negotiate(error);
                if (!student) return res.notFound();

                sails.log.info('addStudentToSection: ');

                return res.ok(newUserSection);
            });
        });
    },

    /**********************************************************/
    removeStudentFromSection: function (req, res) {
        if (!req.param('studentNo') || !req.param('sectionId')) {
            return res.notFound();
        }
        User
        .findOne({studentNo: req.param('studentNo')})
        .exec(function foundStudent(err, student){
            if (err) return res.negotiate(err);
            if (!student) return res.notFound();

            UserSection
            .findOne({
                userId: student.id,
                role: 'Student',
                sectionId: req.param('sectionId')
            })
            .exec(function created(error, userSection){
                if (err) return res.negotiate(error);
                if (!userSection) return res.notFound();

                UserSection
                .destroy({
                    id: userSection.id
                })
                .exec(function successDelete(error2, deleted){
                    if (err) return res.negotiate(error2);
                    if (!deleted) return res.notFound();
                    sails.log.info('removeStudentFromSection: ');
                    return res.ok(deleted);
                });
            });
        });
        
    },

    /**********************************************************/
    changeSectionTeacher: function (req, res) {
        sails.log.info('changeSectionTeacher: ');
        if (!req.param('newTeacherId') || 
            !req.param('oldTeacherId') || 
            !req.param('sectionId')) {
            sails.log.error('insufficient params');
            return res.notFound();
        }

        var updateSection = function() {
            Section
            .update({
                id: req.param('sectionId')
            },{
                teacher: req.param('newTeacherId'),
                teacherId: req.param('newTeacherId')
            })
            .exec(function updatedSection(error, updatedSection){
                if (error) return res.negotiate(error);
                if (!updatedSection) {
                    sails.log.error('!updatedSection');
                    return res.notFound();
                }

                return res.ok();
            });
        };

        UserSection
        .findOne({
            userId: req.param('oldTeacherId'),
            role: 'Teacher',
            sectionId: req.param('sectionId')
        })
        .exec(function findUserSections(error, foundUserSection){
            if (error) return res.negotiate(error);
            sails.log.info(foundUserSection);
            if (foundUserSection) {
                UserSection
                .update({
                    userId: req.param('oldTeacherId'),
                    role: 'Teacher',
                    sectionId: req.param('sectionId')
                },{
                    userId: req.param('newTeacherId')
                })
                .exec(function foundUserSection(err, updatedUserSection){
                    if (err) return res.negotiate(err);
                    if (!updatedUserSection) {
                        sails.log.error('!updatedUserSection');
                        return res.notFound();
                    }
                });
            } else {
                UserSection
                .create({
                    userId: req.param('newTeacherId'),
                    role: 'Teacher',
                    sectionId: req.param('sectionId')
                })
                .exec(function foundUserSection(err, updatedUserSection){
                    if (err) return res.negotiate(err);
                    if (!updatedUserSection) {
                        sails.log.error('!updatedUserSection');
                        return res.notFound();
                    }
                });
            }

            updateSection();
        });

        
    }
};
