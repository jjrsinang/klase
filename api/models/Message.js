/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_message',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    message : {
      type: 'string'
    },
    
    postDate : {
      type: 'datetime',
      columnName: 'post_date'
    },
    
    seen : {
      type: 'int'
    },
    
    sender : {
      model : 'User'
    },
    
    senderId: {
      type: 'integer',
      columnName: 'sender_id'
    },
    
    receiver : {
      model : 'User'
    },
    
    receiverId: {
      type: 'integer',
      columnName: 'receiver_id'
    }
  }
};
