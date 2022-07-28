// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// `context` is automatically populated with HTTP request data
// you can modify `context.params` test data via [Payload] below
let MEME_MUSEUM_CHANNEL_ID = '1001990307740659872';

// determines how many reacts a message has
// TODO: exclude the poster's reacts? ADAM SPAM FILTER
function create_reaction_index(reaction_arr) {
  if (reaction_arr == null) {
    return 0;
  }
  var total = 0;
  for (i = 0; i < reaction_arr.length; i++) {
    total = total + reaction_arr[i].count;
  } 
  return total;
}

// returns a randomly selected meme from an array of the discord messages with the most reactions
// TODO: filter out non-embeded content
function return_most_reacted(list_messages_response) {
  var default_msg = list_messages_response[0];
  var most_reacted = [default_msg];
  var most_reacted_count = create_reaction_index(default_msg.reactions);
  for (i = 1; i < list_messages_response.length; i++) {
    var current_msg = list_messages_response[i];
    var current_msg_count = create_reaction_index(current_msg.reactions);
    if(current_msg_count > most_reacted_count) {
      most_reacted = [current_msg];
      most_reacted_count = current_msg_count;
    } else if (current_msg_count  == most_reacted_count) {
      most_reacted.push(current_msg);
    }
  }
  console.log('The most reacted messages had ' + most_reacted_count + " reactions. There were " + most_reacted.length + " such messages.");
  return most_reacted[Math.floor(Math.random()*most_reacted.length)];
}

let message_list = await lib.discord.channels['@0.3.0'].messages.list({
  channel_id: MEME_MUSEUM_CHANNEL_ID,
  before: context.params.event.id,
  limit: 100
});
var top_meme = return_most_reacted(message_list);

await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: MEME_MUSEUM_CHANNEL_ID,
  content: 'The Meme of the Week, brought to you by ' + top_meme.author.username + ': ' + top_meme.content,
  embeds: top_meme.embeds
});
await lib.discord.channels['@0.3.0'].pins.create({
  channel_id: MEME_MUSEUM_CHANNEL_ID,
  message_id: top_meme.id,
})

