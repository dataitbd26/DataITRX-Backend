import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PreCheckupSchema = Schema(
  {
    appointmentId: {
      type: String,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Please provide the patient"],
    },

    caseSummary: {
      type: String,
    },

    smoking: {
      type: Boolean,
      default: false,
    },

    alcoholic: {
      type: Boolean,
      default: false,
    },

    hypertension: {
      type: Boolean,
      default: false,
    },

    thyroid: {
      type: Boolean,
      default: false,
    },

    copd: {
      type: Boolean,
      default: false,
    },

    drugAllergy: {
      type: Boolean,
      default: false,
    },

    asthma: {
      type: Boolean,
      default: false,
    },

    cardiac: {
      type: Boolean,
      default: false,
    },

    renal: {
      type: Boolean,
      default: false,
    },

    weight: {
      type: Number,
    },

    height: {
      type: Number,
    },

    bmi: {
      type: Number,
    },

    bp: {
      type: String,
    },

    pulse: {
      type: Number,
    },

    temperature: {
      type: Number,
    },

    waist: {
      type: Number,
    },

    hip: {
      type: Number,
    },

    others: {
      type: String,
    },

    counsellorComment: {
      type: String,
    },

    doctorComment: {
      type: String,
    },

    familyHistory: {
      type: String,
    },

    medicalHistory: {
      type: String,
    },

    diagnosis: {
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