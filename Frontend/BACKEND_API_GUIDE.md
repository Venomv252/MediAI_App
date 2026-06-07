# Backend API Integration Guide

## Overview
This document describes the API endpoints that the frontend expects for authentication.

## Base URL
```
http://localhost:5000/api/auth
```

## Endpoints

### 1. User Signup
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## Medicine Checker API

### 3. Analyze Medicine Image
**Endpoint:** `POST /api/medicine/analyze`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
medicineImage: <image_file>
```

**Success Response (200):**
```json
{
  "success": true,
  "medicineName": "Paracetamol 500mg",
  "genericName": "Acetaminophen",
  "uses": "Pain relief and fever reduction",
  "dosage": "Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours",
  "sideEffects": "Rare: nausea, rash, allergic reactions",
  "warnings": "Do not exceed recommended dose. Avoid alcohol. Consult doctor if pregnant or breastfeeding."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No image file provided"
}
```

---

## Medical Analysis API

### 4. Analyze Medical Data
**Endpoint:** `POST /api/medical/analyze`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
medicalFile: <image_or_document_file> (optional)
textData: <string> (optional)
```

**Success Response (200):**
```json
{
  "success": true,
  "findings": "Chest X-ray shows clear lung fields with no signs of infection or abnormality",
  "diagnosis": "Normal chest X-ray",
  "recommendations": "No immediate action required. Continue regular health monitoring.",
  "severity": "low",
  "nextSteps": "Schedule routine follow-up in 6 months"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No file or text data provided"
}
```

---

## Symptom Checker API

### 5. Check Symptoms
**Endpoint:** `POST /api/symptom/check`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "symptoms": "fever, headache, cough",
  "duration": "3-7 days",
  "severity": 7,
  "existingCondition": "diabetes",
  "age": 35
}
```

**Success Response (200):**
```json
{
  "success": true,
  "diagnosis": "Possible viral infection or flu",
  "recommendations": "Rest, stay hydrated, monitor temperature. Consult a doctor if symptoms worsen.",
  "urgency": "medium",
  "possibleConditions": [
    "Common Cold",
    "Influenza",
    "COVID-19"
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token"
}
```

---

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Sample Backend Implementation (Node.js/Express)

### Install Dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

### Sample Code Structure

#### `server.js`
```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### `models/User.js`
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

#### `routes/auth.js`
```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### `routes/symptom.js`
```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Symptom Check (Protected Route)
router.post('/check', auth, async (req, res) => {
  try {
    const { symptoms, duration, severity, existingCondition, age } = req.body;

    // Validation
    if (!symptoms || !duration || !severity || !age) {
      return res.status(400).json({ 
        message: 'Missing required fields: symptoms, duration, severity, and age are required' 
      });
    }

    // Here you would integrate with your AI/ML model or medical API
    // For now, we'll return a mock response based on severity
    
    let diagnosis = '';
    let recommendations = '';
    let urgency = 'low';
    let possibleConditions = [];

    // Simple logic based on severity (replace with actual AI logic)
    if (severity >= 8) {
      urgency = 'high';
      diagnosis = 'Severe symptoms detected. Immediate medical attention recommended.';
      recommendations = 'Visit emergency room or call emergency services immediately.';
      possibleConditions = ['Acute condition requiring immediate care'];
    } else if (severity >= 5) {
      urgency = 'medium';
      diagnosis = 'Moderate symptoms that should be evaluated by a healthcare professional.';
      recommendations = 'Schedule an appointment with your doctor within 24-48 hours. Monitor symptoms closely.';
      possibleConditions = ['Common viral infection', 'Bacterial infection', 'Allergic reaction'];
    } else {
      urgency = 'low';
      diagnosis = 'Mild symptoms that may resolve on their own.';
      recommendations = 'Rest, stay hydrated, and monitor symptoms. Consult a doctor if symptoms persist or worsen.';
      possibleConditions = ['Common cold', 'Minor viral infection', 'Seasonal allergies'];
    }

    // Consider existing conditions
    if (existingCondition) {
      recommendations += ` Note: Given your existing condition (${existingCondition}), please consult your regular healthcare provider.`;
    }

    // Save to database (optional)
    // You can create a SymptomCheck model to store the history
    
    res.json({
      success: true,
      diagnosis,
      recommendations,
      urgency,
      possibleConditions,
      submittedData: {
        symptoms,
        duration,
        severity,
        age,
        existingCondition: existingCondition || 'None'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### `routes/medicine.js`
```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/medicine/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Analyze Medicine Image (Protected Route)
router.post('/analyze', auth, upload.single('medicineImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Here you would integrate with your AI/ML model or OCR service
    // For now, we'll return a mock response
    
    // Simulate AI processing
    const mockResponse = {
      success: true,
      medicineName: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      uses: 'Pain relief and fever reduction. Used to treat headaches, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
      dosage: 'Adults and children 12 years and over: 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.',
      sideEffects: 'Rare side effects may include: nausea, stomach pain, loss of appetite, rash, or allergic reactions.',
      warnings: 'Do not exceed recommended dose. Avoid alcohol while taking this medication. Consult doctor if pregnant, breastfeeding, or have liver problems.',
      imageUrl: `/uploads/medicine/${req.file.filename}`
    };

    res.json(mockResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### `routes/medical.js`
```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/medical/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf|txt|json/;
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'text/plain' || 
                     file.mimetype === 'application/json';
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

// Analyze Medical Data (Protected Route)
router.post('/analyze', auth, upload.single('medicalFile'), async (req, res) => {
  try {
    const { textData } = req.body;

    if (!req.file && !textData) {
      return res.status(400).json({ message: 'No file or text data provided' });
    }

    // Here you would integrate with your AI/ML model for medical image analysis
    // For now, we'll return a mock response
    
    let findings = '';
    let diagnosis = '';
    let severity = 'low';
    
    if (req.file) {
      // Mock analysis based on file type
      if (req.file.mimetype.startsWith('image/')) {
        findings = 'Medical imaging analysis completed. Clear visualization of anatomical structures.';
        diagnosis = 'No significant abnormalities detected in the provided medical image.';
      } else {
        findings = 'Document analysis completed. Medical records reviewed.';
        diagnosis = 'Patient data processed successfully.';
      }
    }
    
    if (textData) {
      findings += ' Text data analyzed for medical insights.';
      // Simple keyword analysis (replace with actual AI)
      if (textData.toLowerCase().includes('pain') || textData.toLowerCase().includes('fever')) {
        severity = 'medium';
        diagnosis = 'Symptoms suggest possible infection or inflammatory condition.';
      }
    }

    const mockResponse = {
      success: true,
      findings: findings || 'Analysis completed successfully.',
      diagnosis: diagnosis || 'Further evaluation recommended.',
      recommendations: 'Consult with a healthcare professional for detailed interpretation. Maintain regular health monitoring.',
      severity: severity,
      nextSteps: severity === 'high' 
        ? 'Seek immediate medical attention' 
        : severity === 'medium'
        ? 'Schedule appointment with doctor within 48 hours'
        : 'Continue routine health monitoring. Follow-up in 3-6 months.',
      fileUrl: req.file ? `/uploads/medical/${req.file.filename}` : null
    };

    res.json(mockResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

#### Update `server.js` to include new routes
```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Create upload directories if they don't exist
const uploadDirs = ['uploads/medicine', 'uploads/medical'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/symptom', require('./routes/symptom'));
app.use('/api/medicine', require('./routes/medicine')); // Add this line
app.use('/api/medical', require('./routes/medical')); // Add this line

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### Install additional dependency
```bash
npm install multer
```

---

## Frontend Features Implemented
```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

#### Update `server.js` to include symptom routes
```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/symptom', require('./routes/symptom')); // Add this line

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## Frontend Features Implemented
```
MONGODB_URI=mongodb://localhost:27017/mediai
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

---

## Frontend Features Implemented

### Login Page (`/login`)
- Email and password inputs
- Form validation
- Loading state during API call
- Success/error toast notifications
- Redirects to home page on success
- Stores JWT token in localStorage
- Link to signup page

### Signup Page (`/signup`)
- Full name, email, password, and confirm password inputs
- Password matching validation
- Terms of service checkbox
- Form validation
- Loading state during API call
- Success/error toast notifications
- Redirects to login page on success
- Social login buttons (UI only)
- Link to login page

### Symptom Checker Page (`/symptom-checker`)
- Symptoms input field
- Duration selection (radio buttons)
- Severity slider (1-10 scale)
- Existing condition input (optional)
- Age input
- Form validation
- Loading state during API call
- Success/error toast notifications
- Result display with diagnosis, recommendations, and urgency level
- Protected route (requires authentication token)
- Color-coded urgency levels (red/yellow/green)

### Medicine Checker Page (`/medicine-checker`)
- Image upload with preview
- File type validation (images only)
- File size validation (max 5MB)
- Remove/change image functionality
- Loading state during analysis
- Success/error toast notifications
- Result display showing:
  - Medicine name and generic name
  - Uses and dosage information
  - Side effects
  - Warnings (highlighted in yellow)
- Protected route (requires authentication token)

### Medical Analysis Page (`/medical-analysis`)
- Multiple upload options:
  - Medical images (X-ray, MRI, CT scans)
  - Document files (PDF, TXT, JSON)
  - Text input area for manual data entry
- File type validation
- File size validation (10MB for images, 5MB for documents)
- Image preview with remove functionality
- Loading state during analysis
- Success/error toast notifications
- Result display showing:
  - Findings and diagnosis
  - Recommendations
  - Severity level (color-coded badges)
  - Next steps (highlighted in blue)
- Protected route (requires authentication token)

### Navigation
- Navbar Sign Up button links to `/signup`
- All pages are fully integrated with routing

---

#### `middleware/auth.js`

If you want to test the frontend without a backend, you can temporarily modify the fetch calls to use mock data or comment them out.

## CORS Configuration

Make sure your backend allows requests from your frontend origin:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));
```


---

## Testing Without Backend

If you want to test the frontend without a backend, you can temporarily modify the fetch calls to use mock data or comment them out.

## CORS Configuration

Make sure your backend allows requests from your frontend origin:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));
```

---

## Summary

The Symptom Checker now:
1. Collects all form data (symptoms, duration, severity, existing conditions, age)
2. Validates required fields before submission
3. Sends data to backend API with authentication token
4. Displays loading state during API call
5. Shows success/error notifications
6. Displays analysis results with color-coded urgency levels
7. Includes proper error handling for network issues

The backend should implement AI/ML logic or integrate with a medical API to provide accurate symptom analysis.
