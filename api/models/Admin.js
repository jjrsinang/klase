/**
* Admin.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_admin',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
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
    
    sex : {
      type: 'string'
    },
    
    adminNo : {
      type: 'string',
      columnName: 'admin_no'
    },
    
    username: {
      type: 'string'
    },
    
    encryptedPassword: {
      type: 'string',
      columnName: 'encrypted_password'
    }
  }
};
