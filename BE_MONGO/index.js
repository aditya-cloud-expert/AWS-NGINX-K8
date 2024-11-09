const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return client.db();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

app.get('/users', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});