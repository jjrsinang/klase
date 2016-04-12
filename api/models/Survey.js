/**
* Survey.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_survey',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    question : {
      type: 'string'
    },
    
    isSingleAnswer: {
      type: 'boolean',
      columnName: 'is_single_answer'
    },
    
    postDate: {
      type: 'datetime',
      columnName: 'post_date'
    },
    
    postId: {
      type: 'integer',
      columnName: 'poster_id'
    }
  }
};
