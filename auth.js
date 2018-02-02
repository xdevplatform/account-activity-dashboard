const nconf = require('nconf')
const request = require('request')
const queryString = require('query-string')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter')

// load config
nconf.file({ file: 'config.json' }).env()


var auth = {}
auth.twitter_oauth = {
  consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
  consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
  token: nconf.get('TWITTER_ACCESS_TOKEN'),
  token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET')
}
auth.twitter_webhook_environment = nconf.get('TWITTER_WEBHOOK_ENV')


// Configure the Twitter strategy for use by Passport.
//
// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new TwitterStrategy({
    consumerKey: auth.twitter_oauth.consumer_key,
    consumerSecret: auth.twitter_oauth.consumer_secret,
    // we want force login, so we set the URL with the force_login=true
    userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate?force_login=true'
  },
  // stores profile and tokens in the sesion user object
  // this may not be the best solution for your application
  function(token, tokenSecret, profile, cb) {
    return cb(null, {
      profile: profile,
      access_token: token,
      access_token_secret: tokenSecret
    })
  }
))


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
})


/**
 * Retrieves a Twitter Sign-in auth URL for OAuth1.0a
 */
auth.get_twitter_auth_url = function (host, callback_action) {
  
  // construct request to retrieve authorization token
  var request_options = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    oauth: {
      callback: 'https://' + host + '/callbacks/twitter/' + callback_action,
      consumer_key: auth.twitter_oauth.consumer_key,
      consumer_secret: auth.twitter_oauth.consumer_secret
    }
  }

  return new Promise (function (resolve, reject) {
    request(request_options, function(error, response) {
      if (error) {
        reject(error)
      }
      else {
        // construct sign-in URL from returned authorization token
        var response_params = queryString.parse(response.body)
        console.log(response_params)
        var twitter_auth_url = 'https://api.twitter.com/oauth/authenticate?force_login=true&oauth_token=' + response_params.oauth_token
        
        resolve({
          response_params: response_params,
          twitter_auth_url: twitter_auth_url
        })
      }
    })
  })
}


/**
 * Retrieves a bearer token for OAuth2
 */
auth.get_twitter_bearer_token = function () {

  // just return the bearer token if we already have one
  if (auth.twitter_bearer_token) {
    return new Promise (function (resolve, reject) {
      resolve(auth.twitter_bearer_token)
    })
  }

  // construct request for bearer token
  var request_options = {
    url: 'https://api.twitter.com/oauth2/token',
    method: 'POST',
    auth: {
      user: auth.twitter_oauth.consumer_key,
      pass: auth.twitter_oauth.consumer_secret
    },
    form: {
      'grant_type': 'client_credentials'
    }
  }

  return new Promise (function (resolve, reject) {
    request(request_options, function(error, response) {
      if (error) {
        reject(error)
      }
      else {
        var json_body = JSON.parse(response.body)
        console.log("Bearer Token:", json_body.access_token)
        auth.twitter_bearer_token = json_body.access_token
        resolve(auth.twitter_bearer_token)
      }
    })
  })
}


module.exports = auth