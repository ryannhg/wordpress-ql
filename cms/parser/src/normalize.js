// String utils
const pluralize = require('pluralize')
const spacify = (pascalCase) =>
  pascalCase.split('')
    .map(char => char === char.toUpperCase() ? ' ' + char : char)
    .join('')
    .trim()
const sluggify = (words) =>
  words.split(' ').filter(a => a).join('-').toLowerCase()

const prettify = (camelCase) =>
  camelCase[0].toUpperCase() + camelCase.slice(1).split('')
    .map(char => char === char.toUpperCase() ? ' ' + char : char)
    .join('')
    .trim()

const postName = key => sluggify(pluralize(spacify(key)))
const postLabel = key => pluralize(spacify(key))
const postSingularLabel = key => spacify(key)

const fieldName = key => key
const fieldLabel = key => prettify(key)

const kvps = (obj) =>
  Object.entries(obj).map(([ key, value ]) => ({ key, value }))

const errors = {
  invalidShape: (key) => `'${key}' needs both 'options' and 'fields'.`,
  missingType: (key) => `${key} field doesn't provide it's type.`
}

const debug = a => console.log(a) || a

const normalize = {
  pages: pages => normalize.posts(pages),
  posts: posts => Promise.all(kvps(posts).map(normalize.post)),
  post: ({ key, value }) => {
    const hasFields = value && typeof value === 'object'
    const { options, fields, taxonomies } = value || {}

    if (options && fields) {
      return normalize.fields(fields)
        .then(fields => ({
          name: postName(key),
          label: postLabel(key),
          singular_label: postSingularLabel(key),
          ...value.options,
          fields,
          taxonomies: taxonomies || []
        }))
    } else if (hasFields) {
      return normalize.post({
        key,
        value: {
          options: {},
          fields: value
        }
      })
    } else {
      return Promise.reject(errors.invalidShape(key))
    }
  },
  fields: fields => Promise.all(kvps(fields).map(normalize.field)),
  field: ({ key, value }) => {
    const hasType = value && value.type
    const isGroupShorthand = !hasType && value && typeof value === 'object'
    const isString = typeof value === 'string'

    if (hasType) {
      const { type, required, ref, max } = typeInfo(value.type)
      delete value.type
      return normalize.fields(value.fields || {})
        .then(fields => Promise.resolve({
          name: fieldName(key),
          label: fieldLabel(key),
          type,
          max,
          required,
          ...value,
          ref: type === 'taxonomy'
            ? postName(value && value.ref ? value.ref : ref)
            : ref,
          fields
        }))
    } else if (isGroupShorthand) {
      return normalize.fields(value)
        .then(fields => normalize.field({ key, value: { type: 'group', fields } }))
    } else if (isString) {
      return normalize.field({ key, value: { type: value } })
    } else {
      return Promise.reject(errors.missingType(key))
    }
  }
}

const endsIn = (str, piece) =>
  str.lastIndexOf(piece) === str.length - piece.length

const isCapitalized = (word) =>
  word[0].toUpperCase() === word[0]

const typeInfo = (type) => {
  const isRelationship = isCapitalized(type)
  const cleanType = type
    .split('?').join('')
    .split('[]').join('')
  return {
    required: !endsIn(type, '?'),
    type: isRelationship ? 'relationship' : cleanType,
    ref: isRelationship ? postName(cleanType) : undefined,
    max: isRelationship ? (endsIn(type, '[]') ? '' : '1') : undefined
  }
}

const map = fn => list => list.map(fn)

const flatten = (list) =>
  list.reduce((big, small) => big.concat(small), [])

const extractTaxonomies = (posts) =>
  Promise.resolve(posts)
    .then(map(({ name, taxonomies }) =>
      taxonomies.map(taxonomyName => ({
        name: postName(taxonomyName),
        label: postLabel(taxonomyName),
        singular_label: postSingularLabel(taxonomyName),
        types: [ name ] })
      )
    ))
    .then(flatten)

module.exports = {
  config: ({ pages, posts }) =>
    Promise.all([
      normalize.pages(pages || {}),
      normalize.posts(posts || {})
    ]).then(([ pages, posts ]) =>
      extractTaxonomies(posts)
        .then(debug)
        .then(taxonomies => ({
          pages,
          posts,
          taxonomies
        }))
    )
}
