const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/medical/');
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
      return res.status(400).json({ success: false, message: 'No file or text data provided' });
    }

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
      // Simple keyword analysis
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
    console.error('Medical analysis error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
