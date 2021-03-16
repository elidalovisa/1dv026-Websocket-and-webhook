/**
 * Module for the IssueController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import fetch from 'node-fetch'

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
    try {
      const projectIssues = await fetch('https://gitlab.lnu.se/api/v4/projects/13268/issues',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + process.env.PERSONAL_TOKEN,
            'Content-Type': 'application/json'
          }
        })
      const text = await projectIssues.json()
      const viewData = {
        issues: text// Get all objects and filter.
          .map(issue => ({
            id: issue.iid,
            state: issue.state,
            avatar: issue.author.avatar_url,
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

      console.log(viewData)
      res.render('issues/index', { viewData }) // Present the data in HTML.
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for closing a issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async edit(req, res) {
    try {
      const id = req.params.id
      const fetchedIssue = await fetch('https://gitlab.lnu.se/api/v4/projects/13268/issues/' + id,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + process.env.PERSONAL_TOKEN,
            'Content-Type': 'application/json'

          }
        })
      const responseIssue = await fetchedIssue.json()
      const issue = {
        id: responseIssue.iid,
        state: responseIssue.state,
        done: false,
        title: responseIssue.title,
        description: responseIssue.description,
        project_id: responseIssue.project_id
      }
      if (issue.state === 'closed') {
        issue.done = true
      }

      // Socket.io: Send the created task to all subscribers.
      res.io.emit('issue', {
        id: issue.id,
        state: issue.state,
        avatar: issue.avatar,
        done: issue.done,
        title: issue.title,
        description: issue.description,
        project_id: issue.project_id
      })

      // Webhook: Call is from hook. Skip redirect and flash.
      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
        return
      }
      res.render('issues/edit', { issue })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Creates a new issue from Gitlab.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      // Get issue from Gitlab hook
      const issue = {
        id: req.body.id,
        state: req.body.state,
        done: false,
        title: req.body.title,
        description: req.body.description,
        project_id: req.body.project_id
      }
      if (issue.state === 'closed') {
        issue.done = true
      }

      for (let i = 0; i < viewData.issues.length; i++) {
        if (viewData.issues[i].id === issue.id) {
          console.log(issue.id)
        } else {
          console.log('hej')
        }
      }
      // Socket.io: Send the created task to all subscribers.
      res.io.emit('issue', {
        title: issue.title,
        description: issue.description,
        state: issue.state,
        id: issue.id,
        avatar: issue.avatar,
        done: issue.done
      })

      // Webhook: Call is from hook. Skip redirect and flash.
      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
        return
      }

      req.session.flash = {
        type: 'success', text: 'The issue was created successfully.'
      }
      res.render('.') // Present the data in HTML.
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/errors/404.html')
    }
  }

  /**
   * Open the specified issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async open (req, res) {
    const id = req.params.id
    try {
      const issueResponse = await fetch('https://gitlab.lnu.se/api/v4/projects/13268/issues/' + id + '?state_event=reopen',
        {
          method: 'put',
          headers: {
            'PRIVATE-TOKEN': process.env.PERSONAL_TOKEN,
            'Content-Type': 'application/json'
          }
        })

      const response = await issueResponse.json()
      const issue = {
        id: response.id,
        state: response.state,
        avatar: response.author.avatar_url,
        done: false,
        title: response.title,
        description: response.description,
        project_id: response.project_id
      }

      console.log(issue)

      if (issue.state === 'closed') {
        issue.done = true
      }

      console.log(issue)

      // Socket.io: Send the reopened task to all subscribers.
      res.io.emit('reopen', {
        id: issue.iid,
        state: issue.state,
        avatar: issue.avatar,
        done: issue.done
      })

      // Webhook: Call is from hook. Skip redirect and flash.
      if (req.headers['x-gitlab-event']) {
        res.status(200).send('Hook accepted')
        return
      }

      req.session.flash = { type: 'success', text: 'The issue was reopened successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./errors')
    }
  }

  /**
   * Close the specified issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async close(req, res) {
    const id = req.params.id
    try {
      const issueResponse = await fetch('https://gitlab.lnu.se/api/v4/projects/13268/issues/' + id + '?state_event=close',
        {
          method: 'put',
          headers: {
            'PRIVATE-TOKEN': process.env.PERSONAL_TOKEN,
            'Content-Type': 'application/json'
          }
        })

      const response = await issueResponse.json()
      const issue = {
        id: response.iid,
        state: response.state,
        avatar: response.author.avatar_url,
        title: response.title,
        done: false,
        description: response.description
      }
      if (issue.state === 'closed') {
        issue.done = true
      }
      console.log(issue)

      // Socket.io: Send the closed issue to all subscribers.
      res.io.emit('closed', {
        title: issue.title,
        description: issue.description,
        state: issue.state,
        id: issue.id,
        avatar: issue.avatar,
        done: issue.done
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
