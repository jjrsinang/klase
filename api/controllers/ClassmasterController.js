/**
 * ClassmasterController
 *
 * @description :: Server-side logic for managing class master
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
            //sails.log.debug(sections);
            
            return res.ok(sections);
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
                
                var string = 'getSectionsByUser: [';
                for (i = 0; i < sections.length; i++) {
                    string = string + sections[i].id + ', ';
                }string = string + ']';
                //sails.log.info(string);
                //sails.log.debug(sections);
                
                return res.ok(sections);
            });
        });
    }
};
