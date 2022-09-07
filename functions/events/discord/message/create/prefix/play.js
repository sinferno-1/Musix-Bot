const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

let VOICE_CHANNEL = '1013064001271365646'; // Set this to the voice channel of your choice.
let message = context.params.event.content;

let searchString = message.split(' ').slice(1).join(' ');

try {
  let youtubeLink;
  if (!searchString) {
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `No search string provided!`,
    });
  }
  if (!searchString.includes('youtube.com')) {
    let results = await ytSearch(searchString);
    if (!results?.all?.length) {
      return lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: `No results found for your search string. Please try a different one.`,
      });
    }
    youtubeLink = results.all[0].url;
  } else {
    youtubeLink = searchString;
  }
  let downloadInfo = await ytdl.getInfo(youtubeLink);
  await lib.discord.voice['@0.0.1'].tracks.play({
    channel_id: `${VOICE_CHANNEL}`,
    guild_id: `${context.params.event.guild_id}`,
    download_info: downloadInfo
  });
  return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `Now playing **${downloadInfo.videoDetails.title}**`,
  });
} catch (e) {
  return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `Failed to play track!`,
  });
}