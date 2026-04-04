import mongoose from "mongoose";
import dotenv from "dotenv";
import LabtestDept from "./app/modules/LabTestDept/LabTestDept.model.js";
import connectDB from "./config/db.js";

dotenv.config();

const clearDepts = async () => {
    try {
        await connectDB();
        console.log("Database connected. Removing all Lab Test Departments...");
        const res = await LabtestDept.deleteMany({});
        console.log(`Successfully deleted ${res.deletedCount} Lab Test Departments!`);
        process.exit(0);
    } catch (err) {
        console.error("Failed to delete departments:", err);
        process.exit(1);
    }
};

clearDepts();
