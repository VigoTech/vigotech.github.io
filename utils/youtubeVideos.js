const request = require("sync-request")
const { google} = require('googleapis');




module.exports = {
  async getChannelVideos(videos, maxresults) {
    if (!videos.channel_id) {
      return []
    }
    const YouTube = google.youtube('v3');
    const results = []

    const channelResults = await YouTube.channels.list({
      part: 'contentDetails',
      id: videos.channel_id,
      maxresults,
      auth: process.env.YOUTUBE_API_KEY
    })

    const channelItems = channelResults.data.items;
    for(let i in channelItems) {
      const channelItem = channelItems[i]
      const playlistId = channelItem.contentDetails.relatedPlaylists.uploads

      const playlistResults = await YouTube.playlistItems.list({
        part: 'snippet',
        playlistId: playlistId,
        maxResults: maxresults,
        auth: process.env.YOUTUBE_API_KEY
      });


      const playlistItems = playlistResults.data.items;
      for(let j in playlistItems) {
        const playlistItem = playlistItems[j]

        results.push({
          player: 'youtube',
          id: playlistItem.snippet.resourceId.videoId,
          title: playlistItem.snippet.title,
          pubDate: new Date(playlistItem.snippet.publishedAt).getTime(),
          thumbnails: playlistItem.snippet.thumbnails
        })
      }

    }

    return results
  }
}
