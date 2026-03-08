import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DoctorProfileSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the doctor name"],
    },
    bmdcRegistrationNumber: {
      type: String,
      required: [true, "Please provide the BMDC registration number"],
      unique: true,
    },
    degree: {
      type: String,
      required: [true, "Please provide the degree"],
    },
    designation: {
      type: String,
      required: [true, "Please provide the designation"],
    },
    institution: {
      type: String,
      required: [true, "Please provide the institution"],
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    nid: {
      type: String,
    },
    address: {
      type: String,
    },
    division: {
      type: String,
    },
    district: {
      type: String,
    },
    signature: {
      type: String,
    },
    doctorPicture: {
      type: String,
    },
    branch: {
      type: String,
      required: [true, "Please provide the branch"],
      unique: true,
    },
  },
  { timestamps: true }
);

const DoctorProfile = model("DoctorProfile", DoctorProfileSchema);

export default DoctorProfile;