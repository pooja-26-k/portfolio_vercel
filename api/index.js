const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
   // *******************MIDDLEWARE
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB CONNECTION (CACHED)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    }).then((mongoose) => {
      console.log('MongoDB Connected!');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
   // *******************MODELS
const stringSchema = new mongoose.Schema({
  intro: String,
  skills: String,
  hobbies: String
}, { collection: 'strings' });

const StringData = mongoose.model('StringData', stringSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  status: { type: String, default: 'unread' },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// *******************Routing
// Home
app.get('/', async (req, res) => {
  try {
    await connectDB();

    const data = await StringData.findOne();
    res.render('index', { ej_data: data });

  } catch (err) {
    console.log('Error loading home:', err);
    res.status(500).send('Server Error');
  }
});

// Test route
app.get('/test', (req, res) => {
  res.send('TEST WORKS');
});

// Admin page
app.get('/admin', async (req, res) => {
  try {
    await connectDB();

    const messages = await Contact.find().sort({ createdAt: -1 });
    res.render('admin', { messages });

  } catch (err) {
    console.log('Error loading admin:', err);
    res.status(500).send('Error loading admin page');
  }
});

// Submit contact form
app.post('/contact/submit', async (req, res) => {
  try {
    await connectDB();

    const { name, email, message } = req.body;

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.log('Error saving message:', err);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

// Update message
app.post('/contact/update/:id', async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { name, email, message, status } = req.body;

    await Contact.findByIdAndUpdate(
      id,
      { name, email, message, status },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Status updated!' });

  } catch (err) {
    console.log('Error updating:', err);
    res.status(500).json({ success: false, message: 'Error updating message' });
  }
});

// Delete message
app.delete('/contact/delete/:id', async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    await Contact.findByIdAndDelete(id);

    res.json({ success: true, message: 'Message deleted!' });

  } catch (err) {
    console.log('Error deleting:', err);
    res.status(500).json({ success: false, message: 'Error deleting message' });
  }
});

module.exports = app;
