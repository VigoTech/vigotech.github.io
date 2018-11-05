const request = require("sync-request")
const dotenv = require('dotenv').config()
const memberEvents = require('./utils/memberEvents')
const memberVideos = require('./utils/memberVideos')
const colors = require("colors")
const fs = require("fs")
const GENERATED_JSON = 'static/vigotech-generated.json'
const Validator = require('jsonschema').Validator;
const JSON_SCHEMA = 'static/vigotech-schema.json'


function getNextEvents(membersData) {
  for (let group in membersData.members) {
    let eventsSource = membersData.members[group].events || {
      type: null
    }

    console.log(`      Getting upcoming events json for ${colors.green(membersData.members[group].name)} from ${colors.underline(eventsSource.type)}`);
    membersData.members[group].nextEvent = memberEvents.getNextEvent(eventsSource)
  }
  return membersData
}

function getMembersInfo() {
  const source = process.env.VIGOTECH_MEMBERS_SOURCE_FILE
  console.log(`   Getting members json from ${colors.underline(source)}`);
  try {
    const res = fs.readFileSync(source, 'utf8')
    return JSON.parse(res)
  } catch(e) {
    console.log(
      `${colors.red.inverse(e)}`
    );
  }
}

async function getMembersVideos(membersData) {
  for (let group in membersData.members) {
    let videosSources = membersData.members[group].videos || {}

    for (let videosSourcesKey in videosSources) {
      const videoSource = videosSources[videosSourcesKey]
      console.log(`      Getting member videos for ${colors.green(membersData.members[group].name)} from ${colors.underline(videoSource.type)}`);
      const data = await memberVideos.getVideos(videoSource, 6)
      membersData.members[group].videolist = data

      if (data.length == 0) {
        console.log(`          ${colors.yellow(`No videos found`)}`)
      }
      else {
        console.log(`          ${colors.cyan(`Imported ${data.length} videos`)}`)
      }
    }
  }
  return membersData
}

function saveJsonFile(data) {
  fs.writeFileSync(GENERATED_JSON, JSON.stringify(data));
  console.log(`  ${colors.inverse(`Saving ${colors.yellow(`${GENERATED_JSON}`)}`)}`);
}

function validateJsonFile(data) {
  const v = new Validator();
  console.log(`   Getting json schema from ${colors.underline(JSON_SCHEMA)}`);
  try {
    const schema = fs.readFileSync(JSON_SCHEMA, 'utf8')
    return JSON.parse(schema)
  } catch(e) {
    console.log(
      `${colors.red.inverse(e)}`
    );
    process.exit(1)
  }

  console.log(v.validate(data, schema))

}

console.log(
  `${colors.inverse("Getting vigotech.json file")}`
);
let data = getMembersInfo()

console.log(
  `${colors.inverse("Validate vigotech.json file")}`
);
validateJsonFile(data);



console.log(
  `${colors.inverse("Preparing json files")}`
);
data = getNextEvents(data)
getMembersVideos(data)
  .then(data => {
    saveJsonFile(data)
  })
