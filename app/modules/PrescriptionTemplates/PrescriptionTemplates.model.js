import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, default: '' },
    duration: { type: String, default: '' },
    instruction: { type: String, default: '' },
    manufacturer: { type: String, default: '' }
}, { _id: false });

const templateSchema = new mongoose.Schema({

    // Meta Data
    templateName: { type: String, required: true },
    category: { type: String, default: 'General' },
    branch: { type: String, required: true },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    isGlobal: { type: Boolean, default: true },

    // Clinical Data
    complaints: [{ type: String }],
    complaintsText: { type: String, default: '' },

    history: [{ type: String }],
    historyText: { type: String, default: '' },

    examination: [{ type: String }],
    examinationText: { type: String, default: '' },

    diagnosis: [{ type: String }],
    diagnosisText: { type: String, default: '' },

    investigations: [{ type: String }],

    medicines: [medicineSchema],

    advice: [{ type: String }],
    adviceText: { type: String, default: '' },

    followUp: { type: String, default: '' }

}, { timestamps: true });

export default mongoose.model('PrescriptionTemplate', templateSchema);