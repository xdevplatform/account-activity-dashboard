const request = require('request-promise')
const auth = require('../../helpers/auth.js')
const args = require('../args.js')


auth.get_twitter_bearer_token().then(function (bearer_token) {

  // request options
  var request_options = {
    url: 'https://api.twitter.com/1.1/account_activity/webhooks/' + args.webhookid + '/subscriptions/all/list.json',
    auth: {
      'bearer': bearer_token
    }
  }
  console.log(request_options)
  request.get(request_options).then(function (body) {
    console.log(body)
  })
})
