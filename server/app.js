const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Postify backend running'));

app.post('/api/generate', (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    console.log("Prompt is required");
    return;
  }

  // For testing purposes
  const generatedPost = `Here's your LinkedIn post based on: "${prompt}"\n\n` +
    `🚀 Exciting news! ${prompt}\n\n` +
    `What are your thoughts on this? Let me know in the comments below! #LinkedIn #Professional`;
  
  res.json({ generatedPost });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));