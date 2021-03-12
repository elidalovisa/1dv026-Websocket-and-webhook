/**
 * Module for the IssueController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import { Issue } from '../models/issue.js'
import fetch from 'node-fetch'
import pkg from '@gitbeaker/node'
const { Projects } = pkg

/**
 * Encapsulates a controller.
 */
export class IssueController {
  /**
   * Displays a list of issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index(req, res, next) {
    const personaltoken = 'geAodCyrTZKfnKHTpfvZ'
    try {
      const projectIssues = await fetch('https://gitlab.lnu.se/api/v4/projects/13268/issues',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + personaltoken,
            'Content-Type': 'application/json'

          }
        })
      const text = await projectIssues.json()
      const viewData = {
        issues: text// Get all objects and filter.
          .map(issue => ({
            id: issue.iid,
            state: issue.state,
            closed_at: issue.closed_at,
            done: false,
            title: issue.title,
            description: issue.description,
            project_id: issue.project_id
          }))
      }
      for (let i = 0; i < viewData.issues.length; i++) {
        if (viewData.issues[i].state === 'closed') {
          viewData.issues[i].done = true
        }
      }
      res.render('issues/index', { viewData }) // Present the data in HTML.
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      const issue = new Issue({
        description: req.body.description,
        title: req.body.title,
        id: req.body.iid,
        state: req.body.state,
        closed_at: req.body.closed_at,
        done: false,
        project_id: req.body.project_id
      })

      // Socket.io: Send the created task to all subscribers.
      res.io.emit('issue', {
        title: issue.title,
        description: issue.description,
        id: issue._id
      })

      // Webhook: Call is from hook. Skip redirect and flash.
      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
        return
      }

      req.session.flash = {
        type: 'success', text: 'The issue was created successfully.'
      }
      res.redirect('./')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/new')
    }
  }

  /**
   * Open the specified issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async open (req, res) {
    const personaltoken = 'geAodCyrTZKfnKHTpfvZ'
    const id = req.params.id
    console.log(id)
    try {
      const projectIssues = await fetch('https://gitlab.lnu.se/api/v4/projects/13268/issues/' + id + '?state_event=reopen',
        {
          method: 'put',
          headers: {
            'PRIVATE-TOKEN': personaltoken,
            'Content-Type': 'application/json'
          }
        })

      // Socket.io: Send the reopened issue to all subscribers.
      const issue = req.params.id
      res.io.emit('issue', {
        title: issue.title,
        description: issue.description,
        id: issue._id,
        state: issue.state
      })

      // Webhook: Call is from hook. Skip redirect and flash.
      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
        return
      }

      req.session.flash = { type: 'success', text: 'The issue was closed successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./remove')
    }
  }

  /**
   * Close the specified issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async close(req, res) {
    const personaltoken = 'geAodCyrTZKfnKHTpfvZ'
    const id = req.params.id
    console.log(id)
    try {
      const projectIssues = await fetch('https://gitlab.lnu.se/api/v4/projects/13268/issues/' + id + '?state_event=close',
        {
          method: 'put',
          headers: {
            'PRIVATE-TOKEN': personaltoken,
            'Content-Type': 'application/json'
          }
        })

      // Socket.io: Send the closed issue to all subscribers.
      const issue = req.params.id
      res.io.emit('issue', {
        title: issue.title,
        description: issue.description,
        id: issue._id,
        state: issue.state
      })

      // Webhook: Call is from hook. Skip redirect and flash.
      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
        return
      }

      req.session.flash = { type: 'success', text: 'The issue was closed successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./remove')
    }
  }
}
