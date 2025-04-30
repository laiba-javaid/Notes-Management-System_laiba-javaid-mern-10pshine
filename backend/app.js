require('dotenv').config();
const config = require('./config.json');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


mongoose.connect(config.connectionString);

const User=require('./models/user.model');
const Note=require('./models/note.model');

const jwt = require('jsonwebtoken');
const {authenticateToken}=require("./utilities");
const app = express();
const bcrypt = require('bcrypt');


app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend!' });
})


//Backend Ready!!!

//Create Account
app.post('/create-account', async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  if (!fullName) {
    return res.status(400).json({ message: 'Full Name is required' });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.status(400).json({ 
      error: true,  
      message: 'User already exists' 
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userInfo = new User({
    fullName: fullName,
    password: hashedPassword,
    email: email,
  });

  await userInfo.save();

  const accessToken = jwt.sign(
    { userId: userInfo._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '3600m' }
  );

  return res.status(201).json({ 
    error: false,  // ✅ Boolean
    userInfo,
    accessToken,
    message: 'Registration Successful',
  });
});

//Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Find user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        error: 'true',
        message: 'User not found',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'true',
        message: 'Invalid Credentials',
      });
    }

    // If password matches, generate token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '3600m' }
    );

    return res.json({
      error: 'false',
      user: user,
      accessToken,
      message: 'Login Successful',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'true', message: 'Server Error' });
  }
});

//Get User Info
app.get('/get-user', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user; 
    
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ 
        error: 'true',
        message: 'User not found' 
      });
    } 
    
    return res.json({
      error: 'false',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email
      },
      message: 'User fetched successfully', 
    });
  } catch (err) {
    console.error('Error in /get-user:', err);
    return res.status(500).json({ 
      error: 'true',
      message: 'Internal server error' 
    });
  }
});


//Add Note
app.post('/add-note', authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.userId; 
  if(!title){
    return res.status(400).json({ message: 'Title is required' });
  }
  if(!content){
    return res.status(400).json({ message: 'Content is required' });
  }
  try{
    const note = new Note({
      title: title,
      content: content,
      tags: tags || [],
      userId: userId,
    });
    await note.save();

    return res.json({ 
      error:'false',
      note,
      message: 'Note added successfully',
    });
  }
  catch(err){
    return res.status(500).json({ 
      error:'true',
      message: 'Internal Server Error' });
  }
})

//Edit Note
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const userId = req.user.userId;

  if (!title && !content && !tags && isPinned === undefined) {
    return res.status(400).json({
      message: 'No Changes Provided, At least one field is required!',
    });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });

    if (!note) {
      return res.status(404).json({
        error: 'true',
        message: 'Note not found or unauthorized access',
      });
    }

    // Update fields if provided
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: 'false',
      note,
      message: 'Note updated successfully!',
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'true',
      message: 'Internal server error',
    });
  }
});


//Get All Notes
app.get('/get-all-notes', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const notes = await Note.find({ userId: userId }).sort({ isPinned: -1 });

    return res.json({
      error: 'false',
      notes: notes,
      message: 'All Notes fetched successfully',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'true',
      message: 'Internal Server Error',
    });
  }
});

//Delete Note
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.userId;

  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({
        error: 'true',
        message: 'Note not found',
      });
    }
    await Note.deleteOne({ _id: noteId, userId });
    return res.json({
      error: 'false',
      message: 'Note deleted successfully',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'true',
      message: 'Internal Server Error',
    });
  }
}
);

//Update isPinned status
app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const {isPinned } = req.body;
  const userId = req.user.userId;

  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({
        error: 'true',
        message: 'Note not found',
      });
    }
    note.isPinned = isPinned || false;

    await note.save();

    return res.json({
      error: 'false',
      note,
      message: 'Note updated successfully',
    });
  } catch (err) {
    console.error(err); // This helps debug on the server
    return res.status(500).json({
      error: 'true',
      message: 'Internal Server Error',
    });
  }
});

//Search Notes
app.get('/search-notes/', authenticateToken, async (req, res) => {
  // Access the userId directly from req.user
  const { userId } = req.user; // userId is directly available in req.user

  const { query } = req.query;

  if (!query) {
    console.error('Search query missing');
    return res.status(400).json({
      error: 'true',
      message: 'Search Query is required',
    });
  }

  try {
    console.log('Searching notes for user:', userId);
    
    // Searching notes by userId and query
    const matchingNotes = await Note.find({
      userId: userId, // No need for userId._id
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    });

    console.log('Search successful, found notes:', matchingNotes.length);
    return res.json({
      error: 'false',
      notes: matchingNotes,
      message: 'Search results fetched successfully',
    });
  } catch (error) {
    console.error('Error while searching notes:', error);
    return res.status(500).json({
      error: 'true',
      message: 'Internal Server Error',
    });
  }
});



app.listen(8000)
module.exports = app;