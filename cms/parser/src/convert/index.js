const cptui = require('./cptui')
const acf = require('./acf')

module.exports = ({ pages, posts }) =>
  Promise.all(posts.map(acf.group))
    .then(postsAcf =>
      Promise.all(posts.map(cptui.post))
        .then(postsCptUi => [
          ...postsAcf.map(group => ({
            name: 'acf-json/' + group.key + '.json',
            data: group
          })),
          {
            name: 'post_types.json',
            data: postsCptUi
          },
          {
            name: 'taxonomies.json',
            data: {}
          }
        ])
    )
