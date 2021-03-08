/**
 * Issues routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import { IssueController } from '../controllers/issues-controller.js'
import { HookController } from '../controllers/hook-controller.js'

const controller = new IssueController()
const hookController = new HookController()

export const router = express.Router()
// Map HTTP verbs and route paths to controller actions.
router.get('/',/* hookController.authorize, */ controller.index) // Display list of issues.
router.get('/new', controller.new) // Return HTML form to create a new issue.
router.post('/create', controller.create) // Create a new issue.
router.get('/:id/edit', controller.edit) // Return a HTML form for editing a issue.
//router.post('/:id/update', controller.update) // Update a specific issue.
router.get('/:id/remove', controller.remove) // Return a HTML form for removing a issue.
router.post('/:id/delete', controller.delete) // Delete a specifik issue.
