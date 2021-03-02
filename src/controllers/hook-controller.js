/**
 * Module for the HookController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HookController {
  /**
   * Recieves a Webhook, validates it and sends it to Tasks Create Controller.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    req.body = {
      description: req.body.object_attributes.title,
      done: false
    }

    next()
  }

  /**
   * Authorizes the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorize (req, res, next) {
    // Validate the Gitlab Secret Token to be sure that the hook is from the correct sender.
    // This need to be in a database if we have multiple users.
    if (req.headers['x-gitlab-token'] !== process.env.HOOK_SECRET) {
      res.status(403).send('Incorrect Secret')
      return
    }

    next()
  }
}
