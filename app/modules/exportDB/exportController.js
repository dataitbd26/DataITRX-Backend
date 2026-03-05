import mongoose from "mongoose";

export const exportFullDatabase = async (req, res, next) => {
  try {
    // Access the native MongoDB database object via Mongoose
    const db = mongoose.connection.db;
    
    // Get all collection names in the database
    const collections = await db.listCollections().toArray();
    const exportData = {};

    // Iterate through each collection and fetch all documents
    for (let collection of collections) {
      const collectionName = collection.name;
      const data = await db.collection(collectionName).find({}).toArray();
      exportData[collectionName] = data;
    }

    // Set headers to prompt a file download on the frontend
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="full_db_backup.json"');

    // Send the compiled object as a formatted JSON string
    return res.status(200).send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    console.error("Export Error:", error);
    next(error); // Pass to your existing errorHandler middleware
  }
};