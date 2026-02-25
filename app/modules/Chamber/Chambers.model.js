import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ChamberSchema = Schema(
  {
    chamberName: {
      type: String,
      required: [true, "Please provide the chamber name"],
    },
    address: {
      type: String,
      required: [true, "Please provide the address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide the phone number"],
    },
    description: {
      type: String,
      required: [true, "Please provide the description"],
    },
    advanceBookingDays: {
      type: Number,
      required: [true, "Please provide the advance booking days"],
    },
    branch: {
      type: String,
      required: [true, "Please provide the branch"],
    },
  },
  { timestamps: true }
);

const Chamber = model("Chamber", ChamberSchema);

export default Chamber;