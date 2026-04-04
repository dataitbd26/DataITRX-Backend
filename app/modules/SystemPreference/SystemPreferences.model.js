import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SystemPreferenceSchema = Schema(
    {
        branch: {
            type: String,
            required: [true, "Please provide the branch identifier"],
            unique: true,
        },
        timezone: {
            type: String,
            default: "Asia/Dhaka",
        },
        printWithoutHeaderFooter: {
            type: Boolean,
            default: false,
        },
        autoSendEmail: {
            type: Boolean,
            default: false,
        },
        prescriptionHeaderSize: {
            type: Number,
            default: 150,
        },
        prescriptionFooterSize: {
            type: Number,
            default: 100,
        },
    },
    { timestamps: true }
);

const SystemPreference = model("SystemPreference", SystemPreferenceSchema);

export default SystemPreference;