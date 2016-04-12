/**
* Answer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_survey_answer',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    answer : {
      type: 'string'
    },
    
    surveyId: {
      type: 'integer',
      columnName: 'survey_id'
    }
  }
};
