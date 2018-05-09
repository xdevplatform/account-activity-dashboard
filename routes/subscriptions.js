const request = require('request-promise')
const auth = require('../helpers/auth.js')


module.exports = function (req, response) {
  var saved_bearer_token
  var json_response

  // get list of subs
  auth.get_twitter_bearer_token().then(function (bearer_token) {
    saved_bearer_token = bearer_token
    var request_options = {
      url: 'https://api.twitter.com/1.1/account_activity/all/' + auth.twitter_webhook_environment + '/subscriptions/list.json',
      auth: {
        'bearer': saved_bearer_token
      }
    }

    return request.get(request_options)

  })

  // hydrate user objects from IDs
  .then(function (body) {
    var json_body = json_response = JSON.parse(body)

    // if no subs, render as is and skip user hydration
    if (!json_body.subscriptions.length) {
      response.render('subscriptions', json_body)
      return Promise.resolve()
    }

    // construct comma delimited list of user IDs for user hydration
    var user_id
    json_body.subscriptions.forEach(function(sub) {
      if (user_id) {
        user_id = user_id + ',' + sub.user_id
      } else {
        user_id = sub.user_id
      }
    });

    var request_options = {
      url: 'https://api.twitter.com/1.1/users/lookup.json?user_id=' + user_id,
      auth: {
        'bearer': saved_bearer_token
      }
    }

    return request.get(request_options)
  })
  
  // replace the subscriptions list with list of user objects
  // and render list
  .then(function (body) {
    // only render if we didn't skip user hydration
    if (body) {
      json_response.subscriptions = JSON.parse(body)
      response.render('subscriptions', json_response)
    }
  })

  .catch(function (body) {
    console.log(body)

    var json_response = {
      title: 'Error',
      message: 'Subscriptions could not be retrieved.',
      button: {
        title: 'Ok',
        url: '/'
      }
    }

    resp.status(500);
    resp.render('status', json_response)
  })

}