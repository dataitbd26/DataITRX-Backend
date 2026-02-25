import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MedicineTypeSchema = Schema(
  {
    genericName: {
      type: String,
    },
    brandName: {
      type: String,
    },
    packageMark: {
      type: String,
    },
    dosageType: {
      type: String,
    },
    strength: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "draft", "final"],
      default: "final",
    },
  },
  { timestamps: true }
);

const Medicine = model("Medicine", MedicineTypeSchema);

export default Medicine;