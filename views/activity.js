const request = require('request-promise')
var csurf = require('csurf')
const auth = require('../auth.js')


var activity = function (req, resp) {
  var json_response = {
    socket_host: req.headers.host.indexOf('localhost') == 0 ? 'http://' + req.headers.host : 'https://' + req.headers.host
  }
  resp.render('activity', json_response)
}


module.exports = activity