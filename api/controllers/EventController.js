/**
 * EventController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    /**********************************************************/
    getEventsByUser: function (req, res) {

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
            
            Event
            .find()
            .where({
                sectionId: sectionIds
            })
            .populateAll()
            .exec(function foundEvents(err, events) {
                if (err) return res.negotiate(err);
                if (!events) return res.notFound();
                
                sails.log.info('getEventsByUser: ');
                //sails.log.debug(events);
                
                return res.ok(events);
            });
            
            //return res.ok();
        });
    },

    /**********************************************************/
    createEvent: function (req, res) {
        Event
        .create({
            title: req.param('title'),
            message: req.param('message'),
            schedule: req.param('schedule'),
            deadline: req.param('deadline'),
            sectionId: req.param('sectionId'),
            section: req.param('sectionId')
        })
        .exec(function foundSections(err, events) {
            if (err) return res.negotiate(err);
            if (!events) return res.notFound();
            
            sails.log.info('addEvent: ');
            sails.log.debug(events);
            
            return res.ok(events);
        });
    }
};
