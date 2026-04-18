import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AppointmentBlockSchema = Schema(
    {
        doctorId: {
            type: String,
            required: [true, "Please provide the doctor ID"],
        },
        chamberId: {
            type: String,
            required: [true, "Please provide the chamber ID"],
        },
        blockFrom: {
            type: Date,
            required: [true, "Please provide the block from date and time"],
        },
        blockTo: {
            type: Date,
            required: [true, "Please provide the block to date and time"],
        },
        branch: {
            type: String,
            required: [true, "Please provide the branch"],
        },
    },
    { timestamps: true }
);

const AppointmentBlock = model("AppointmentBlock", AppointmentBlockSchema);

export default AppointmentBlock;