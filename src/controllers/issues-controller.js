/**
 * Module for the CrudSnippetsController.
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
   * Displays a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        issue: (await Issue.find({})) // Get all objects and filter out id and value.
          .map(issue => ({
            id: issue._id,
            title: issue.title,
            username: issue.username,
            value: issue.value
          }))
      }
      res.render('issues/index', { viewData }) // Present the data in HTML.
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async new (req, res) {
    const viewData = {
      value: ''
    }
    res.render('issues/new', { viewData })
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      const issue = new Issue({
        value: req.body.value,
        title: req.body.title
      })
      await issue.save() // Save object in mongodb.
      res.redirect('.')
      req.session.flash = {
        type: 'success', text: 'The issue was created successfully.'
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./new')
    }
  }

  /**
   * Returns a HTML form for editing a snippet.
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
        value: issue.value
      }
      res.render('./issues/edit', { viewData })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates a specific snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async update (req, res) {
    try {
      const result = await Issue.updateOne({ _id: req.body.id }, {
        value: req.body.value
      })
      if (result.nModified === 1) {
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
   * Returns a HTML form for removing a snippet.
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
   * Deletes the specified snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      await Issue.deleteOne({ _id: req.body.id }) // Specify id for snippet that is going to be deleted.

      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./remove')
    }
  }
}
