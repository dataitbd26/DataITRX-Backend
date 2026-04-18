import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MedicineSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the medicine name"],
        },
        dosage: {
            type: String,
            default: "1-0-1",
        },
        duration: {
            type: String,
            default: "5 Days",
        },
        instruction: {
            type: String,
            default: "After meal",
        },
    },
    { _id: false }
);

const PrescriptionTemplateSchema = Schema(
    {
        templateName: {
            type: String,
            required: [true, "Please provide the template name"],
        },
        category: {
            type: String,
            default: "General",
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        isGlobal: {
            type: Boolean,
            default: true,
        },

        complaints: {
            type: [String],
        },
        complaintsText: {
            type: String,
            default: "",
        },

        history: {
            type: [String],
        },
        historyText: {
            type: String,
            default: "",
        },

        examination: {
            type: [String],
        },
        examinationText: {
            type: String,
            default: "",
        },

        diagnosis: {
            type: [String],
        },
        diagnosisText: {
            type: String,
            default: "",
        },

        investigations: {
            type: [String],
        },

        medicines: {
            type: [MedicineSchema],
        },

        advice: {
            type: [String],
        },
        adviceText: {
            type: String,
            default: "",
        },

        followUp: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const PrescriptionTemplate = model("PrescriptionTemplate", PrescriptionTemplateSchema);

export default PrescriptionTemplate;