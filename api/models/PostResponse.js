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
    
    responseDate : {
      type: 'datetime',
      columnName: 'post_date'
    },

    commenter: {
      type: 'string'
    },
    
    commenterId: {
      type: 'integer',
      columnName: 'commenter_id'
    },

    postId: {
      type: 'integer',
      columnName: 'post_id',
      model: 'Post'
    },

    post: {
      model: 'Post'
    }
  }
};
