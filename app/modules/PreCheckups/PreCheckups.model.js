import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PreCheckupSchema = new Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },

    chiefComplaints: [
      {
        complaint: { type: String },
        duration: { type: String },
      },
    ],

    history: {
      presentIllness: { type: String },
      pastHistory: { type: String },
      medicalHistory: { type: String },
      familyHistory: { type: String },
      drugHistory: { type: String },
      allergyHistory: { type: String },
      socialHistory: {
        smoking: { type: Boolean, default: false },
        alcoholic: { type: Boolean, default: false },
      },
    },

    examination: {
      general: { type: String },

      vitals: {
        weight: { type: Number },
        height: { type: Number },
        bp: { type: String },
        pulse: { type: Number },
        temperature: { type: Number },
      },

      systemic: {
        cardiovascular: { type: String },
        respiratory: { type: String },
        abdominal: { type: String },
        neurological: { type: String },
      },
    },

    conditions: {
      hypertension: { type: Boolean, default: false },
      thyroid: { type: Boolean, default: false },
      copd: { type: Boolean, default: false },
      asthma: { type: Boolean, default: false },
      cardiac: { type: Boolean, default: false },
      renal: { type: Boolean, default: false },
    },

    drugAllergy: {
      type: Boolean,
      default: false,
    },
    caseSummary: {
      type: String,
    },

    diagnosis: {
      type: String,
    },

    counsellorComment: {
      type: String,
    },

    doctorComment: {
      type: String,
    },

    branch: {
      type: String,
      required: [true, "Please provide the branch"],
    },
  },
  { timestamps: true }
);

const PreCheckup = model("PreCheckup", PreCheckupSchema);

export default PreCheckup;