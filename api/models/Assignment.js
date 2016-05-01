/**
* Assignment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_assignment',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },

    title: {
      type: 'string'
    },
    
    message : {
      type: 'string'
    },
    
    mark : {
      type: 'integer'
    },

    file: {
      type: 'string'
    },

    filename: {
      type: 'string'
    },
    
    postDate : {
      type: 'datetime',
      columnName: 'post_date'
    },

    dueDate : {
      type: 'datetime',
      columnName: 'due_date'
    },
    
    sectionId: {
      type: 'integer',
      columnName: 'section_id'
    },
    
    posterId: {
      type: 'integer',
      columnName: 'poster_id'
    },

    poster: {
      model: 'User'
    }
  }
};
