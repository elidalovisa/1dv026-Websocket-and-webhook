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
