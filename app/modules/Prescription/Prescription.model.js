import mongoose from 'mongoose';


const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, default: '' },
    duration: { type: String, default: '' },
    instruction: { type: String, default: '' },
    manufacturer: { type: String, default: '' }
}, { _id: false });


// 2. Main Prescription Schema
const prescriptionSchema = new mongoose.Schema({

   prescriptionId: {
        type: String,
        required: true,
        unique: true,
        default: () => {
            // Generates 4 digits strictly between 1000 and 9999 (never starts with 0)
            const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); 
            // Gets the last 4 digits of the time (can start with 0, but it's safe at the end)
            const timePart = Date.now().toString().slice(-4); 
            
            // Result: Always exactly 8 digits, never starts with a 0
            return randomPart + timePart; 
        }
    },


    branch: {
        type: String,
        required: [true, "Please provide the branch"]
    },
    

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    chamberId   : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chamber',
        default: null
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null
    },

    status: {
        type: String,
        enum: ['Draft', 'Completed', 'Cancelled'],
        default: 'Completed'
    },

    // --- PATIENT SNAPSHOT ---
    patient: {
        name: { type: String, required: true },
        age: { type: String, default: '' },
        gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
        phone: { type: String, default: '' }
    },

    patientType: {
        type: String,
        enum: ['New Patient', 'Old Patient', 'Report', ''],
        default: ''
    },

    // --- VITALS ---
    vitals: {
        bp: { type: String, default: '' },
        weight: { type: String, default: '' },
        pulse: { type: String, default: '' },
        temp: { type: String, default: '' },
        height: { type: String, default: '' },
        spo2: { type: String, default: '' }
    },

    // --- CLINICAL DATA ---
    complaints: [{ type: String }],
    complaintsText: { type: String, default: '' },

    history: [{ type: String }],
    historyText: { type: String, default: '' },

    examination: [{ type: String }],
    examinationText: { type: String, default: '' },

    diagnosis: [{ type: String }],
    diagnosisText: { type: String, default: '' },

    investigations: [{ type: String }],
    investigationsDiscount: { type: String, default: '' },

    // --- TREATMENT ---
    medicines: [medicineSchema],

    advice: [{ type: String }],
    adviceText: { type: String, default: '' },

    followUp: { type: String, default: '' },

    // --- AI / EXTRA DATA ---
    interactionsChecked: { type: Boolean, default: false },
    interactionNotes: { type: String, default: '' }

}, { timestamps: true });


// Indexes for faster searching
prescriptionSchema.index({ doctorId: 1, createdAt: -1 });
prescriptionSchema.index({ branch: 1 });
prescriptionSchema.index({ 'patient.name': 'text', prescriptionId: 'text' });

export default mongoose.model('Prescription', prescriptionSchema);

