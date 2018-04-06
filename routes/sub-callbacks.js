const request = require('request-promise')
const passport = require('passport')
const auth = require('../helpers/auth.js')


var sub_request_options = {
  url: 'https://api.twitter.com/1.1/account_activity/all/' + auth.twitter_webhook_environment + '/subscriptions.json',
  oauth: auth.twitter_oauth,
  resolveWithFullResponse: true
}

var actions = {}

actions.addsub = function (user) {
  sub_request_options.oauth.token = user.access_token
  sub_request_options.oauth.token_secret = user.access_token_secret
  
  return request.post(sub_request_options)
}

actions.removesub = function (user) {
  sub_request_options.oauth.token = user.access_token
  sub_request_options.oauth.token_secret = user.access_token_secret

  return request.delete(sub_request_options)
}


module.exports = function (req, resp) {
  if (actions[req.params.action]) {
    actions[req.params.action](req.user).then(function (response) {
      var json_response = {
        title: 'Success',
        message: 'Subscriptions successfully modified.',
        button: {
          title: 'Ok',
          url: '/subscriptions'
        }
      }
      resp.render('status', json_response)
    }).catch(function (response) {
      console.log(response)
      var json_response = {
        title: 'Error',
        message: 'Subscriptions unable to be modified.',
        button: {
          title: 'Ok',
          url: '/subscriptions'
        }
      }
      if (response.error) {
        json_response.message = JSON.parse(response.error).errors[0].message
      }
      resp.status(500)
      resp.render('status', json_response)
    })
  } else {
    var json_response = {
      title: 'Error',
      message: 'Action "' + req.params.action +  '"" not defined.',
      button: {
        title: 'Ok',
        url: '/subscriptions'
      }
    }
    resp.status(404);
    resp.render('status', json_response)
  }
}

