const axios = require('axios');

async function getResponse(prompt) {
    const maxRetries = 5;
    let retries = 0;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    while (retries < maxRetries) {
        try {
            const response = await axios.post('https://api.openai.com/v1/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 50,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                retries += 1;
                const jitter = Math.random() * 1000; // Random delay to avoid synchronized retries
                const waitTime = retries ** 2 * 1000 + jitter;
                console.log(`Rate limit exceeded. Retrying in ${Math.round(waitTime / 1000)} seconds...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }
    throw new Error('Max retries reached. Please try again later.');
}
const handleChatRequest = async (req, res) => {
    try {
        const response = await getResponse(req.body.message);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error in chatbot:', error.message);
        res.status(500).json({ error: 'Sorry, we are experiencing issues. Please try again later.' });
    }
};

module.exports = { getResponse,handleChatRequest };
