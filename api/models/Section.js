/**
* Section.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
  tableName: 't_section',
  
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true
    },
    
    courseNumber: {
      type: 'string',
      columnName: 'course_number'
    },
    
    courseTitle: {
      type: 'string',
      columnName: 'course_title'
    },
    
    units: {
      type: 'string'
    },
    
    sectionType: {
      type: 'string',
      columnName: 'section_type'
    },
    
    sectionName: {
      type: 'string',
      columnName: 'section_name'
    },
    
    sectionSchedule: {
      type: 'string',
      columnName: 'section_schedule'
    },
    
    semester: {
      type: 'string'
    },

    slotsLimit: {
      type: 'integer',
      columnName: 'slots_limit'
    },

    availableSlots: {
      type: 'integer',
      columnName: 'available_slots'
    },
    
    teacherId: {
      type: 'integer',
      columnName: 'teacher_id'
    },
    
    teacher: {
      model: 'User'
    }
  }
};
