const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    disease: { type: String, required: true },
    doctor: { type: String, required: true },
    treatmentPlan: String,
    medications: [String],
    allergies: [String],
    admissionDate: Date,
    dischargeDate: Date,
    medicalHistory: String,
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    }
});

patientSchema.index({ name: 1, admissionDate: -1 });

module.exports = mongoose.model('Patient', patientSchema);
