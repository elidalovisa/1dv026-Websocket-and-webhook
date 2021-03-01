/**
 * Issues routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import { IssueController } from '../controllers/issues-controller.js'
const controller = new IssueController()
export const router = express.Router()
// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index) // Display list of snippets.
router.get('/new', controller.new) // Return HTML form to create a new snippet.
router.post('/create', controller.create) // Create a new snippet.
router.get('/login', controller.login) // Return HTML form to login.
router.post('/loginpost', controller.loginUser) // Login user.
router.get('/logout', controller.authurize, controller.logout) // Logout user
router.get('/register', controller.register) // Return HTML form to register new user.
router.post('/registeruser', controller.registerUser) // Register user.
router.get('/:id/edit', controller.edit) // Return a HTML form for editing a snippet.
router.post('/:id/update', controller.update) // Update a specific snippet.
router.get('/:id/remove', controller.remove) // Return a HTML form for removing a snippet.
router.post('/:id/delete', controller.delete) // Delete a specifik snippet.
