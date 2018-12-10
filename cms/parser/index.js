const fs = require('fs')
const yaml = require('yaml')
// const pluralize = require('pluralize')

const readFile = (path) =>
  new Promise((resolve, reject) =>
    fs.readFile(path, { encoding: 'utf8' }, (err, data) =>
      err ? reject(err) : resolve(data)
    )
  )

const configProperties = [ 'pages', 'posts', 'taxomonies' ]

const isNotAnObject = (thing) =>
  thing && typeof thing !== 'object'

const validate = (config = {}) =>
  new Promise((resolve, reject) => {
    const errors =
      configProperties
        .filter(prop => isNotAnObject(config[prop]))
        .map(prop => `${prop} should be an object.`)
    if (errors.length > 0) {
      reject(errors)
    } else {
      resolve(config)
    }
  })

// const types = ({ pages }) =>
//   'TODO'

const kvp = (obj) =>
  Object.keys(obj).map(key => ({
    key,
    value: obj[key]
  }))

const fieldGroups = ({ posts, pages }) => [
  ...kvp(posts).map(fieldGroup)
]
let counter = {}
const id = key => {
  counter[key] = counter[key] || 0
  return counter[key]++
}
const groupKey = (name) => `group_${name}_${id('group')}`
const fieldKey = (name) => `field_${name}_${id('field')}`

const capitalize = (str = '') =>
  [ str[0].toUpperCase(), ...str.slice(1) ].join('')
const prettify = (slug) =>
  capitalize(slug).split('-').join(' ')

const label = (key, field) => field.label || prettify(key)
const instructions = (field) => field.instructions || ''
const required = (field) => field.required ? 1 : 0
const conditionalLogic = (field) => 0
const wrapper = _ => ({ width: '', class: '', id: '' })
const defaultValue = field => field.default

const fieldFn = {
  Text: (key, field) => ({
    key: fieldKey(key),
    label: label(key, field),
    name: key,
    type: 'text',
    instructions: instructions(field),
    required: required(field),
    conditional_logic: conditionalLogic(field),
    wrapper: wrapper(),
    default_value: defaultValue(field),
    placeholder: '',
    prepend: '',
    append: '',
    maxlength: ''
  }),
  Group: (key, { options: field, subFields }) => ({
    key: fieldKey(key),
    label: label(key, field),
    name: key,
    type: 'group',
    instructions: instructions(field),
    required: required(field),
    conditional_logic: conditionalLogic(field),
    wrapper: wrapper(),
    layout: 'block',
    sub_fields: makeFields(subFields)
  })
}

const fieldGroup = ({ key, value: { options, fields } }) => ({
  key: groupKey(key),
  title: options.label || key,
  fields: makeFields(fields),
  location: [
    [
      {
        param: 'post_type',
        operator: '==',
        value: key
      }
    ]
  ],
  menu_order: 0,
  position: 'acf_after_title',
  style: 'seamless',
  label_placement: 'top',
  instruction_placement: 'label',
  hide_on_screen: '',
  active: 1,
  description: ''
})

const fromString = field =>
  field.length > 0 && field[field.length - 1] === '?'
    ? ({ type: field.slice(0, field.length - 1), required: false })
    : ({ type: field, required: true })

const fromObject = field =>
  field.type
    ? field
    : ({ options: { type: 'Group' }, subFields: field })

const normalizeField = ({ key, value }) =>
  typeof value === 'string'
    ? fromString(value)
    : value && typeof value === 'object'
      ? fromObject(value)
      : console.info('ERR',
        `${key} is a ${typeof value}. Expecting a string or object.`
      )

const field = ({ key, value: field }) => {
  const type = field.options ? field.options.type : field.type
  return fieldFn[type]
    ? fieldFn[type](key, field)
    : console.info('ERR', `I don't recognize field type '${field.type}' for '${key}'`)
}

const makeFields = fields =>
  kvp(fields)
    .map(field => {
      const value = normalizeField(field)
      return value ? { key: field.key, value } : undefined
    })
    .filter(a => a)
    .map(field)
    // .filter(a => a)

// const taxonomies = ({ taxonomies }) =>
//   'TODO'

const writeTo = (path) => (data) =>
  new Promise((resolve, reject) =>
    fs.writeFile(path, JSON.stringify(data), { encoding: 'utf8' }, (err) =>
      err ? reject(err) : resolve(data)
    )
  )

const mkdir = path => data => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  return data
}

const start = _ =>
  readFile('../config.yaml')
    .then(yaml.parse)
    .then(validate)
    .then(fieldGroups)
    .then(mkdir('../dist'))
    .then(writeTo('../dist/fields.json'))
    .catch(console.error)

start()
