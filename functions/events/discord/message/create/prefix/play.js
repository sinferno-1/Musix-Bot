const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

let VOICE_CHANNEL = '1107286777028423781'; // Set this to the voice channel of your choice.
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

    // Create a string containing the top 5 search results
    let topResults = '';
    for (let i = 0; i < 5 && i < results.all.length; i++) {
      topResults += `**${i+1}. **   **${results.all[i].title}** - ${results.all[i].url}\n`;
    }

    // Send the top 5 search results in a Discord message
    return lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `Top 5 search results:\n${topResults}`,
    });
  } else {
    youtubeLink = searchString;
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
  }
} catch (e) {
  return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `Failed to play track!`,
  });
}