const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },

  jobTitle: {
    type: String,
    default: ''
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },

  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },

  country: String,
  state: String,
  city: String

}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);