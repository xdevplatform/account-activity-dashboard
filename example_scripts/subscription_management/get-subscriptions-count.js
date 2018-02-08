const request = require('request-promise')
const auth = require('../../helpers/auth.js')


auth.get_twitter_bearer_token().then(function (bearer_token) {

  // request options
  var request_options = {
    url: 'https://api.twitter.com/1.1/account_activity/all/count.json',
    auth: {
      'bearer': bearer_token
    }
  }

  request.get(request_options).then(function (body) {
    console.log(body)
  })
})


