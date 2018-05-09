const request = require('request-promise')
const auth = require('../../helpers/auth.js')
const args = require('../args.js')


auth.get_twitter_bearer_token().then(function (bearer_token) {

  // request options
  var request_options = {
    url: 'https://api.twitter.com/1.1/account_activity/all/' + args.environment + '/webhooks/' + args.webhookid + '.json',
    resolveWithFullResponse: true,
    auth: {
      'bearer': bearer_token
    }
  }

  // PUT request to retrieve webhook config
  request.put(request_options).then(function (response) {
    console.log('HTTP response code:', response.statusCode)
    console.log('CRC request successful and webhook status set to valid.')
  }).catch(function (response) {
    console.log('HTTP response code:', response.statusCode)
    console.log(response.error)
  }) 
})