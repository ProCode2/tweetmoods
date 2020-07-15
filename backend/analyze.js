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

let results = {
  anlz: undefined,
  err: undefined
}

//function to analyze the tweet sentiment
const analyzeSentiment = (username) => {
  let params = {
  screen_name: username,
  tweet_mode: 'extended',
  include_rts: false,
  count: 1,
  exclude_replies: true
  };


  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      let tweet = tweets[0].full_text;
      let lexedTweet = aposToLexForm(tweet);
      let casedTweet = lexedTweet.toLowerCase();
      let alphaTweet = casedTweet.replace(/[^a-zA-Z\s]+/g, '');
      let tokenizedTweet = tokenizer.tokenize(alphaTweet);
      let filteredTweet = stopWord.removeStopwords(tokenizedTweet);
      results.anlz = analyzer.getSentiment(filteredTweet);
      } 
    else{
      results.err = error;
      }
  });
  if(results.anlz){
    return results;
  }
}

module.exports = analyzeSentiment;
