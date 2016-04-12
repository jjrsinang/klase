/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName: 't_user',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    sex : {
      type: 'string'
    },
    
    username: {
      type: 'string'
    },
    
    fName : {
      type: 'string',
      columnName: 'f_name'
    },
    
    mName : {
      type: 'string',
      columnName: 'm_name'
    },
    
    lName : {
      type: 'string',
      columnName: 'l_name'
    },
    
    fullName: function() {
      return this.fName + ' ' + this.mName + ' ' + this.lName;
    },
    
    birthday : {
      type: 'date'
    },
    
    encryptedPassword: {
      type: 'string',
      columnName: 'encrypted_password'
    },
    
    role : {
      type: 'string'
    },
    
    classification : {
      type: 'string'
    },
    
    course : {
      type: 'string'
    },
    
    college : {
      type: 'string'
    },
    
    studentNo : {
      type: 'string',
      columnName: 'student_no'
    },
    
    rank : {
      type: 'string'
    },
    
    employeeNo : {
      type: 'string',
      columnName: 'employee_no'
    }
  }
};
