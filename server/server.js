const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: 'YOUR_API_KEY' });

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt){ res.status(400).json({ error: 'Prompt is required' });
  console.log("Prompt is required");
  return }

  const generatedPost = `Here's your post for: ${prompt}`;
  res.json({ generatedPost });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
