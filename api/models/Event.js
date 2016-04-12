/**
* Event.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_event',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    title : {
      type: 'string'
    },
    
    message : {
      type: 'string'
    },
    
    schedule : {
      type: 'datetime'
    },
    
    deadline : {
      type: 'datetime'
    },
    
    sectionId: {
      type: 'integer',
      columnName: 'section_id'
    }
  }
};
