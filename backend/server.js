const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Directory to store snapshots and locations
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// POST endpoint to save location and snapshot
app.post('/save-location', (req, res) => {
    const { latitude, longitude, snapshot } = req.body;

    // Create a timestamped file name
    const timestamp = Date.now();

    // Save location data
    const locationData = `Timestamp: ${new Date().toLocaleString()}\nLatitude: ${latitude}, Longitude: ${longitude}\n\n`;
    fs.appendFileSync(path.join(dataDir, 'locations.txt'), locationData);

    // Save the snapshot as a PNG image
    if (snapshot && snapshot.startsWith('data:image/png;base64,')) {
        const base64Data = snapshot.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync(path.join(dataDir, `snapshot_${timestamp}.png`), base64Data, 'base64');
    }

    console.log("Data saved successfully.");
    res.status(200).send('Location and snapshot saved.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
