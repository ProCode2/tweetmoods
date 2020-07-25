const Twitter = require('twitter');
require('dotenv').config();
const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const stopWord = require('stopword');

const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

//configuring twitter
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET
});

let result = {
  score: null,
  username: null,
  bio: null,
  dp: null,
  bg_color: null,
  text_color: null,
  err: null
};

const getScore = (tweet) => {
  let lexedTweet = aposToLexForm(tweet);
  let casedTweet = lexedTweet.toLowerCase();
  let alphaTweet = casedTweet.replace(/[^a-zA-Z\s]+/g, '');
  let tokenizedTweet = tokenizer.tokenize(alphaTweet);
  let filteredTweet = stopWord.removeStopwords(tokenizedTweet);
  return analyzer.getSentiment(filteredTweet);
}



//function to analyze the tweet sentiment
const analyzeSentiment = (username, res) => {
  let params = {
  screen_name: username,
  tweet_mode: 'extended',
  include_rts: false,
  count: 1,
  exclude_replies: true
  };


  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      result.score = getScore(tweets[0].full_text);
      result.username = tweets[0].user.name;
      result.bio = tweets[0].user.description;
      result.dp = tweets[0].user.profile_image_url;
      result.bg_color = tweets[0].user.profile_link_color;
      result.text_color = tweets[0].user.profile_text_color;
      res.json(result);
      } 
    else{
      res.json(error);
      }
  });
}

module.exports = analyzeSentiment;
