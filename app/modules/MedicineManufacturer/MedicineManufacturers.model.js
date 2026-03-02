// MedicineManufacturers.model.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MedicineManufacturerSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the manufacturer name"],
    },
    short_name: {
      type: String,
    },
    established_year: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      required: [true, "Please provide the status"],
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    logo: {
      type: String,
    },
  },
  { timestamps: true }
);

const MedicineManufacturer = model("MedicineManufacturer", MedicineManufacturerSchema);

export default MedicineManufacturer;