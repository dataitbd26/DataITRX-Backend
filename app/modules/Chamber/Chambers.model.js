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
        // --- Newly Added Fields ---
        consultancyFee: {
            type: Number,
            required: [true, "Please provide the consultancy fee"],
        },
        oldConsultancyFee: {
            type: Number,
            // You can add a default or make it required if needed
        },
        followUpDay: {
            type: Number,
            default: 0, // e.g., 7 or 15 days for a valid follow-up
        },

        maxDailyPatient: {
            type: Number,
            default: 0, // 0 can signify unlimited, or change to whatever default you prefer
        },
        // --------------------------
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