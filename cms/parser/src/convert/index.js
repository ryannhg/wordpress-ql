const cptui = require('./cptui')
const acf = require('./acf')

module.exports = ({ pages, posts, taxonomies }) =>
  Promise.all([
    Promise.all(posts.map(acf.group)),
    Promise.all(posts.map(cptui.post)),
    Promise.all(taxonomies.map(cptui.taxonomy))
  ])
    .then(([ postsAcf, postsCptUi, taxonomyCptUi ]) => [
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
        data: taxonomyCptUi
      }
    ])
