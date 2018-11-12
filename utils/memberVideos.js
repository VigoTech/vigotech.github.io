const youtubeVideos = require('./youtubeVideos.js')
const teltekVideos = require('./teltekVideos.js')
const colors = require('colors')


module.exports = {
  getVideos(groupVideos, maxVideos) {
    switch (groupVideos.type) {
      case 'youtube':
        return youtubeVideos.getChannelVideos(groupVideos, maxVideos)
        break;
      case 'teltek':
        return teltekVideos.getVideos(groupVideos, maxVideos);
        break;
      default:
        return {}
        break;
    }
  }
}
