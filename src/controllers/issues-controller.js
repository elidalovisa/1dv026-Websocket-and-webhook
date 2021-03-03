/**
 * Module for the IssueController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import { Issue } from '../models/issue.js'

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
  async index (req, res, next) {
    try {
      const viewData = {
        issues: (await Issue.find({})) // Get all objects and filter out id and value.
          .map(issue => ({
            id: issue._id,
            title: issue.title,
            description: issue.description
          }))
      }
      res.render('issues/index', { viewData }) // Present the data in HTML.
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */

  /**
   * Returns a HTML form for creating a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async new (req, res) {
    const viewData = {
      description: ''
    }
    res.render('issues/new', { viewData })
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
        title: req.body.title
      })

      await issue.save()

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
   * Returns a HTML form for editing a issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async edit (req, res) {
    res.locals.session = req.session
    try {
      const issue = await Issue.findOne({ _id: req.params.id })
      const viewData = {
        id: issue._id,
        description: issue.description
      }
      res.render('./issues/edit', { viewData })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates a specific issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async update (req, res) {
    try {
      const issue = await Issue.updateOne({ _id: req.body.id }, {
        value: req.body.value
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
      if (issue.nModified === 1) {
        req.session.flash = { type: 'success', text: 'The issue was updated successfully.' }
      } else {
        req.session.flash = {
          type: 'danger',
          text: 'The task you attempted to update was removed by another user after you got the original values.'
        }
      }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./edit')
    }
  }

  /**
   * Returns a HTML form for removing a issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async remove (req, res) {
    try {
      const issue = await Issue.findOne({ _id: req.params.id })
      const viewData = {
        id: issue._id,
        value: issue.value
      }
      res.render('./issues/remove', { viewData })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the specified issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      await Issue.deleteOne({ _id: req.body.id }) // Specify id for issue that is going to be deleted.

      req.session.flash = { type: 'success', text: 'The issue was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./remove')
    }
  }
}
