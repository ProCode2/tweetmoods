const Twitter = require('twitter');
require('dotenv').config();

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET
});
 
let params = {
	screen_name: 'ProCode1', 
	tweet_mode: 'extended',
	include_rts: false,
	count: 10
};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
	else{
		console.log(error);
	}
});


console.log(process.env.CONSUMER_KEY);
