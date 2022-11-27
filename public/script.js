let btn = document.querySelector('.generate-button');
let handleBox = document.querySelector('.handle');
let promptBox = document.querySelector('.prompt-box:not(.handle)');
let outputBox = document.querySelector('.output');
let outputContent = outputBox.querySelector('p');
let isLoading = false;

btn.onclick = async () => {
    if (isLoading) return;
    let handle = await validateHandle(handleBox.value);
    if (!handle) return; // invalid handle
    let userPrompt = promptBox.value;

    toggleLoad();
    let output = await generateOutput(handle, userPrompt);
    if (output[0]) {
        output = output[0];
        setTimeline(handle);
    } else {
        output = `ERROR: ${output[1]}`
    }
    outputBox.style.display = 'flex';
    outputContent.innerText = output;
    toggleLoad();
}

function setTimeline(handle) {
    let timeline = document.querySelector('.timeline');
    timeline.innerHTML = `<a class="twitter-timeline" data-dnt="true" data-theme="dark" href="https://twitter.com/${handle}?ref_src=twsrc%5Etfw">Tweets by ${handle}</a>`;
    timeline.style.display = 'block';
    twttr.widgets.load(timeline);
}

// returns [result, error]
async function generateOutput(handle, userPrompt) {
    try {
        let promptContext = await getPromptContext(handle);
        let req = await fetch('/gen_completion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promptContext, userPrompt })
        });
        let {error, output} = await req.json();
        if (error) throw new Error(error);
        return [output, false];
    } catch (e) {
        // TODO
        return [false, e.message];
    }
}

function toggleLoad() {
    isLoading ^= 1;
    btn.children[0].innerHTML = isLoading ? `<span class="loader"></span>` : `<p>Generate</p>`;
    btn.classList[isLoading ? 'add' : 'remove']('loading');
}

async function getPromptContext(handle) {
    let req = await fetch('/get_tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle })
    });
    let {error, tweets} = await req.json();
    if (error) throw new Error(error);
    return tweets.map(t => `@${handle}: ${t.replace(/\s+/g, ' ').trim()}`).join('\n');
}

// parse and validate handle
async function validateHandle(handle) {
    // TODO validation
    return handle.trim().replace(/@/g, '');
}