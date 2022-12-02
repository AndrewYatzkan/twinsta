# twinsta

site: [twinsta.vercel.app](https://twinsta.vercel.app/)

chrome extension: [twinsta](https://chrome.google.com/webstore/detail/twinsta/imodnpdkmjccjjeeagjijoadnfhfngaa)

## potential improvements
### GPT-3
- [ ] Make `tokenCount` function precise and verify that results are congruent with the [OpenAI Tokenizer](https://beta.openai.com/tokenizer) (good first PR)
- [ ] Include Twitter user's bio in prompt
- [ ] Improve tweet selection (currently uses most recent tweets, excluding replies and retweets)
  - [ ] Search for tweets including keywords in user's question
  - [ ] Incorporate Twitter user's following list, likes, etc.
- [ ] Re-generate or modify prompt if output is an exact Tweet, which tends to happen
- [ ] Fine-tune models for high-demand Twitter users?
  - [ ] Allows training from questions & answers
    - May not be worth it otherwise since only half of the content is from the Twitter user (should still try though)
  - [ ] Paid version for fine-tuning anyone?
### UI
- [ ] Validate Twitter user exists & visually indicate before sending request (good first PR)
  - Involves creating a user-validation endpoint
- [ ] Filter timeline embed to only display tweets that were used in the prompt
- [ ] Make input look like Twitter's tweet composition box, and output look like tweet reply
- [ ] Progress bar
### Other
- [ ] Ability to pass OpenAI API key to `/gen_completion` endpoint
  - That way Twinsta chrome extension users can use their own API key (currently using mine)
  - *Convenient that chrome extension can use the same backend, but potential security concerns with passing in API keys
- [ ] Chat functionality
  - [ ] Use prompt chaining to orchestrate a conversation between multiple Twitter accounts (user can choose to chime in)
- [ ] Deal with Twitter rate-limiting
- [ ] Implement rate-limiting and/or queue so I don't get a hefty bill from OpenAI
- [ ] Ability to easily share insightful or funny responses (could be a tweet button)
