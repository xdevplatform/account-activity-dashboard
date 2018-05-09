var request = require('request-promise')
var auth = require('../../helpers/auth.js')


// request options
request_options = {
  url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
  oauth: auth.twitter_oauth
}

// get current user info
request.get(request_options, function (error, response, body) {

  if (error) {
    console.log('Error retrieving user data.')
    console.log(error)
    return;
  }

  console.log(body)
})