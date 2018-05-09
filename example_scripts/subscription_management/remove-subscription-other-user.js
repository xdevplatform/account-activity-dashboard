const request = require('request-promise')
const queryString = require('query-string');
const prompt = require('prompt-promise');
const auth = require('../../helpers/auth.js')
const args = require('../args.js')


// request options to start PIN-based Twitter sign-in process
var request_token_request_options = {
  url: 'https://api.twitter.com/oauth/request_token?oauth_callback=oob',
  oauth: auth.twitter_oauth
}

var request_token_response;

// generates URL for login and prompts for PIN
request.get(request_token_request_options).then(function (body) {
  request_token_response = queryString.parse(body)
  
  console.log('Open this URL in a browser and sign-in with the Twitter account you wish to remove subscription from:')
  console.log('https://api.twitter.com/oauth/authorize?oauth_token=' + request_token_response['oauth_token'] + '&force_login=true')

  return prompt('Enter the generated PIN:')
})

// validates PIN and generates access tokens
.then(function (prompt_reponse) {
  prompt.end()

  var access_token_request_options = {
    url: 'https://api.twitter.com/oauth/access_token?oauth_verifier=' + prompt_reponse,
    oauth: {
      consumer_key: auth.twitter_oauth['consumer_key'],
      consumer_secret: auth.twitter_oauth['consumer_secret'],
      token: request_token_response['oauth_token'],
      token_secret: request_token_response['oauth_token_secret']
    }
  }

  return request.get(access_token_request_options)
})

// removes subscription for user 
.then(function (body) {
  var access_tokens = queryString.parse(body)

  var subscription_request_options = {
    url: 'https://api.twitter.com/1.1/account_activity/all/' + args.environment + '/subscriptions.json',
    oauth: {
      consumer_key: auth.twitter_oauth['consumer_key'],
      consumer_secret: auth.twitter_oauth['consumer_secret'],
      token: access_tokens['oauth_token'],
      token_secret: access_tokens['oauth_token_secret']
    },
    resolveWithFullResponse: true
  }

  return request.delete(subscription_request_options)
})

// add subscription success
.then(function (response) {
  console.log('HTTP response code:', response.statusCode)

  if (response.statusCode == 204) {
    console.log('Subscription removed.')
  }
})

// add subscrition error
.catch(function (response) {
  console.log('Subscription was not able to be removed.')
  console.log('- Verify environment name.')
  console.log('- Verify correct PIN was used.')
  console.log('- Verify "Read, Write and Access direct messages" is enabled on apps.twitter.com.')
  console.log('Full error message below:')
  console.log(response)
})
