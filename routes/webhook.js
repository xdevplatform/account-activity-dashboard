const request = require('request-promise')
const auth = require('../helpers/auth.js')


var webhook = {}


/**
 * Retrieves existing webhook config and renders
 */
webhook.get_config = function (req, resp) {
  // construct request to retrieve webhook config
  var request_options = {
    url: 'https://api.twitter.com/1.1/account_activity/all/' + auth.twitter_webhook_environment + '/webhooks.json',
    oauth: auth.twitter_oauth
  }

  request.get(request_options)

  // success
  .then(function (body) {
    var json_response = {
      configs: JSON.parse(body),
      csrf_token: req.csrfToken(),
      update_webhook_url: 'https://' + req.headers.host + '/webhook/twitter'
    }

    if (json_response.configs.length) {
      json_response.update_webhook_url = json_response.configs[0].url
    }

    console.log(json_response)
    resp.render('webhook', json_response)
  })

  // failure
  .catch(function (body) {
    if (body) {
      console.log(body)
    }
    var json_response = {
      title: 'Error',
      message: 'Webhook config unable to be retrieved',
      button: {
        title: 'Ok',
        url: '/webhook'
      }
    }

    resp.status(500);
    resp.render('status', json_response)
  })
}


/**
 * Triggers challenge response check
 */
webhook.validate_config = function (req, resp) {
  // get bearer token
  auth.get_twitter_bearer_token()

  // validate webhook config
  .then(function (bearer_token) {

    // request options
    var request_options = {
      url: 'https://api.twitter.com/1.1/account_activity/all/' + auth.twitter_webhook_environment + '/webhooks/' + req.body.webhook_id + '.json',
      resolveWithFullResponse: true,
      auth: {
        'bearer': bearer_token
      }
    }

    // PUT request to retreive webhook config
    request.put(request_options)

    // success
    .then(function (response) {
      var json_response = {
        title: 'Success',
        message: 'Challenge request successful and webhook status set to valid.',
        button: {
          title: 'Ok',
          url: '/webhook'
        }
      }

      resp.render('status', json_response)
    })

    // failure
    .catch(function (response) {
      var json_response = {
        title: 'Error',
        message: response.error,
        button: {
          title: 'Ok',
          url: '/webhook'
        }
      }

      resp.render('status', json_response)
    }) 
  })
}


/**
 * Deletes exiting webhook config
 * then creates new webhook config
 */
webhook.update_config = function (req, resp) {
  // delete webhook config
  delete_webhook(req.body.webhook_id)

  // create new webhook config
  .then(function () {
    var request_options = {
      url: 'https://api.twitter.com/1.1/account_activity/all/' + auth.twitter_webhook_environment + '/webhooks.json',
      oauth: auth.twitter_oauth,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        url: req.body.url
      }
    }

    return request.post(request_options)
  })

  // render success response
  .then(function (body) {
    var json_response = {
      title: 'Success',
      message: 'Webhook successfully updated.',
      button: {
        title: 'Ok',
        url: '/webhook'
      }
    }

    resp.render('status', json_response)
  })

  // render error response
  .catch(function (body) {
    var json_response = {
      title: 'Error',
      message: 'Webhook not updated.',
      button: {
        title: 'Ok',
        url: '/webhook'
      }
    }
    console.log(body)
    // Look for detailed error
    if (body.error) {
      json_response.message = JSON.parse(body.error).errors[0].message
    }

    resp.render('status', json_response)
  })
}


/**
 * Deletes existing webhook config
 */
webhook.delete_config = function (req, resp) {

  // delete webhook config
  delete_webhook(req.body.webhook_id)

  // render success response
  .then(function (body) {
    var json_response = {
      title: 'Success',
      message: 'Webhook successfully deleted.',
      button: {
        title: 'Ok',
        url: '/webhook'
      }
    }

    resp.render('status', json_response)
  })

  // render error response
  .catch(function () {
    var json_response = {
      title: 'Error',
      message: 'Webhook was not deleted.',
      button: {
        title: 'Ok',
        url: '/webhook'
      }
    }

    resp.render('status', json_response) 
  })
}


/**
 * Helper function that deletes the webhook config.
 * Returns a promise.
 */
function delete_webhook (webhook_id) {
  return new Promise (function (resolve, reject) {
    // if no webhook id provided, assume there is none to delete
    if (!webhook_id) {
      resolve()
      return;
    }

    // construct request to delete webhook config
    var request_options = {
      url: 'https://api.twitter.com/1.1/account_activity/all/' + auth.twitter_webhook_environment + '/webhooks/' + webhook_id + '.json',
      oauth: auth.twitter_oauth,
      resolveWithFullResponse: true
    }

    request.delete(request_options).then(function () {
      resolve()
    }).catch(function () {
      reject()
    })
  })
}


module.exports = webhook
