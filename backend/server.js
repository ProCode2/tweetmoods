const express = require('express');
const Twitter = require('twitter');
require('dotenv').config();
const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const stopWord = require('stopword');

const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET
});

const analyzeSentiment = (username) => {
let anlz = [];
let params = {
	screen_name: username,
	tweet_mode: 'extended',
	include_rts: false,
	count: 2,
	exclude_replies: true
};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
	tweets.forEach((tweet) => {
	  let lexedTweet = aposToLexForm(tweet.full_text);
	  let casedTweet = lexedTweet.toLowerCase();
	  let alphaTweet = casedTweet.replace(/[^a-zA-Z\s]+/g, '');
	  let tokenizedTweet = tokenizer.tokenize(alphaTweet);
	  tokenizedTweet.forEach((word, index) => {
		  tokenizedTweet[index] = spellCorrector.correct(word);
	  });
	  let filteredTweet = stopWord.removeStopwords(tokenizedTweet);
	  let analysis = analyzer.getSentiment(filteredTweet);
          console.log(analysis);
	  anlz.push(analysis);
	})
	  return anlz;
  }
  else{
      console.log(err);
      return err;
  }
});
}

app.get("/:username", async (req, res) => {
        let { username } = req.params;
	let a = await analyzeSentiment(username);
	res.send(a);
})

app.listen(3000, () => console.log('listening'));
