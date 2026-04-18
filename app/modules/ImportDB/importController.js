import mongoose from "mongoose";
import fs from "fs";
import readline from "readline";

export const importDatabase = async (req, res, next) => {
  try {
    // 1. Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No backup file uploaded." });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const db = mongoose.connection.db;

    // 2. Handle Standard JSON (.json)
    if (fileName.endsWith('.json')) {
      // Read the file into memory (Warning: Not ideal for files > 500MB)
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const parsedData = JSON.parse(rawData);

      // Loop through each collection in the JSON file
      for (const [collectionName, documents] of Object.entries(parsedData)) {
        if (documents.length > 0) {
          const collection = db.collection(collectionName);
          
          // DANGER: Clear existing data before restoring to prevent duplicate _id crashes
          await collection.deleteMany({}); 
          
          // Insert the backup data
          await collection.insertMany(documents);
        }
      }
    } 
    // 3. Handle Streaming JSON (.ndjson) - Best for huge databases
    else if (fileName.endsWith('.ndjson')) {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

      // We will group documents by collection name to insert them in batches
      const batches = {};

      for await (const line of rl) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);
        
        const collectionName = doc._collection;
        delete doc._collection; // Remove the helper key we added during export

        if (!batches[collectionName]) {
          batches[collectionName] = [];
          // Clear the collection on the first encounter
          await db.collection(collectionName).deleteMany({}); 
        }

        batches[collectionName].push(doc);

        // Insert in chunks of 1000 to save memory
        if (batches[collectionName].length === 1000) {
          await db.collection(collectionName).insertMany(batches[collectionName]);
          batches[collectionName] = []; // Reset batch
        }
      }

      // Insert any remaining documents
      for (const [collectionName, documents] of Object.entries(batches)) {
        if (documents.length > 0) {
          await db.collection(collectionName).insertMany(documents);
        }
      }
    } else {
      // Clean up the invalid file
      fs.unlinkSync(filePath); 
      return res.status(400).json({ message: "Invalid file format. Only .json or .ndjson allowed." });
    }

    // 4. Cleanup: Delete the temporary uploaded file
    fs.unlinkSync(filePath);

    return res.status(200).json({ message: "Database restored successfully." });

  } catch (error) {
    console.error("Import Error:", error);
    // Ensure we delete the temp file even if it crashes
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};