const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const mongoDB = require("../db");

router.post('/create', async (req, res) => {
  try {
    const { name, post } = req.body;
    const newUser = new User({ name, post: post ? [{ content: post }] : [] });
    await newUser.save();
    res.status(201).json({ message: 'User created.'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

router.post('/add-post', async (req, res) => {
  try {
    const { name, post } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { name },
      { $push: { post: { content: post } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Post added.'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add post.' });
  }
});

module.exports = router;