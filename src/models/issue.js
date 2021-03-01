/**
 * Mongoose model real-time issue from GitLab.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  value: {
    type: String,
    required: false,
    minlength: 1
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
export const Issue = mongoose.model('Issue', schema)
