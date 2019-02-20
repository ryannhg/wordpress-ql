const fs = require('./fs')
const yaml = require('./yaml')
const normalize = require('./normalize')
const convertToFiles = require('./convert')
const path = require('path')
const map = fn => list => list.map(fn)

fs.read(path.join(__dirname, '..', '..', '..', 'config.yml'))
  .then(yaml.parse)
  .catch(yaml.friendlyError)
  .then(normalize.config)
  .then(convertToFiles)
  .then(fs.mkdir(path.join(__dirname, '..', 'dist')))
  .then(fs.mkdir(path.join(__dirname, '..', 'dist', 'acf-json')))
  .then(map(file => fs.save(path.join(__dirname, '..', 'dist', file.name), file.data)))
  .then(_ => 'Models regenerated!')
  .then(console.log)
  .catch(console.error)