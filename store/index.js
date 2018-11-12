
export const state = () => ({
  vigotechStructure: {
    members: {}
  }
})

export const mutations = {
  loadData (state, payload) {
    state.vigotechStructure = payload
  }
}

export const actions = {
  loadData (store) {
    this.$axios.get(process.env.VIGOTECH_MEMBERS_SOURCE_GENERATED)
      .then(response => {
        store.commit('loadData', response.data)
      })
  }
}


export const getters = {
  nextEventGroup(state) {
    let groupsByNextEvent = state.vigotechStructure.members

    let groupNextEvent = {
      nextEvent: {
        date: 9999999999999
      }
    }

    for (let groupKey in groupsByNextEvent) {
      let group = groupsByNextEvent[groupKey]
      try {
        let date = group.nextEvent.date

        if (date > new Date().getTime() && date < groupNextEvent.nextEvent.date) {
          groupNextEvent = group
        }
      }
      catch (e) {
      }
    }
    if (groupNextEvent.nextEvent.date < 9999999999999) {
      return groupNextEvent
    }
    else {
      return {}
    }
  },
  recentVideos(state) {
    const videos = {}

    for(let groupKey in state.vigotechStructure.members) {
      let group = state.vigotechStructure.members[groupKey]

      for(let videoKey in group.videolist) {
        let video = group.videolist[videoKey]
        videos[video.pubDate] = video
      }
    }

    //Sort by pubdate
    const videosSortedByDate = {};
    Object.keys(videos).sort().reverse().forEach(function(key) {
      videosSortedByDate[key] = videos[key];
    });

    //Return only 4 videos
    const result = Object.keys(videosSortedByDate).map(function(key) {
      return videosSortedByDate[key];
    });

    return result.splice(0, 4)
  }
}
