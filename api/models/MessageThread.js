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
    }
  }
};
