// //Before adding setservers it does not get connected to mongodb due to dns issue
// const { setServers } = require('dns/promises');
// setServers(['1.1.1.1', '8.8.8.8']);
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const rootDir = process.cwd();
require('dotenv').config();
app.set('views', path.join(rootDir, 'views'));
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(rootDir, 'public')));
// app.set('views', path.join(__dirname, '../views'));
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use((req, res, next) => {
  console.log('Incoming request:', req.url);
  next();
});
// app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.log('Connection error:', err));

// Schema for getting data from db
const stringSchema = new mongoose.Schema({
    intro: String,
    skills: String,
    hobbies: String
}, { collection: 'strings' }); // collection/table name

const StringData = mongoose.model('StringData', stringSchema);

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    status: { type: String, default: 'unread' },
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/', (req, res) => {
  res.send('WORKING');
});
// app.get('/', async (req, res) => {
//     const data = await StringData.findOne(); // Get data from db
//     res.render('index', { ej_data: data });     // ej_data Send data to EJS
// });

// CREATE - Submit contact form
app.post('/contact/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        const newContact = new Contact({
            name: name,
            email: email,
            message: message
        });
        
        await newContact.save();
        console.log('New message saved:', newContact);
        
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.log('Error saving message:', err.message);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});


// Route to display the admin page
app.get('/admin', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 }); // Newest first
        res.render('admin', { messages: messages });
    } catch (err) {
        console.log('Error:', err.message);
        res.status(500).send('Error loading admin page');
    }
});

// UPDATE - Change message status
app.post('/contact/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, message, status } = req.body;
        console.log("values are",req.body)
        
        await Contact.findByIdAndUpdate(id,
             { name, email, message, status }, 
            { new: true, runValidators: true });
        console.log('Message updated:', id);
        
        res.json({ success: true, message: 'Status updated!' });
    } catch (err) {
        console.log('Error updating:', err.message);
        res.status(500).json({ success: false, message: 'Error updating message' });
    }
});

// DELETE - Remove a message
app.delete('/contact/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        await Contact.findByIdAndDelete(id);
        console.log('Message deleted:', id);
        
        res.json({ success: true, message: 'Message deleted!' });
    } catch (err) {
        console.log('Error deleting:', err.message);
        res.status(500).json({ success: false, message: 'Error deleting message' });
    }
});

app.get('/test', (req, res) => {
  res.send('TEST WORKS');
});
module.exports = app;
