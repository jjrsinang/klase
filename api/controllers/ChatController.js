/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	getConvForUsers:function(req, res) {
		Message
		.find()
		.where({
			//senderId: req.param('user1'),
			//receiverId: req.param('user2')
			or:[
				{
					senderId: req.param('user1'),
					receiverId: req.param('user2')
				},
				{
					senderId: req.param('user2'),
					receiverId: req.param('user1')
				}
			]
		})
		.populateAll()
		.exec(function foundConv(err, messages) {
            if (err) return res.negotiate(err);
            if (!messages) return res.notFound();
            
            sails.log.info('getConvForUsers: ');
            sails.log.debug(messages);
            
            return res.ok(messages);
        });
		
	},
	
	getThreadsForUser:function(req, res) {
		
	},

	addConv:function (req,res) {
		sails.log.info('addConv: ');
        var data_from_client = req.params.all();
		sails.log.debug(data_from_client);
		if(req.isSocket && req.method === 'POST'){

			// This is the message from connected client
			// So add new conversation
			Chat
			.create({
				user: data_from_client.user,
				message: data_from_client.message
			})
			.exec(function(error,data_from_client){
				if (error) sails.log.error(error);
				sails.log.debug(data_from_client);
				
				//Chat.publishCreate({
				//	id: 21,
				//	message : data_from_client.message ,
				//	user : data_from_client.user
				//});
			});
			
			Message
			.create({
				message: data_from_client.message,
				sender: data_from_client.senderId,
				senderId: data_from_client.senderId,
				receiver: data_from_client.receiverId,
				receiverId: data_from_client.receiverId,
				postDate: new Date()
			})
			.exec(function(error, data_from_client){
				Message.publishCreate({
					id: 21,
					message: data_from_client.message,
					sender: data_from_client.senderId,
					senderId: data_from_client.senderId,
					receiver: data_from_client.receiverId,
					receiverId: data_from_client.receiverId,
					postDate: new Date()
				});
			});
		}
		else if(req.isSocket){
			// subscribe client to model changes '
			//Chat.watch(req.socket);
			Message.watch(req.socket);
			console.log( 'User subscribed to ' + req.socket.id );
		}
	}	
};