const request = require('request-promise')
const auth = require('../../helpers/auth.js')
const args = require('../args.js')


// request options
var request_options = {
  url: 'https://api.twitter.com/1.1/account_activity/all/' + args.environment + '/webhooks.json',
  oauth: auth.twitter_oauth,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  },
  form: {
    url: args.url
  }
}


// POST request to create webhook config
request.post(request_options).then(function (body) {
  console.log(body)
}).catch(function (body) {
  console.log(body)
})