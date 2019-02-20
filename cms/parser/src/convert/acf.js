const nums = {}
const num = name => {
  nums[name] = nums[name] + 1 || 0
  return nums[name]
}
const key = (name) => `${name}_${num(name)}`
const groupKey = (name) => `group_${key(name)}`
const fieldKey = (name) => `field_${key(name)}`

const fields = {
  text: ({ name, label, required = true }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'text',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    default_value: '',
    placeholder: '',
    prepend: '',
    append: '',
    maxlength: ''
  }),
  textarea: ({ name, label, required = true }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'textarea',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    default_value: '',
    placeholder: '',
    maxlength: '',
    rows: '',
    new_lines: ''
  }),
  image: ({ name, label, required }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'image',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    return_format: 'id',
    preview_size: 'thumbnail',
    library: 'all',
    min_width: '',
    min_height: '',
    min_size: '',
    max_width: '',
    max_height: '',
    max_size: '',
    mime_types: ''
  }),
  file: ({ name, label, required = true }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'file',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    return_format: 'id',
    library: 'all',
    min_size: '',
    max_size: '',
    mime_types: ''
  }),
  wysiwyg: ({ name, label, required = true }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'wysiwyg',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    default_value: '',
    tabs: 'all',
    toolbar: 'full',
    media_upload: 1,
    delay: 0
  }),
  select: ({ name, label, required = true, choices = {} }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'select',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    choices,
    default_value: [],
    allow_null: 0,
    multiple: 0,
    ui: 0,
    return_format: 'value',
    ajax: 0,
    placeholder: ''
  }),
  radio: ({ name, label, required = true, choices = {} }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'radio',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    choices,
    allow_null: 0,
    other_choice: 0,
    default_value: '',
    layout: 'vertical',
    return_format: 'value',
    save_other_choice: 0
  }),
  relationship: ({ name, label, required = true, ref = '', max = '' }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'relationship',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    post_type: ref.split(' '),
    taxonomy: '',
    filters: [
      'search',
      'post_type',
      'taxonomy'
    ],
    elements: '',
    min: '',
    max,
    return_format: 'object'
  }),
  taxonomy: ({ name, label, required = true, taxonomy }) => ({
    key: fieldKey(name),
    label,
    name,
    type: 'taxonomy',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    taxonomy,
    field_type: 'select',
    allow_null: 0,
    add_term: 1,
    save_terms: 0,
    load_terms: 0,
    return_format: 'id',
    multiple: 0
  }),
  tab: ({ label, required = true }) => ({
    key: fieldKey(label),
    label,
    name: '',
    type: 'tab',
    instructions: '',
    required: Number(required),
    conditional_logic: 0,
    wrapper: {
      width: '',
      class: '',
      id: ''
    },
    placement: 'top',
    endpoint: 0
  }),
  group: ({ name, label, fields = [] }) =>
    Promise.all(fields.map(makeField))
      .then(fields => ({
        key: fieldKey(name),
        label,
        name,
        type: 'group',
        instructions: '',
        required: 0,
        conditional_logic: 0,
        wrapper: {
          width: '',
          class: '',
          id: ''
        },
        layout: 'block',
        sub_fields: fields
      })),
  repeater: ({ name, label, fields = [] }) =>
    Promise.all(fields.map(unrequire).map(makeField))
      .then(fields => ({
        key: fieldKey(name),
        label,
        name,
        type: 'repeater',
        instructions: '',
        required: 0,
        conditional_logic: 0,
        wrapper: {
          width: '',
          class: '',
          id: ''
        },
        collapsed: '',
        min: 0,
        max: 0,
        layout: 'block',
        button_label: '',
        sub_fields: fields
      }))
}

// Groups and repeaters can't have required fields
const unrequire = (field) => ({ ...field, required: 0 })

const makeField = (field) =>
  fields[field.type]
    ? Promise.resolve(fields[field.type](field))
    : Promise.reject(String(`Can't find type "${field.type}" for ${field.name}.`))

const group = ({ name, label, fields = [] }) =>
  Promise.all(fields.map(makeField))
    .then(fields => ({
      key: groupKey(name),
      title: label,
      fields,
      location: [
        [
          {
            param: 'post_type',
            operator: '==',
            value: name
          }
        ]
      ],
      menu_order: 0,
      position: 'normal',
      style: 'seamless',
      label_placement: 'top',
      instruction_placement: 'label',
      hide_on_screen: [
        'permalink',
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
      active: 1,
      description: '',
      modified: 1550639070
    }))

module.exports = {
  group,
  fields
}
