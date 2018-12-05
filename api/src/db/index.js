const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'wordpress'
  }
})

const get = postType =>
  knex
    .select('ID', 'post_title', 'post_name', 'wp_postmeta.meta_key', 'wp_postmeta.meta_value')
    .from('wp_posts')
    .join('wp_postmeta', 'wp_posts.ID', 'wp_postmeta.post_id')
    .where({ post_type: postType })
    .andWhereNot('wp_postmeta.meta_key', 'like', '\\_%')
    .andWhereNot('wp_postmeta.meta_value', '')
    .orderBy('ID')
    .reduce(...groupById)
    .then(Object.values)

const groupById = [
  (obj, item) => {
    obj[item.ID] = obj[item.ID] || {
      _id: item.ID,
      _title: item.post_title,
      _slug: item.post_name
    }
    const keys = item.meta_key.split('_')
    const value = item.meta_value
    addNestedField(obj[item.ID], keys, value)
    return obj
  },
  {}
]

const addNestedField = (fields, keys, value) => {
  fields[keys[0]] = keys.length === 1
    ? value
    : addNestedField(fields[keys[0]] || {}, keys.slice(1), value)
  return fields
}

module.exports = {
  get
}
