
export const state = () => ({
  vigotechStructure: {
    members: {}
  },
  cookieStatus: false
})

export const mutations = {
  loadData (state, payload) {
    state.vigotechStructure = payload
  },
  setCookieStatus (state, payload) {
    state.cookieStatus = payload
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
  membersAndRoot(state) {
    const vigotechStructure = JSON.parse(JSON.stringify(state.vigotechStructure))

    // Insert Vigotech (Root) as member
    const vigotechStructureFull = vigotechStructure.members
    vigotechStructureFull['root'] = vigotechStructure
    vigotechStructureFull['root'].members = null;

    return vigotechStructureFull;

  },
  nextEventGroup(state) {
    let groupsByNextEvent = getters.membersAndRoot(state)
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
        console.log(e)
      }
    }


    if (groupNextEvent.nextEvent.date < 9999999999999) {
      return groupNextEvent
    }
    else {
      return {}
    }
  },
  nextEvents(state, getters) {
    try {
      const nextEventGroup = getters.nextEventGroup

      if (nextEventGroup === {}) {
        return {};
      } else {
        let groupsByNextEvent = getters.membersAndRoot
        let groupNextEvents = []

        for (let groupKey in groupsByNextEvent) {
          let group = groupsByNextEvent[groupKey]
          try {

            if (group.nextEvent.date === undefined) {
              continue
            }

            const date = new Date(group.nextEvent.date)
            const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

            const now = new Date(nextEventGroup.nextEvent.date)
            const nowString = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`

            if (dateString === nowString) {
              groupNextEvents.push(group)
            }
          }
          catch (e) {
            console.log(e)
          }
        }
        return groupNextEvents;
      }
    } catch (e) {
      console.log(e)
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
