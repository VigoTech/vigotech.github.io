const request = require("sync-request")

module.exports = {
  getNextEvent(events) {
    try {
      const res = request('GET', events.source)
      const data = JSON.parse(res.getBody('utf8'))
      if (data.date > new Date().getTime()) {
        return data
      }
    } catch (e) {
      console.log(e)
    }

    return {}
  }
}
