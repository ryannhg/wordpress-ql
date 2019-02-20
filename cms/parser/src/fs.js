const fs = require('fs')

module.exports = {
  read: (path) => new Promise((resolve, reject) =>
    fs.readFile(path, { encoding: 'utf8' }, (err, data) =>
      err || !data ? reject(err) : resolve(data)
    )),
  save: (path, data) => new Promise((resolve, reject) =>
    fs.writeFile(path, JSON.stringify(data), { encoding: 'utf8' }, (err) =>
      err ? reject(err) : resolve(data)
    )
  ),
  mkdir: path => data => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    return data
  }
}
