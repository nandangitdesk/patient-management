const express = require('express');
const Patient = require('../models/Patient');
const router = express.Router();

// Create a patient
router.get('/create', (req, res) => {
    res.render('createPatient');
});

router.post('/create', async (req, res) => {
    const { name, age, disease, doctor, treatmentPlan, medications, allergies, medicalHistory, emergencyContact } = req.body;
    try {
        const newPatient = await Patient.create({ 
            name, 
            age, 
            disease, 
            doctor, 
            treatmentPlan, 
            medications: medications ? medications.split(',').map(med => med.trim()) : [],
            allergies: allergies ? allergies.split(',').map(allergy => allergy.trim()) : [],
            medicalHistory,
            emergencyContact: {
                name: emergencyContact.name,
                relationship: emergencyContact.relationship,
                phone: emergencyContact.phone
            }
        });
        res.redirect('/patients');
    } catch (err) {
        res.render('createPatient', { error: 'Patient creation failed' });
    }
});

// Read all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.render('patients', { patients });
    } catch (err) {
        res.render('patients', { error: 'Could not fetch patients' });
    }
});

// Update a patient
router.get('/edit/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).render('error', { message: 'Patient not found' });
        }
        res.render('editPatient', { patient });
    } catch (err) {
        res.status(500).render('error', { message: 'Could not find patient' });
    }
});

router.post('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const patientData = { ...req.body };
        
        // Process medications and allergies
        if (patientData.medications) {
            patientData.medications = patientData.medications.split(',').map(item => item.trim());
        }
        if (patientData.allergies) {
            patientData.allergies = patientData.allergies.split(',').map(item => item.trim());
        }

        const updatedPatient = await Patient.findByIdAndUpdate(id, patientData, { new: true, runValidators: true });
        if (!updatedPatient) {
            return res.status(404).render('editPatient', { error: 'Patient not found', patient: patientData });
        }
        res.redirect('/patients');
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(400).render('editPatient', { error: 'Error updating patient', patient: req.body });
    }
});

// Delete a patient
router.get('/delete/:id', async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.redirect('/patients');
    } catch (err) {
        res.render('error', { message: 'Could not delete patient' });
    }
});

module.exports = router;
