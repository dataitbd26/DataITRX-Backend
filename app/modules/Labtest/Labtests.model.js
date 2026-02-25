import mongoose from "mongoose";
const { Schema, model } = mongoose;

const LabtestSchema = Schema(
  {
    testName: {
      type: String,
      required: [true, "Please provide the test name"],
    },
  },
  { timestamps: true }
);

const Labtest = model("Labtest", LabtestSchema);

export default Labtest;