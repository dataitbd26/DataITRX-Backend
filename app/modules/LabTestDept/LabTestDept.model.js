import mongoose from "mongoose";
const { Schema, model } = mongoose;

const LabTestDeptSchema = Schema(
  {
    departmentName: {
      type: String,
      required: [true, "Please provide the department name"],
    },
  },
  { timestamps: true }
);

const LabTestDept = model("LabTestDept", LabTestDeptSchema);

export default LabTestDept;