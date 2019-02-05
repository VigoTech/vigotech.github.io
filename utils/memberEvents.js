const meetupEvents = require('./meetupEvents.js')
const eventbriteEvents = require('./eventbriteEvents.js')
const jsonEvents = require('./jsonEvents.js')
const colors = require('colors')
const moment = require('moment')


module.exports = {
  getNextEvent(groupNextEvents) {
    let nextEvent
    switch (groupNextEvents.type) {
      case 'meetup':
        nextEvent = meetupEvents.getNextEvent(groupNextEvents)
        break;
      case 'eventbrite':
        nextEvent = eventbriteEvents.getNextEvent(groupNextEvents)
        break;
      case 'json':
        nextEvent = jsonEvents.getNextEvent(groupNextEvents);
        break;
      default:
        nextEvent = {};
        break;
    }

    if (!nextEvent.title) {
      console.log(`        ${colors.yellow(`No upcoming events found`)}`)
    } else {
      console.log(`        ${colors.cyan(`Upcoming event found:`)} ${colors.blue(`${colors.bold(`${nextEvent.title}`)} ${eventDate(nextEvent.date)}`)}`)
    }
    console.log();

    return nextEvent;
  }
}


function eventDate(date) {
  return moment(date).format('dddd, D MMMM YYYY HH:mm')
}