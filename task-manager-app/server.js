const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());

// ✅ Serve static frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ API routes
app.use('/tasks', taskRoutes);

// ✅ MongoDB + server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => {
      console.log('🚀 Server running at http://localhost:5000');
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
