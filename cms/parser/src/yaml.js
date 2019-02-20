const yaml = require('yaml')

const friendlyError = (reason) =>
  Promise.reject(String(`Could not parse YAML file.`))

module.exports = {
  parse: yaml.parse,
  friendlyError
}
