/**
* AssignmentSubmission.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_assignment_submission',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    title : {
      type: 'string'
    },
    
    score : {
      type: 'integer'
    },
    
    postDate : {
      type: 'datetime',
      columnName: 'post_date'
    },
    
    studentId: {
      type: 'integer',
      columnName: 'student_id'
    },
    
    assignmentId: {
      type: 'integer',
      columnName: 'assignment_id'
    }
  }
};
