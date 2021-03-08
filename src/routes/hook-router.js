/**
 * Hookroutes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import { HookController } from '../controllers/hook-controller.js'
import { IssueController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new HookController()
const issuesController = new IssueController()

// Map HTTP verbs and route paths to controller actions.
router.post('/issue', controller.authorize, controller.index, issuesController.create) // Add new issue from gitlab.

//router.get('/issues', controller.authorize, controller.index, issuesController.create) // Controll and filter data.
router.delete('/issues/:issue_iid', controller.authorize, controller.index, issuesController.delete) // Delete a specifik issue.
router.put('/projects/:id/issues/:issue_iid', issuesController.edit)

//router.get('/:id/edit', issuesController.edit) // Return a HTML form for editing a snippet.
//router.post('/:id/update', controller.authorize, controller.index, issuesController.update) // Update a specific issue.
//router.get('/:id/remove', /*controller.authorize, controller.index,*/ issuesController.remove) // Return a HTML form for removing a issue.
