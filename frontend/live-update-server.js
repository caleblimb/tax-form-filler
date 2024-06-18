const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001; // Choose an appropriate port

app.use(cors()); // Enable CORS
app.use(express.json());

app.post('/edit-file', (req, res) => {
    const { content } = req.body;

    const filePath = path.join(__dirname, 'src/data-entry-monolith/DataEntryMonolith.tsx');

    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error writing file', error: err });
        }
        res.status(200).json({ message: 'File written successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});