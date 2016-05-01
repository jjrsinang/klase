/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_post',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    message : {
      type: 'string',
      maxLength: 600
    },
    
    file : {
      type: 'string'
    },
    
    filename : {
      type: 'string'
    },
    
    postDate : {
      type: 'datetime',
      columnName: 'post_date'
    },
    
    sectionId: {
      type: 'integer',
      columnName: 'section_id'
    },
    
    section: {
      model: 'Section'
    },
    
    posterId: {
      type: 'integer',
      columnName: 'poster_id'
    },
    
    poster: {
      model: 'User'
    },

    comments: {
      collection: 'postresponse',
      via: 'post'
    }
  }
};
