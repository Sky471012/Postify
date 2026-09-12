const express = require('express');
const cors = require('cors');
const AuthRoutes = require('./routes/Auth.routes.js');
const mongoose = require('mongoose');
const mongoDB = require("./db");
const userRoutes = require('./routes/CreateUser.js');
const User = require('./Models/User.js');
const prompt_template = require('./prompt.js');
require('dotenv').config();

const app = express();

app.use('/api/linkedin', AuthRoutes)

// Configure CORS to allow requests from Chrome extension
app.use(cors());

app.use(express.json());

// Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Postify backend running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'Postify backend is online' });
});

mongoDB();
app.use('/api/users', userRoutes);
app.get('/api/users/exists', async (req, res) => {
  const { name } = req.query;

  try {
    const user = await User.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (user) {
      return res.json({ exists: true, user });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      console.log("Error: Prompt is required");
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log("Received prompt:", prompt);
    
    generatedPost = await generateLinkedInPost(prompt);
    const formattedUnicode = await formatAsUnicode(generatedPost);
    generatedPost = formattedUnicode;
    res.json({
      generatedPost
    });

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
        model: "openai/gpt-oss-120b", 
        messages: [
          { role: "system", content: prompt_template },
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

const boldMap = {
  A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚',
  H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡',
  O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨',
  V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
  a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴',
  h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻',
  o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂',
  v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇'
};

const italicMap = {
  A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎',
  H: '𝘏', I: '𝘐', J: '𝘑', K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕',
  O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛', U: '𝘜',
  V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',
  a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨',
  h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯',
  o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶',
  v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻'
};

function formatAsUnicode(text) {
  return text
    // Bold (**text**)
    .replace(/\*\*(.*?)\*\*/g, (_, match) => match.split('').map(c => boldMap[c] || c).join(''))
    // Italic (*text*)
    .replace(/\*(.*?)\*/g, (_, match) => match.split('').map(c => italicMap[c] || c).join(''))
    // Bullet list (- item)
    // .replace(/^- (.*)$/gm, '• $1')
    // // Numbered list (1. item)
    // .replace(/^\d+\.\s(.*)$/gm, (_, item) => `• ${item}`);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} - http://localhost:${PORT}`));