import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DoctorDepartmentSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the department name"],
    },
  },
  { timestamps: true }
);

const DoctorDepartment = model("DoctorDepartment", DoctorDepartmentSchema);

export default DoctorDepartment;