const dotenv = require('dotenv').config()
const colors = require("colors")
const fs = require('fs')
const { Events, Videos, Source } = require('metagroup-schema-tools')
const moment = require('moment')
const SOURCE_JSON = process.env.VIGOTECH_MEMBERS_SOURCE_FILE
const GENERATED_JSON = 'static/vigotech-generated.json'
const JSON_SCHEMA = 'static/vigotech-schema.json'




function eventDate(date) {
  return moment(date).format('dddd, D MMMM YYYY HH:mm')
}

function getNextEvents(data) {

  const eventEmitter = Events.getEventsEmitter()

  eventEmitter.on('getNextFromSourceInit', (source, options) => {
    console.log(`    · Getting upcoming events json for ${colors.green(options.member.name)} from ${colors.underline(source.type)}`);
  })

  eventEmitter.on('getNextFromSourceCompleted', (nextEvents, options) => {
    if (nextEvents.length === 0) {
      console.log(`        ${colors.yellow(`No upcoming events found`)}`)
    } else {
      if (nextEvents.length === undefined) {
        nextEvents = [nextEvents]
      }

      const nextEvent = nextEvents[0]
      console.log(`        ${colors.cyan(`Upcoming event found:`)} ${colors.blue(`${colors.bold(`${nextEvent.title}`)} ${eventDate(nextEvent.date)}`)}`)
    }
    console.log();
  })


  // Get root group next events
  const rootNextEvents = Events.getGroupNextEvents(data.events, {
    eventbriteToken: process.env.EVENTBRITE_OAUTH_TOKEN,
    member: data
  })
  data.nextEvent = rootNextEvents[0]


  // Get members next events
  for(let memberKey in data.members) {
    const member = data.members[memberKey]
    const membersNextEvents = Events.getGroupNextEvents(member.events, {
      eventbriteToken: process.env.EVENTBRITE_OAUTH_TOKEN,
      member: member
    })
    data.members[memberKey].nextEvent = membersNextEvents[0]
  }

  return data
}


async function getMembersVideos(membersData) {

  const eventEmitter = Videos.getEventsEmitter()

  eventEmitter.on('getVideosFromSourceInit', (source, options) => {
    console.log(`    · Getting member videos for ${colors.green(options.member.name)} from ${colors.underline(source.type)}`);
  })

  eventEmitter.on('getVideosFromSourceCompleted', (videos, options) => {
    if (videos.length == 0) {
      console.log(`        ${colors.yellow(`No videos found`)}`)
    }
    else {
      console.log(`        ${colors.cyan(`Imported ${videos.length} videos`)}`)
    }
    console.log();
  })


  // Get members videos
  for(let memberKey in data.members) {
    const member = data.members[memberKey]
    data.members[memberKey].videoList = await Videos.getGroupVideos(member.videos, 6, {
      youtubeApiKey: process.env.YOUTUBE_API_KEY,
      member: member
    })
  }

  return data
}

function saveJsonFile(data) {
  fs.writeFileSync(GENERATED_JSON, JSON.stringify(data));
  console.log(`  ${colors.inverse(`Saving ${colors.yellow(`${GENERATED_JSON}`)}`)}`);
}









// Read and parse source data
console.log(`${colors.inverse("Getting vigotech.json file")}`);
console.log(`   Getting members json from ${colors.underline(SOURCE_JSON)}`)
let data = {}
try {
  const dataRaw = fs.readFileSync(SOURCE_JSON, 'utf8')
  data = JSON.parse(dataRaw)
} catch(e) {
  console.log(`${colors.red.inverse(e)}`);
  process.exit(1)
}

// Validate data schema
console.log(`${colors.inverse("Validate vigotech.json file")}`);
console.log(`   Getting json schema from ${colors.underline(JSON_SCHEMA)}`);
let schema = {}
try {
  const schemaRaw = fs.readFileSync(JSON_SCHEMA, 'utf8')
  schema = JSON.parse(schemaRaw)
} catch(e) {
  console.log(`${colors.red.inverse(e)}`);
  process.exit(1)
}
const validationResult = Source.validate(data, schema)

if (validationResult.errors.length > 0) {
  console.log(`${colors.red.inverse('Error validating source data')}`);
  console.log(typeof validationResult.errors)
  validationResult.errors.forEach( (error) => {
    console.log(`  ${colors.red(error.property + ' ' + error.message)}`)
    console.log(error.instance)
  })
  process.exit(1);
}
console.log(`   ${colors.green.inverse('OK')}`);

// Import events
console.log(`${colors.inverse("Preparing json files")}`);
console.log(`${colors.bold("  Import next events")}`);
data = getNextEvents(data)
console.log();
console.log();

//Import videos
console.log(`${colors.bold("  Import videos")}`);
getMembersVideos(data)
  .then(data => {
    saveJsonFile(data)
  })
