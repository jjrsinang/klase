/**
* TeacherSection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_user_section',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    userId: {
      type: 'integer',
      columnName: 'user_id'
    },
    
    sectionId: {
      type: 'integer',
      columnName: 'section_id'
    }
  }
};
