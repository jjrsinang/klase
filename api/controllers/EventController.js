/**
 * EventController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    /**********************************************************/
    getEventsByUser: function (req, res) {
        Event
        .find()
        .where({
            sectionId: req.param('sectionId')
        })
        .populateAll()
        .exec(function foundSections(err, events) {
            if (err) return res.negotiate(err);
            if (!events) return res.notFound();
            
            sails.log.info('getEventsByUser: ');
            sails.log.debug(events);
            
            return res.ok(events);
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
