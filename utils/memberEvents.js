const meetupEvents = require('./meetupEvents.js')
const colors = require('colors')
const jsonEvents = require('./jsonEvents.js')

module.exports = {
  getNextEvent(groupNextEvents) {
    switch (groupNextEvents.type) {
      case 'meetup':
        const nextEvent = meetupEvents.getNextEvent(groupNextEvents)
        if (!nextEvent.title) {
          console.log(`          ${colors.yellow(`No upcoming events found`)}`)
        } else {
          console.log(`          ${colors.cyan(`Upcoming event found`)}`)
        }
        return nextEvent
        break;
      case 'json':
        return jsonEvents.getNextEvent(groupNextEvents);
        if (!nextEvent.title) {
          console.log(`          ${colors.yellow(`No upcoming events found`)}`)
        } else {
          console.log(`          ${colors.cyan(`Upcoming event found`)}`)
        }
        break;
      default:
        return {}
        break;
    }
  }
}
