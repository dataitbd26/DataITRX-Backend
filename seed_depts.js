import mongoose from "mongoose";
import dotenv from "dotenv";
import LabtestDept from "./app/modules/LabTestDept/LabTestDept.model.js";
import connectDB from "./config/db.js";

dotenv.config();

const departments = [
  "Diabetes & Metabolic Profile",
  "Hormone & Endocrine Tests",
  "Kidney / Renal Disease",
  "All (General/Packages)",
  "Serum Electrolytes",
  "Biochemistry",
  "Urine and Stool Analysis",
  "ECHO",
  "Molecular Diagnostics & PCR",
  "Microbiology & Culture",
  "Hematology & Serology",
  "Infectious Diseases",
  "USG / Ultrasonography",
  "Liver / Hepatic Disease",
  "Coagulation / Hemostasis",
  "Drug Monitoring",
  "Allergy Tests",
  "Auto-immune Dysfunctions",
  "Additional / Other Test",
  "EEG / Neurology",
  "Endoscopy & Colonoscopy",
  "MRI",
  "Thyroid Disorders",
  "Heart / Cardiac Markers",
  "Histopathology",
  "Arthritis & Bone Disease",
  "Cytopathology",
  "Anemia Profile",
  "Contrast X-Rays",
  "Digital X-Rays",
  "CT Scan",
  "ETT / Stress Test",
  "Cancer Markers / Oncology",
  "Dental X-Rays",
  "4D Ultrasound",
  "Cytogenetics",
  "Colposcopy",
  "PFT / Spirometry",
  "ECG",
  "ELISA Method Tests",
  "Febrile Antigen",
  "Thalassemia & Hemoglobin Profile",
  "Holter Monitoring",
  "Immunohistochemistry",
  "Mammography"
];

const seedDepts = async () => {
    try {
        await connectDB();
        console.log("Database connected. Seeding pristine Lab Test Departments list...");
        
        // Loop via upsert ensures strict idempotency and zero duplicates
        let processedCount = 0;
        for (const dept of departments) {
            await LabtestDept.updateOne(
                { departmentName: dept },
                { $set: { departmentName: dept } },
                { upsert: true }
            );
            processedCount++;
        }
        
        console.log(`🔥 Successfully injected ${processedCount} organized Medical Department nodes into the system!`);
        process.exit(0);
    } catch (err) {
        console.error("Failed to seed departments:", err);
        process.exit(1);
    }
};

seedDepts();
