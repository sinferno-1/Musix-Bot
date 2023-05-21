const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
const ytdl = require('ytdl-core');

const VOICE_CHANNEL = '1107286777028423781';

module.exports = async function (event) {
  
  let messages = await lib.discord.channels['@0.3.4'].messages.list({
    channel_id: event.channel_id,
    limit: 2
  });

  let lastMessage = messages[1].content;

  if (lastMessage.startsWith("Top 5 search results:")) {
    if (event.content === "-4") {
      // Extract the second YouTube URL from the last message
      let youtubeUrls = lastMessage.match(/https:\/\/youtube\.com\/watch\?v=[\w-]+/g);
      let secondYoutubeUrl = youtubeUrls[3];
  
      let downloadInfo = await ytdl.getInfo(secondYoutubeUrl);
      await lib.discord.voice['@0.0.1'].tracks.play({
        channel_id: `${VOICE_CHANNEL}`, // Replace this with the actual voice channel ID or a variable containing the voice channel ID
        guild_id: `${event.guild_id}`,// Replace with event.guild_id
        download_info: downloadInfo
      });
  
      return lib.discord.channels['@0.3.4'].messages.create({ // Update the version to 0.3.4
        channel_id: `${event.channel_id}`,
        content: `Now playing **${downloadInfo.videoDetails.title}**`,
      });
  
    }
  }

  return { statusCode: 200 };
};