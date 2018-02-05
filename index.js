var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var passport = require('passport')
var TwitterStrategy = require('passport-twitter')
var app = express()
var security = require('./security')
var auth = require('./auth')
var cacheRoute = require('./cache-route')


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.set('views', __dirname + '/pages')
app.set('view engine', 'ejs')


/**
 * Receives challenge response check (CRC)
 **/
app.get('/webhook/twitter', function(request, response) {

  var crc_token = request.query.crc_token

  if (crc_token) {
    var hash = security.get_challenge_response(crc_token, auth.twitter_oauth.consumer_secret)

    response.status(200);
    response.send({
      response_token: 'sha256=' + hash
    })
  } else {
    response.status(400);
    response.send('Error: crc_token missing from request.')
  }
})


/**
 * Receives Account Acitivity events
 **/
app.post('/webhook/twitter', function(request, response) {

  console.log(JSON.stringify(request.body, null, 2))

  response.send('200 OK')
})


/**
 * Serves the home page
 **/
app.get('/', function(request, response) {
  response.render('index')
})


/**
 * Subscription management
 **/
app.get('/subscriptions', cacheRoute(1000), require('./views/subscriptions'))


/**
 * Starts Twitter sign-in process for adding a user subscription
 **/
app.get('/subscriptions/add', passport.authenticate('twitter', {
  callbackURL: '/callbacks/addsub'
}));

/**
 * Starts Twitter sign-in process for removing a user subscription
 **/
app.get('/subscriptions/remove', passport.authenticate('twitter', {
  callbackURL: '/callbacks/removesub'
}));


/**
 * Webhook management routes
 **/
var webhook_view = require('./views/webhook')
app.get('/webhook', cacheRoute(1000), webhook_view.get_config)
app.post('/webhook/update', webhook_view.update_config)
app.post('/webhook/validate', webhook_view.validate_config)
app.post('/webhook/delete', webhook_view.delete_config)


/**
 * Handles Twitter sign-in OAuth1.0a callbacks
 **/
app.get('/callbacks/:action', passport.authenticate('twitter', { failureRedirect: '/' }),
  require('./views/sub-callbacks'))


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})


