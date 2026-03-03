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
      required: [true, "Please provide the test department"],
    },
  },
  { timestamps: true }
);

const Labtest = model("Labtest", LabtestSchema);

export default Labtest;