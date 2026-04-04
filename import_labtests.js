import mongoose from "mongoose";
import dotenv from "dotenv";
import csv from "csvtojson";
import Labtest from "./app/modules/Labtest/Labtests.model.js";
import connectDB from "./config/db.js";

dotenv.config();

const csvFilePath = "./categorized_medical_tests.csv";

const importData = async () => {
    try {
        await connectDB();
        console.log("✅ Database connected successfully. Starting import from CSV...");

        // Parse CSV using the internal module
        const tests = await csv().fromFile(csvFilePath);

        if (!tests || tests.length === 0) {
            console.log("⚠️ No tests found in the CSV. Make sure it has data formatted properly.");
            process.exit(1);
        }

        // Map CSV headers ('Exam Name', 'Category') into MongoDB Model properties
        const formattedData = tests.map(test => {
            return {
                testName: test["Exam Name"],
                department: test["Category"] || "General",
                status: "active"
            };
        });

        console.log(`🚀 Parsing Complete. Found ${formattedData.length} records in CSV. Syncing DB...`);

        // Perform safe Upserts to avoid duplicating any tests you've manually added before
        let processedCount = 0;
        for (const test of formattedData) {
            if (!test.testName) continue;
            
            await Labtest.updateOne(
                { testName: test.testName },
                { $set: test },
                { upsert: true }
            );
            processedCount++;
            
            // Just output some progress for large datasets
            if (processedCount % 500 === 0) {
               console.log(`🔄 Processed ${processedCount} records...`);
            }
        }

        console.log(`🔥 Migration Complete! Successfully synced ${processedCount} medical lab test records securely into the database!`);
        process.exit();
    } catch (err) {
        console.error("❌ Migration Error: ", err);
        process.exit(1);
    }
};

importData();
