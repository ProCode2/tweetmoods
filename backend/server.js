const express = require('express');
const analyze = require('./analyze.js');

const app = express();
app.use(express.json());

app.get('/:username', (req, res) => {
	let { username } = req.params;
	let a = analyze(username);
	res.json(a);
})

app.listen(3000, () => console.log('listening'));
