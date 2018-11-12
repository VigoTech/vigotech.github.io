const request = require("sync-request")

module.exports = {
  getNextEvent(events) {
    try {
      const res = request('GET', `${process.env.MEETUP_API_BASE}/${events.meetupid}/events`)
      const data = JSON.parse(res.getBody('utf8'))
      return {
        title: data[0].name,
        date: data[0].time,
        url: data[0].link
      }
    } catch (e) {
      return {}
    }
  }
}
