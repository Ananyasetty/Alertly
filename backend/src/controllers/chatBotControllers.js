const { getResponse } = require('../services/chatbot');

async function handleChatRequest(req, res) {
    const userPrompt = req.body.prompt; // Assuming prompt is sent in the request body
    console.log(req.body.prompt);
    const botResponse = await getResponse(userPrompt);
    res.json({ response: botResponse });
}

module.exports = { handleChatRequest };
