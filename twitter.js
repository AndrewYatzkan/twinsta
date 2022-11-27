require('dotenv').config();

const { TwitterApi } = require('twitter-api-v2');
const {encode} = require('gpt-3-encoder')


const twitterClient = new TwitterApi({
	appKey: process.env.CONSUMER_KEY,
	appSecret: process.env.CONSUMER_SECRET,
	accessToken: process.env.ACCESS_TOKEN,
	accessSecret: process.env.ACCESS_TOKEN_SECRET
});

const readOnlyClient = twitterClient.readOnly;

async function getUserId(handle) {
	const user = await readOnlyClient.v2.userByUsername(handle);
	return user?.data?.id;
}

async function getUserTweets(userId, maxN=10) {
	let tweets = [];

	let timeline = {
		done: false,
		fetchNext: async () => timeline = await readOnlyClient.v2.userTimeline(userId, { exclude: ['replies', 'retweets'] })
	};

	let shouldBreak = false;
	while (!timeline.done) {
		await timeline.fetchNext();
		for (const tweet of timeline) {
			let nTokens = tokenCount(tweets.concat(tweet));
			if (nTokens > 4000) {
				shouldBreak = true;
				break;
			}
			tweets.push(tweet);
		}
		if (shouldBreak || tweets.length >= maxN) break;
	}

	return tweets;
}

// refactor this to be more precise
function tokenCount(tweets) {
	let userPromptTokens = 280; // upper cap of max 280 chars input
	let maxResponseTokens = 250;
	let handle = '1a2e8j1s2o1sxmq'; // maximum twitter handle length & uses 15 tokens
	let promptContext = tweets.map(t => `@${handle}: ${t.text.replace(/\s+/g, ' ').trim()}`).join('\n');
	let str = `${promptContext}\n\nQuestion for @${handle}: \n\n@${handle}:`;
	return userPromptTokens + maxResponseTokens + encode(str).length;
}

module.exports = { getUserId, getUserTweets };