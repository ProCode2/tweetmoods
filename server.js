const express = require('express');
const analyze = require('./analyze.js');
const cors = require('cors');

const app = express();

app.use('/', express.static('frontend'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


app.get('/:username', (req, res) => {
	let { username } = req.params;
	analyze(username, res);
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening'));
