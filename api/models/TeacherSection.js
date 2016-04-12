/**
* TeacherSection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_teacher_section',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    teacherId: {
      type: 'integer',
      columnName: 'teacher_id'
    },
    
    sectionId: {
      type: 'integer',
      columnName: 'section_id'
    }
  }
};
