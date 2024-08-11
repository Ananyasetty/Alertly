require('./src/db/mongoose');
const path = require('path'); // For handling file paths
const multer = require('multer');
const cors = require('cors');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Load environment variables from .env file
require('dotenv').config(); // Automatically looks for .env file in the root
const port = process.env.PORT || 10000; // Fallback to 10000 if PORT is not set

app.use(express.json());

// CORS configuration
const allowedDomains = ["http://localhost:3000", "https://your-production-domain.com"];
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedDomains.indexOf(origin) === -1) {
            let msg = `This site ${origin} does not have access. Only specific domains are allowed.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Import and use resource routes
const resourceRoutes = require('./src/routes/resourceAllocatorRoutes');
app.use('/api/', resourceRoutes);

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const postRoutes = require('./src/routes/posts');
app.use('/api/post', postRoutes);

const chatbotRoutes = require('./src/routes/chatBotRoute');
app.use('/api', chatbotRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle 404 errors for API routes
app.all("/*", (req, res) => {
    res.status(404).send("Page not found");
});

// Start the server
app.listen(port, () => {
    console.log("Server running on port ", port);
});
