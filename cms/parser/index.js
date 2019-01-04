const fs = require('fs')
const yaml = require('yaml')
// const pluralize = require('pluralize')

const readFile = (path) =>
  new Promise((resolve, reject) =>
    fs.readFile(path, { encoding: 'utf8' }, (err, data) =>
      err ? reject(err) : resolve(data)
    )
  )

const configProperties = ['pages', 'posts', 'taxomonies']

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

const kvp = (obj) =>
  Object.keys(obj).map(key => ({
    key,
    value: obj[key]
  }))

const fromKvp = [
  (obj, { key, value }) => {
    obj[key] = value
    return obj
  },
  {}
]

// Field groups
const makeFieldGroups = ({ posts, pages }) => [
  pageFieldGroup(kvp(pages)),
  ...kvp(posts).map(fieldGroup)
]
let counter = {}
const id = key => {
  counter[key] = counter[key] || 0
  return counter[key]++
}
const groupKey = (name) => `group_${name}_${id('group')}`
const pageFieldKey = `field_page_type`
const fieldKey = (name) => `field_${name}_${id('field')}`

const capitalize = (str = '') =>
  [str[0].toUpperCase(), ...str.slice(1)].join('')
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

const pageLabel = (key, options) =>
  options.label || prettify(key)

const pageChoices = pages =>
  pages.reduce((obj, { key, value: { options = {} } }) => {
    obj[key] = pageLabel(key, options)
    return obj
  }, {})

const pageFields = (pages) =>
  pages.map(({ key, value: { options = {}, fields } }) => ({
    'key': fieldKey(key),
    'label': pageLabel(key, options),
    'name': key,
    'type': 'group',
    'instructions': '',
    'required': 0,
    'conditional_logic': [
      [
        {
          'field': pageFieldKey,
          'operator': '==',
          'value': key
        }
      ]
    ],
    'wrapper': {
      'width': '',
      'class': '',
      'id': ''
    },
    'layout': 'block',
    'sub_fields': makeFields(fields)
  }))

const pageFieldGroup = (pages) => ({
  'key': groupKey('pages'),
  'title': 'Pages',
  'fields': [
    {
      'key': pageFieldKey,
      'label': 'Page Type',
      'name': 'page_type',
      'type': 'select',
      'instructions': '',
      'required': 1,
      'conditional_logic': 0,
      'wrapper': {
        'width': '',
        'class': '',
        'id': ''
      },
      'choices': pageChoices(pages),
      'default_value': [],
      'allow_null': 0,
      'multiple': 0,
      'ui': 0,
      'return_format': 'value',
      'ajax': 0,
      'placeholder': ''
    },
    ...pageFields(pages)
  ],
  'location': [
    [
      {
        'param': 'post_type',
        'operator': '==',
        'value': 'page'
      }
    ]
  ],
  'menu_order': 0,
  'position': 'normal',
  'style': 'seamless',
  'label_placement': 'top',
  'instruction_placement': 'label',
  'hide_on_screen': [
    'the_content',
    'excerpt',
    'discussion',
    'comments',
    'revisions',
    'slug',
    'author',
    'format',
    'page_attributes',
    'featured_image',
    'categories',
    'tags',
    'send-trackbacks'
  ],
  'active': 1,
  'description': ''
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

// File System Utilities
const writeTo = (path, data) =>
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

// Post Types
const makePostTypes = ({ posts }) =>
  kvp(posts).map(makePostType).reduce(...fromKvp)

const makePostType = ({ key, value: { options = {}, taxonomies } }) => ({
  key,
  value: {
    'name': key,
    'label': options.label || prettify(key),
    'singular_label': options.singular_label || prettify(key),
    'description': options.description || '',
    'public': 'true',
    'publicly_queryable': 'true',
    'show_ui': 'true',
    'show_in_nav_menus': 'true',
    'show_in_rest': 'true',
    'rest_base': '',
    'rest_controller_class': '',
    'has_archive': 'false',
    'has_archive_string': '',
    'exclude_from_search': 'false',
    'capability_type': 'post',
    'hierarchical': 'false',
    'rewrite': 'true',
    'rewrite_slug': '',
    'rewrite_withfront': 'true',
    'query_var': 'true',
    'query_var_slug': '',
    'menu_position': '',
    'show_in_menu': 'true',
    'show_in_menu_string': '',
    'menu_icon': '',
    'supports': [
      'title'
    ],
    'taxonomies': taxonomies || [],
    'labels': {
      'menu_name': '',
      'all_items': '',
      'add_new': '',
      'add_new_item': '',
      'edit_item': '',
      'new_item': '',
      'view_item': '',
      'view_items': '',
      'search_items': '',
      'not_found': '',
      'not_found_in_trash': '',
      'parent_item_colon': '',
      'featured_image': '',
      'set_featured_image': '',
      'remove_featured_image': '',
      'use_featured_image': '',
      'archives': '',
      'insert_into_item': '',
      'uploaded_to_this_item': '',
      'filter_items_list': '',
      'items_list_navigation': '',
      'items_list': '',
      'attributes': '',
      'name_admin_bar': ''
    },
    'custom_supports': ''
  }
})

const makeTaxonomies = ({ posts }) =>
  console.log('TODO: taxonomies') || []

const start = _ =>
  readFile('../config.yaml')
    .then(yaml.parse)
    .then(validate)
    .then(config => [
      makeFieldGroups(config),
      makePostTypes(config),
      makeTaxonomies(config)
    ])
    .then(([fields, postTypes, taxomonies]) => [
      { filename: '../dist/fields.json', data: fields },
      { filename: '../dist/post_types.json', data: postTypes },
      { filename: '../dist/taxonomies.json', data: taxomonies }
    ])
    .then(mkdir('../dist'))
    .then(files => Promise.all(
      files.map(({ filename, data }) => writeTo(filename, data)))
    )
    .catch(console.error)

start()
