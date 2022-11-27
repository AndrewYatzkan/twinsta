require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
console.log('OpenAI API configured');

async function runCompletion(prompt="Hello world", temperature=0.7, max_tokens=250) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt, temperature, max_tokens
    });
    const output = completion.data.choices.pop();
    return output.text;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { runCompletion };