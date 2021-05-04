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
router.get('/', controller.index) // Display list of all issues from project.
router.get('/:id/open', controller.open) // Open a specific issue.
router.get('/:id/close', controller.close) // Close a specifik issue.
