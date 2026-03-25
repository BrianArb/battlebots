const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Tell Express to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic route to serve the game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Battle Bots running at http://localhost:${PORT}`);
});
