const commandLineArgs = require('command-line-args')


/**
 * Sets up command line arguments for
 * all example scripts
 */
const optionDefinitions = [
  { name: 'url', alias: 'u', type: String },
  { name: 'environment', alias: 'e', type: String },
  { name: 'webhookid', alias: 'i', type: String }
]


module.exports = commandLineArgs(optionDefinitions)