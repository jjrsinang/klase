/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_message_thread',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    seen : {
      type: 'int'
    },

    participant1Id : {
      type: 'int',
      columnName: 'participant1_id'
    },

    participant1 : {
      model: 'User'
    },

    participant2Id : {
      type: 'int',
      columnName: 'participant2_id'
    },

    participant2 : {
      model: 'User'
    },

    lastActivity : {
      type: 'datetime',
      columnName: 'last_activity'
    }
  }
};
