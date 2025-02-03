const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/save-location', (req, res) => {
    const { latitude, longitude, snapshot } = req.body;
    console.log('Received Data: ', latitude, longitude);

    // Save data to a file (for testing purposes)
    fs.appendFileSync(path.join(__dirname, 'locations.json'), JSON.stringify({
        timestamp: new Date(),
        latitude,
        longitude,
        snapshot
    }, null, 2) + ',\n');

    res.status(200).send('Data received successfully');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
