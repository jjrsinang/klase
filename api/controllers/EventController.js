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
    }
};
