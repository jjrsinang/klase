/**
* PostResponse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_post_response',
  
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
    
    senderRole: {
      type: 'string',
      columnName: 'sender_role'
    },
    
    senderId: {
      type: 'integer',
      columnName: 'sender_id'
    }
  }
};
