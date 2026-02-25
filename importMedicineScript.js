import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';
import Medicine from './app/modules/Medicine/Medicine.model.js';
import connectDB from './config/db.js';

dotenv.config();

const importMedicineCSV = async () => {
  try {
    console.log('🚀 Starting Medicine Import Process...');

    // 1. Connect to DB
    await connectDB();
    console.log('📡 Database connected successfully.');

    // 2. Define File Path
    const csvFilePath = path.join(process.cwd(), 'medicines.csv');

    if (!fs.existsSync(csvFilePath)) {
      console.error('❌ Error: medicines.csv not found in the root folder.');
      console.log('💡 Please ensure the file is named "medicines.csv" and is located at:', csvFilePath);
      process.exit(1);
    }

    console.log('📄 Found medicines.csv, reading file content...');

    // 3. Convert CSV to JSON
    const jsonArray = await csv().fromFile(csvFilePath);
    
    if (jsonArray.length === 0) {
      console.warn('⚠️ Warning: The CSV file is empty.');
      process.exit(0);
    }

    console.log(`📦 Parsed ${jsonArray.length} items from CSV. Formatting data...`);

    // 4. Map data to match Schema and ensure "final" status
    const formattedData = jsonArray.map((item, index) => {
      // Basic validation log for the first item to ensure mapping is correct
      if (index === 0) {
        console.log('🔍 Sample Mapping (First Item):', {
          brand: item.brandName,
          generic: item.genericName,
          status: "final"
        });
      }

      return {
        genericName: item.genericName || "Unknown Generic",
        brandName: item.brandName || "Unknown Brand",
        packageMark: item.packageMark || `pkg-${Date.now()}-${index}`,
        dosageType: item.dosageType || "N/A",
        strength: item.strength || "N/A",
        manufacturer: item.manufacturer || "Unknown Manufacturer",
        status: "final",
      };
    });

    // 5. Insert to Database
    console.log('💾 Saving data to MongoDB...');
    const result = await Medicine.insertMany(formattedData);
    
    console.log('--------------------------------------------------');
    console.log(`✅ SUCCESS: Imported ${result.length} medicines.`);
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ CRITICAL ERROR during import:');
    console.error('👉 Message:', error.message);
    process.exit(1);
  }
};

importMedicineCSV();