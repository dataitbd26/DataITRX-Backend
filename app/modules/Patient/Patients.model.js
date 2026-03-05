import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PatientSchema = Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        dateOfBirth: {
            type: Date,
        },

        age: {
            type: Number,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        address: {
            type: String,
        },
        emergencyContact: {
            name: String,
            phone: String,
        },
        allergies: {
            type: String,
        },
        medicalHistory: {
            type: String,
        },
        branch: {
            type: String,
            required: [true, "Please provide the branch"],
        },
    },
    { timestamps: true }
);

const Patient = model("Patient", PatientSchema);

export default Patient;