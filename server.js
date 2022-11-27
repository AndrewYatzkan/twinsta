const express = require('express');
const app = express();
const port = 8080;
const { runCompletion } = require('./gpt3');
const { getUserId, getUserTweets } = require('./twitter');

app.use(express.json());
app.use(express.static('public'));

app.post('/get_tweets', async (req, res) => {
	let {handle} = req.body;
	if (!handle) return res.sendStatus(400);
	let userId = await getUserId(handle);
	if (!userId) return res.status(400).send({ error: 'User not found' });
	let tweets = await getUserTweets(userId, 100);
	if (tweets.length === 0) return res.status(400).send({ error: 'User has no tweets' });
	res.send({ tweets: tweets.map(t => t.text) });
});

app.post('/gen_completion', async (req, res) => {
	let {promptContext, userPrompt} = req.body;
	if (!userPrompt || !promptContext) return res.status(400).send({ error: 'Invalid request' });
	let handle = promptContext.match(/@(.*?):/)[1];
	let prompt = `${promptContext}\n\nQuestion for @${handle}: ${userPrompt.trim()}\n\n@${handle}:`;
	try {
		let output = await runCompletion(prompt);
		return res.send({ output });
	} catch(e) {
		return res.send({ error: e.message });
	}
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;