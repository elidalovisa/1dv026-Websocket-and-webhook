/**
 * Module for the CrudSnippetsController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import { Issue } from '../models/issue.js'
import { User } from '../models/user.js'

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
    res.locals.user = req.session.user
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
    res.locals.user = req.session.user
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
        title: req.body.title,
        username: req.session.user.username
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

  /**
   * Returns a HTML form to register new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async register (req, res) {
    const viewData = {
      value: undefined
    }
    res.render('issues/register', { viewData })
  }

  /**
   * Register a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async registerUser (req, res) {
    try {
      // Check if password match.

      // Save user in database.
      const user = new User({
        username: req.body.username,
        password: req.body.password
      })
      await user.save() // Save object in mongodb.

      req.session.flash = { type: 'success', text: 'Registration successful.' }
      res.redirect('./login') // where to redirect
    } catch (error) {
      // If auth fails redirect to the register page and show an error message or show status code 401.
      req.session.flash = { type: 'danger', text: error.message }
      error.statusCode = 401
      res.redirect('./register') // where to redirect
    }
  }

  /**
   * Returns a HTML form to login.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async login (req, res) {
    const viewData = {
      value: undefined
    }
    res.render('issues/login', { viewData })
  }

  /**
   * Login user and regenerate a session cookie.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async loginUser (req, res) {
    try {
      const user = await User.authenticate(req.body.username, req.body.password)
      req.session.regenerate(() => {
        req.session.user = user
        req.session.username = req.body.username // Save users username to session
        req.session.loggedIn = true // Determine if user is logged in
        res.locals.user = req.session.user
        // ..  regenerate a session cookie, store user data in session store and redirect
        req.session.flash = { type: 'success', text: 'Login successful.' }
        res.redirect('./') // where to redirect
      })
    } catch (error) {
      // If auth fails redirect to the login page and show an error message or show status code 401.
      req.session.flash = { type: 'danger', text: error.message }
      error.statusCode = 401
      res.redirect('./login') // where to redirect
    }
  }

  /**
   * Log out user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async logout (req, res) {
    try {
      req.session.loggedIn = false
      req.session.destroy()
      res.redirect('./') // where to redirect
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Authorize user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next -  Express next middleware function.
   * @returns {object} - Returns error.
   */
  async authurize (req, res, next) {
    if (req.session.loggedIn) {
      next()
    } else {
      const error = new Error('Forbidden')
      error.statusCode = 404
      req.session.flash = { type: 'danger', text: 'You need to login' }
      return next(error)
    }
  }

  /**
   * Authorize user to see if user own snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next -  Express next middleware function.
   * @returns {object} - Returns error.
   */
  async authurizeOwner (req, res, next) {
    const snippet = await Issue.findOne({ _id: req.params.id }) // Get the id of the specific snippet.
    if (snippet.username !== req.session.user.username) {
      const error = new Error('Forbidden')
      error.statusCode = 403
      req.session.flash = { type: 'danger', text: error.message }
      return next(error)
    } else {
      next() // Go to next function in router call.
    }
  }
}
