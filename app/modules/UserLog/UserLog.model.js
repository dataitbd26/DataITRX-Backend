import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserLogSchema = Schema(
  {
    userEmail: {
      type: String,
      required: [true, "Please provide the user email"],
    },
    username: {
      type: String,
    },
    loginTime: {
      type: Date,
    },
    logoutTime: {
      type: Date,
    },
    role: {
      type: String,
    },
    branch: {
      type: String,

    },
  },
  { timestamps: true }
);

const UserLog = model("UserLog", UserLogSchema);

export default UserLog;
