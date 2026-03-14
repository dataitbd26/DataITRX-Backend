import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AppointmentSchema = Schema(
  {
    appointmentId: {
      type: String,
      required: [true, "Please provide the appointment ID"],
      unique: true,
    },
    preCheckupId: {
      type: String,
      default: null,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Please provide the patient ID"],
    },
    chamberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chamber",
      required: [true, "Please provide the chamber ID"],
    },
    serial: {
      type: Number,
      required: [true, "Please provide the serial number"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Please provide the appointment date"],
    },
    appointmentTime: {
      type: String,
      required: [true, "Please provide the appointment time"],
    },
    patientType: {
      type: String,
      enum: ["New Patient", "Old Patient", "Report"],
      required: [true, "Please provide the patient type"],
    },
    branch: {
      type: String,
      required: [true, "Please provide the branch"],
    },
  },
  { timestamps: true }
);

const Appointment = model("Appointment", AppointmentSchema);

export default Appointment;