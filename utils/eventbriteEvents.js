const request = require("sync-request")

module.exports = {
  getNextEvent(events) {
    if (events.eventbriteid !== undefined && events.eventbriteid !== '') {
      try {
        const res = request('GET', 'https://www.eventbriteapi.com/v3/events/search/', {
          qs: {
            'organizer.id': events.eventbriteid
          },
          headers: {
            'Authorization': `Bearer ${process.env.EVENTBRITE_OAUTH_TOKEN}`,
          }
        })

        const data = JSON.parse(res.getBody('utf8'))

        console.log(new Date(data.events[0].start.utc).getTime());
        return {
          title: data.events[0].name.text,
          date: new Date(data.events[0].start.utc).getTime(),
          url: data.events[0].url
        }
      }
      catch (e) {
        return {}
      }
    }
  }
}
