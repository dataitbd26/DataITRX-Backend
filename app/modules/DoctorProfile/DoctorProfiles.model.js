import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DoctorProfileSchema = Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide the full name"],
    },
    bmdcRegNumber: {
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
    email: {
      type: String,
      required: [true, "Please provide the email address"],
    },
    phone: {
      type: String,
      required: [true, "Please provide the phone number"],
    },
    degreeAndDesignation: {
      type: String,
      required: [true, "Please provide the degree & designation"],
    },
    nid: {
      type: String,
      required: [true, "Please provide the NID"],
    },
    location: {
      type: String,
      required: [true, "Please provide the location"],
    },
    address: {
      type: String,
      required: [true, "Please provide the address"],
    },
    division: {
      type: String,
      required: [true, "Please provide the division"],
    },
    district: {
      type: String,
      required: [true, "Please provide the district"],
    },
    postCode: {
      type: String,
      required: [true, "Please provide the post code"],
    },
    department: {
      type: String,
      required: [true, "Please provide the department"],
    },
    consultancyFee: {
      type: Number,
      required: [true, "Please provide the consultancy fee"],
    },
    oldConsultancyFee: {
      type: Number,
    },
    followUpDay: {
      type: String,
      required: [true, "Please provide the follow up day"],
    },
    signature: {
      type: String,
    },
    branch: {
      type: String,
      required: [true, "Please provide the branch"],
    },
  },
  { timestamps: true }
);

const DoctorProfile = model("DoctorProfile", DoctorProfileSchema);

export default DoctorProfile;