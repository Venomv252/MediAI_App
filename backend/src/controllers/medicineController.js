const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/medicine/');
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
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Mock response - In production, integrate with OCR/AI service
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
    console.error('Medicine analysis error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
