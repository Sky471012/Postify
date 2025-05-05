const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Postify backend running'));
app.post('/api/generate', (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
       res.status(400).json({ error: 'Prompt is required1' });
       console.log("Prompt is required1");
       return
    }
  
    // Dummy response
    res.json({ generatedPost: `You said: ${prompt}` });
  });

const PORT = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI)
app.listen(PORT, () => console.log(`Server on port ${PORT}`))