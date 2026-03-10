import mongoose from "mongoose";
const { Schema, model } = mongoose;

const LabtestSchema = Schema(
  {
    testName: {
      type: String,
      required: [true, "Please provide the test name"],
    },
    department: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Labtest = model("Labtest", LabtestSchema);

export default Labtest;