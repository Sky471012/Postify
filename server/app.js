const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS to allow requests from Chrome extension
app.use(cors({
  origin: '*', // During development, you can use * but tighten this for production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Postify backend running' });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      console.log("Error: Prompt is required");
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log("Received prompt:", prompt);
    
    const generatedPost = await generateLinkedInPost(prompt);
    res.json({ generatedPost });
  } catch (error) {
    console.error("Error in /api/generate:", error.message);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

async function generateLinkedInPost(prompt) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing. Please check your .env file.");
  }
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // or llama3-8b-8192 for faster results
        messages: [
          { role: "system", content: "You are a professional LinkedIn content creator." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid GROQ response structure");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} - http://localhost:${PORT}`));