/**
 * Mongoose model user.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Create a schema for login.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be of minimum length 10 characters']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Salts and hashes password before saving it to database.
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

/**
 * Authenticate user.
 *
 * @param {string} username - Username string.
 * @param {string} password - Password string.
 * @returns {object} - User object.
 */
userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username }) // Get username from database.

  // If no user found or password is wrong, throw error.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }
  // User found and password correct, return user.
  return user
}
// Create a model using the schema.
export const User = mongoose.model('User', userSchema)
