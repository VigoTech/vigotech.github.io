const fs = require('fs')
const path = require('path')


module.exports = {
  getSlugs (post, index) {
    console.log('post', post)
    let slug = post.substr(0, post.lastIndexOf('.md'));
    return `/post/${slug}`
  },
  getFiles () {
    let files = fs.readdirSync('./markdown');
    files = files.filter( file => {
      return path.extname(file).toLowerCase() === '.md';
    })

    return files
  }
}
