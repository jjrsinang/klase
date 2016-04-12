/**
* SurveyResponse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_survey_response',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    answer : {
      type: 'string'
    },
    
    answerId: {
      type: 'integer',
      columnName: 'answer_id'
    },
    
    studentId: {
      type: 'integer',
      columnName: 'student_id'
    }
  }
};
