# Portfolio Website with Node.js, MongoDB, and EJS

## 📚 Complete Guide for College Students

---

## Table of Contents
1. [What This Project Does](#what-this-project-does)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [How It Works](#how-it-works)
6. [Common Issues & Fixes](#common-issues--fixes)
7. [Code Explanation](#code-explanation)

---

## What This Project Does

This is a dynamic portfolio website that:
- Displays your personal information (intro, skills, hobbies)
- Fetches data from MongoDB database
- Updates automatically when you change data in MongoDB
- Uses EJS templates to render HTML with database data

**Simple Flow:**
```
MongoDB (stores your data) 
    ↓
Node.js Server (fetches data)
    ↓
EJS Template (displays data)
    ↓
Your Browser (shows the website)
```

---

## Technologies Used

| Technology | What It Does | Why We Use It |
|------------|--------------|---------------|
| **Node.js** | JavaScript runtime | Runs JavaScript on the server |
| **Express** | Web framework | Makes creating servers easy |
| **MongoDB** | Database | Stores your portfolio data |
| **Mongoose** | MongoDB library | Connects Node.js to MongoDB easily |
| **EJS** | Template engine | Mixes HTML with JavaScript to show dynamic data |
| **HTML/CSS** | Frontend | Creates the look of your website |

---

## Project Structure

```
my-website/
├── server.js              # Main server file (backend)
├── package.json           # Project dependencies
├── .env                   # Secret credentials (never share!)
├── .gitignore            # Files to ignore in GitHub
├── node_modules/         # Installed packages (auto-generated)
│
├── public/               # Static files (CSS, JS, images)
│   ├── css.css          # Your styles
│   ├── js.js            # Your JavaScript
│   └── images/          # Your images
│       ├── cloud.png
│       ├── mountain.png
│       └── profile.png
│
└── views/                # EJS templates
    └── index.ejs        # Main page template
```

---

## Setup Instructions

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS version
3. Install it (keep clicking Next)
4. Verify: Open terminal and type `node --version`

### Step 2: Create Project Folder
```bash
mkdir my-website
cd my-website
```

### Step 3: Initialize Project
```bash
npm init -y
```
This creates `package.json` file

### Step 4: Install Required Packages
```bash
npm install express mongoose ejs dotenv
```

**What each package does:**
- `express` → Creates the web server
- `mongoose` → Connects to MongoDB
- `ejs` → Template engine for dynamic HTML
- `dotenv` → Loads secret credentials safely

### Step 5: Create MongoDB Atlas Account
1. Go to https://mongodb.com/atlas
2. Sign up for free
3. Create a cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Step 6: Create `.env` File
Create a file named `.env` in your project root:
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/port
PORT=3000
```
Replace `username`, `password`, and cluster URL with yours!

### Step 7: Create `.gitignore` File
```
node_modules
.env
```
This prevents secrets from going to GitHub!

### Step 8: Create Folders
```bash
mkdir public
mkdir views
mkdir public/images
```

### Step 9: Add Your Files
- Put `server.js` in root folder
- Put `index.ejs` in `views/` folder
- Put `css.css`, `js.js` in `public/` folder
- Put images in `public/images/` folder

### Step 10: Fix DNS Issue (Important!)
Add this to the very top of `server.js`:
```javascript
const { setServers } = require('dns/promises');
setServers(['1.1.1.1', '8.8.8.8']);
```

### Step 11: Run the Server
```bash
node server.js
```

Open browser: `http://localhost:3000`

---

## How It Works

### 1. Server Starts (`server.js`)
```javascript
// Load environment variables
require('dotenv').config();

// Import packages
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Tell Express to use EJS
app.set('view engine', 'ejs');
```

### 2. Connect to MongoDB
```javascript
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.log('Error:', err));
```

### 3. Define Data Structure (Schema)
```javascript
const stringSchema = new mongoose.Schema({
    intro: String,
    skills: String,
    hobbies: String
}, { collection: 'string' });

const StringData = mongoose.model('StringData', stringSchema);
```
**Schema = Blueprint of your data**

### 4. Create Route (URL Handler)
```javascript
app.get('/', async (req, res) => {
    // Fetch data from MongoDB
    const data = await StringData.findOne();
    
    // Send data to EJS template
    res.render('index', { data: data });
});
```

**What happens:**
1. User visits `localhost:3000`
2. Server fetches data from MongoDB
3. Server sends data to `index.ejs`
4. EJS creates HTML with the data
5. Browser displays the page

### 5. EJS Template Uses Data
```html
<!-- In index.ejs -->
<h1><%= data.intro %></h1>
<p><%= data.skills %></p>
<p><%= data.hobbies %></p>
```

**EJS Tags:**
| Tag | What It Does | Example |
|-----|--------------|---------|
| `<%= %>` | Display a value | `<%= data.intro %>` |
| `<% %>` | Run JavaScript | `<% if (data) { %>` |
| `<%- %>` | Display HTML | `<%- htmlContent %>` |

---

## Common Issues & Fixes

### Issue 1: `npm` command not found
**Fix:** Install Node.js and restart terminal

### Issue 2: Cannot load scripts in PowerShell
**Fix:** Run PowerShell as Admin:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: MongoDB timeout error
**Fix:** Add DNS fix at top of `server.js`:
```javascript
const { setServers } = require('dns/promises');
setServers(['1.1.1.1', '8.8.8.8']);
```

### Issue 4: Images not showing
**Fix:** 
- Images must be in `public/images/` folder
- Use `src="images/cloud.png"` (no `../` or `/`)
- Restart server after moving images

### Issue 5: Data showing as `null` or `undefined`
**Fixes:**
1. Check MongoDB connection string includes database name:
   ```
   .../mongodb.net/port?appName=...
   //               ↑ database name
   ```

2. Check schema field names match MongoDB exactly:
   ```javascript
   // If MongoDB has "intro", schema must have "intro"
   // NOT "Intro" or "introduction"
   ```

3. Check collection name is correct:
   ```javascript
   { collection: 'string' } // Must match exactly!
   ```

### Issue 6: Still using old `index.html`
**Fix:** Delete `index.html` from `public/` folder. Only keep `index.ejs` in `views/` folder.

---

## Code Explanation

### Complete `server.js` Explained

```javascript
// 1. FIX DNS ISSUES (must be first!)
const { setServers } = require('dns/promises');
setServers(['1.1.1.1', '8.8.8.8']);

// 2. LOAD ENVIRONMENT VARIABLES
require('dotenv').config();

// 3. IMPORT PACKAGES
const express = require('express');      // Web server
const mongoose = require('mongoose');    // MongoDB connection
const path = require('path');           // File paths
const app = express();                  // Create Express app

// 4. CONFIGURE EJS
app.set('view engine', 'ejs');                    // Use EJS
app.set('views', path.join(__dirname, 'views'));  // Templates in views/

// 5. SERVE STATIC FILES (CSS, JS, images)
app.use(express.static('public'));

// 6. CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000  // Timeout after 5 seconds
})
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.log('Connection error:', err.message));

// 7. DEFINE DATA SCHEMA (structure)
const stringSchema = new mongoose.Schema({
    intro: String,
    skills: String,
    hobbies: String
}, { collection: 'string' });  // Collection name in MongoDB

// 8. CREATE MODEL (interface to database)
const StringData = mongoose.model('StringData', stringSchema);

// 9. CREATE ROUTE (what happens when user visits /)
app.get('/', async (req, res) => {
    try {
        // Fetch ONE document from MongoDB
        const data = await StringData.findOne();
        
        // Log for debugging
        console.log('Data fetched:', data);
        
        // Send to EJS template
        res.render('index', { data: data });
    } catch (err) {
        console.log('Error:', err.message);
        res.status(500).send('Error loading page');
    }
});

// 10. START SERVER
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

### Complete `index.ejs` Explained

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><%= data ? data.intro : 'Portfolio' %></title>
    <!-- 
        <%= data ? data.intro : 'Portfolio' %>
        If data exists, show data.intro
        Otherwise show 'Portfolio'
    -->
    <link rel="stylesheet" href="css.css">
</head>
<body>
    <!-- DISPLAY INTRO FROM DATABASE -->
    <h1><%= data ? data.intro : 'Welcome' %></h1>
    
    <!-- DISPLAY SKILLS FROM DATABASE -->
    <div class="skills">
        <h2>My Skills</h2>
        <p><%= data ? data.skills : 'Loading...' %></p>
    </div>
    
    <!-- DISPLAY HOBBIES FROM DATABASE -->
    <div class="hobbies">
        <h2>Hobbies</h2>
        <p><%= data ? data.hobbies : 'Loading...' %></p>
    </div>
    
    <script src="js.js"></script>
</body>
</html>
```

---

## MongoDB Operations

### View Data in Atlas
1. Login to MongoDB Atlas
2. Click "Browse Collections"
3. Select your database (port)
4. Select your collection (string)
5. See your documents

### Add Data Manually
1. In Atlas, click "Insert Document"
2. Type:
```json
{
  "intro": "Hi, I'm a developer",
  "skills": "HTML, CSS, JavaScript",
  "hobbies": "Coding and gaming"
}
```
3. Click Insert

### Update Data
1. Click the pencil icon on your document
2. Edit the values
3. Click Update

---

## Important Concepts

### What is a Schema?
A **blueprint** that defines what fields your data should have.

```javascript
// This says: My data has 3 text fields
const schema = new mongoose.Schema({
    intro: String,
    skills: String,
    hobbies: String
});
```

### What is a Model?
An **interface** to interact with the database.

```javascript
const Model = mongoose.model('Name', schema);

// Now you can:
Model.find()      // Get all documents
Model.findOne()   // Get one document
Model.create()    // Add new document
Model.updateOne() // Update document
Model.deleteOne() // Delete document
```

### What is Async/Await?
Way to handle operations that take time (like database queries).

```javascript
// WITHOUT async/await (old way)
StringData.findOne().then(data => {
    console.log(data);
});

// WITH async/await (modern way)
const data = await StringData.findOne();
console.log(data);
```

### What is a Route?
Code that runs when user visits a specific URL.

```javascript
app.get('/', ...)        // localhost:3000/
app.get('/about', ...)   // localhost:3000/about
app.post('/submit', ...) // Form submission
```

---

## Next Steps

### Add More Features
1. **Contact Form** - Let visitors send you messages
2. **Projects Section** - Show your projects dynamically
3. **Admin Panel** - Edit data without going to Atlas
4. **User Authentication** - Login/signup functionality

### Deploy Your Website
**Free hosting options:**
- Render.com
- Railway.app
- Vercel.com
- Heroku.com

### Learn More
- Express: https://expressjs.com/
- MongoDB: https://www.mongodb.com/docs/
- EJS: https://ejs.co/
- Node.js: https://nodejs.org/docs/

---

## Quick Reference

### Start Server
```bash
node server.js
```

### Stop Server
Press `Ctrl + C` in terminal

### Install Package
```bash
npm install package-name
```

### Check if Running
Open browser: `http://localhost:3000`

### View Logs
Look at terminal where server is running

### Restart After Changes
1. Stop server (Ctrl + C)
2. Start again (`node server.js`)

---

## Questions to Ask If Stuck

1. Did you install all packages? (`npm install`)
2. Is MongoDB cluster running in Atlas?
3. Is `.env` file correct with connection string?
4. Did you add DNS fix at top of server.js?
5. Are field names in schema matching MongoDB exactly?
6. Did you restart server after changes?
7. Did you check browser console for errors? (F12)
8. Did you check terminal for error messages?

---

## Summary

**What You Built:**
- A dynamic portfolio website
- Connected to cloud database (MongoDB Atlas)
- Using modern web technologies
- Professional project for your resume!

**Skills You Learned:**
- Backend development (Node.js, Express)
- Database management (MongoDB, Mongoose)
- Template engines (EJS)
- Environment variables (.env)
- Git ignore patterns
- Debugging

**Keep practicing and building! 🚀**

---

*Made for college students learning web development*
*Feel free to customize and expand this project!*
