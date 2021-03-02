/**
 * The routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import { router as issuesRouter } from './issues-router.js'
import { router as hookRouter } from './hook-router.js'

export const router = express.Router()

router.use('/', issuesRouter)
// Webhook: Create a route for the hook
router.use('/webhook', hookRouter)

router.use('*', (req, res, next) => {
  const error = new Error()
  error.status = 404
  error.message = 'Not Found'
  next(error)
})
