const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Create upload directories if they don't exist
const uploadDirs = ['src/uploads/medicine', 'src/uploads/medical'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

// Routes
app.use('/api/auth', require('./src/controllers/authController'));
app.use('/api/symptom', require('./src/controllers/symptomController'));
app.use('/api/medicine', require('./src/controllers/medicineController'));
app.use('/api/medical', require('./src/controllers/medicalController'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'MediAI Backend API is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
