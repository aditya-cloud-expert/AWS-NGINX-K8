// app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

// For local MongoDB, use this connection string format
// Replace your existing mongoURI with this
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB with improved error handling
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Add connection error handler
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Route to create a random user
app.post('/create-user', async (req, res) => {
  try {
    // Generate random username and email
    const randomString = Math.random().toString(36).substring(7);
    const newUser = new User({
      username: `user_${randomString}`,
      email: `${randomString}@example.com`
    });

    await newUser.save();
    res.json({ 
      message: 'User created successfully', 
      user: newUser 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ 
      users,
      count: users.length 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
});

app.get('/', (req, res) => {
    res.send('Hello From Mongo!');
})


app.listen(port, () => {

  console.log(`Server running at http://localhost:3000`);
});