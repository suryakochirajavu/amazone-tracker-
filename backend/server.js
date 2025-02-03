const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to receive location data
app.post('/save-location', (req, res) => {
    const { latitude, longitude, snapshot } = req.body;
    console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);
    console.log(`Received snapshot: ${snapshot ? 'Captured' : 'No snapshot'}`);
    res.send('Location and snapshot received and saved.');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
