const rssParser = require('rss-parser')
const parser = new rssParser()


module.exports = {
  async getVideos(videos, maxresults) {
    let results = []
    let feed = await parser.parseURL(videos.source);

    feed.items.forEach(item => {

      results.push({
        player: 'native', //'teltek',
        id: item.link.match(/pumukit\/(.*)\/(.*)\.mp4/)[2],
        src: item.link,
        title: item.title,
        pubDate: new Date(item.pubDate).getTime(),
        thumbnail: item.itunes.image
      })
    });
    return results
  }
}
