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
            // sails.log.debug(messages);
            
            return res.ok(messages);
        });
		
	},
	
	getThreadsForUser:function(req, res) {
		MessageThread
		.find()
		.where({
			or:[
				{
					participant1: req.param('id')
				},
				{
					participant2: req.param('id')
				}
			]
		})
		.populateAll()
		.exec(function foundConv(err, threads) {
            if (err) return res.negotiate(err);
            if (!threads) return res.notFound();
            
            sails.log.info('getThreadsForUser: ');
            // sails.log.debug(threads);
            
            return res.ok(threads);
        });
	},

	addConv:function (req,res) {
		sails.log.info('addConv: ');
        var data_from_client = req.params.all();
		sails.log.debug(data_from_client);
		var now = new Date();


		var createMessage = function (threadId) {
			// This is the message from connected client
			// So add new conversation
			// Chat
			// .create({
			// 	user: data_from_client.user,
			// 	message: data_from_client.message
			// })
			// .exec(function(error,newChat){
			// 	if (error) sails.log.error(error);
			// 	sails.log.debug(data_from_client);
				
			// 	Chat.publishCreate({
			// 		id: newChat.id,
			// 		message : newChat.message,
			// 		user : newChat.user
			// 	});
			// });
			sails.log.info('threadId');
			sails.log.debug(threadId);
			Message
			.create({
				message: data_from_client.message,
				sender: data_from_client.senderId,
				senderId: data_from_client.senderId,
				receiver: data_from_client.receiverId,
				receiverId: data_from_client.receiverId,
				threadId: threadId,
				postDate: now
			})
			.exec(function createFn(error, newMessage){
				if (error) return res.negotiate(error);
				User
				.findOne({
					id: newMessage.senderId
				})
				.exec(function foundUser(userFindError, user){
					if (userFindError) return res.negotiate(userFindError);
					Message.publishCreate({
						id: 0,
						message: newMessage.message,
						sender: user,
						senderId: newMessage.senderId,
						receiver: newMessage.receiverId,
						receiverId: newMessage.receiverId,
						threadId: threadId,
						postDate: now
					});
				});

			});
		};

		if(req.isSocket && req.method === 'POST'){

			// search if thread exists
			MessageThread
			.findOne()
			.where({
				or:[
					{
						participant1: req.param('senderId'),
						participant2: req.param('receiverId')
					},
					{
						participant2: req.param('senderId'),
						participant1: req.param('receiverId')
					}
				]
			})
			.populateAll()
			.exec(function foundConv(err, thread) {
	            if (err) return res.negotiate(err);
	            // sails.log.info('thread');
	            // sails.log.error(thread);
	            if (thread) {
	            	// update thread and add message
	            	MessageThread
	            	.update({
						or:[
							{
								participant1: req.param('senderId'),
								participant2: req.param('receiverId')
							},
							{
								participant2: req.param('senderId'),
								participant1: req.param('receiverId')
							}
						]
					},{
						lastActivity: now
					}).exec(function updatedFn(updateError, updated){
						if (updateError) return res.negotiate(updateError);
						// sails.log.info('updated');
						// sails.log.error(updated[0]);
						createMessage(updated[0].id);
					});

	            } else {
	            	// create thread and add message
	            	MessageThread
	            	.create({
	            		participant1: req.param('senderId'),
	            		participant1Id: req.param('senderId'),
						participant2: req.param('receiverId'),
						participant2Id: req.param('receiverId'),
						lastActivity: now
	            	}).exec(function createdFn(createError, created){
						if (createError) return res.negotiate(createError);
						MessageThread
						.findOne(created)
						.exec(function findnewThread(findnewThreadError, foundNew){
							sails.log.info('foundNew');
							sails.log.debug(foundNew);
							createMessage(foundNew.id);
						});
					});
	            }
	        });

		}
		else if(req.isSocket){
			// subscribe client to model changes '
			// Chat.watch(req.socket);
			Message.watch(req.socket);
			console.log( 'User subscribed to ' + req.socket.id );
		}
	},


	// Send a private message from one user to another
	private: function(req, res) {
		// Get the ID of the currently connected socket
		var socketId = sails.sockets.getId(req.socket);
		// Use that ID to look up the user in the session
		// We need to do this because we can have more than one user
		// per session, since we're creating one user per socket
		User.findOne(req.session.users[socketId].id).exec(function(err, sender) {
			// Publish a message to that user's "room".  In our app, the only subscriber to that
			// room will be the socket that the user is on (subscription occurs in the onConnect
			// method of config/sockets.js), so only they will get this message.
			User.message(req.param('to'), {
				from: sender,
				msg: req.param('msg')
			});
		});
	}
};