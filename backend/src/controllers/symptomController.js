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
        success: false,
        message: 'Missing required fields: symptoms, duration, severity, and age are required' 
      });
    }

    // AI-based logic based on severity
    let diagnosis = '';
    let recommendations = '';
    let urgency = 'low';
    let possibleConditions = [];

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
    console.error('Symptom check error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
