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
        mobileNumber: {
            type: String,
            required: [true, "Please provide the mobile number"],
        },
        description: String,
        advanceBookingDays: {
            type: Number,
            default: 7,
        },
        branch: {
            type: String,
        },
        schedule: [
            {
                day: {
                    type: String,
                    enum: [
                        "Saturday",
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                    ],
                },
                startTime: {
                    type: String,
                },
                endTime: {
                    type: String,
                },
                isHoliday: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    { timestamps: true }
);

const Chamber = model("Chamber", ChamberSchema);

export default Chamber;