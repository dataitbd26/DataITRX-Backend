import mongoose from "mongoose";
import archiver from "archiver";
import ExcelJS from "exceljs";
import { Parser } from "json2csv";

export const exportFullDatabase = async (req, res, next) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const format = req.query.format || "json";
    const dateString = new Date().toISOString().split("T")[0];

    // 1. STANDARD JSON (Array of Objects)
    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="db_backup_${dateString}.json"`);
      res.write('{');
      for (let i = 0; i < collections.length; i++) {
        const name = collections[i].name;
        res.write(`"${name}": [`);
        const cursor = db.collection(name).find({});
        let isFirst = true;
        for await (const doc of cursor) {
          if (!isFirst) res.write(',');
          res.write(JSON.stringify(doc));
          isFirst = false;
        }
        res.write(']');
        if (i < collections.length - 1) res.write(',');
      }
      res.write('}');
      return res.end();
    }

    // 2. NDJSON (Newline Delimited JSON - Best for massive DB backups)
    if (format === "ndjson") {
      res.setHeader("Content-Type", "application/x-ndjson");
      res.setHeader("Content-Disposition", `attachment; filename="db_backup_${dateString}.ndjson"`);
      for (const collection of collections) {
        const cursor = db.collection(collection.name).find({});
        for await (const doc of cursor) {
          // Store collection name inside the document for easy restoring
          res.write(JSON.stringify({ _collection: collection.name, ...doc }) + '\n');
        }
      }
      return res.end();
    }

    // 3. EXCEL (XLSX - One sheet per collection)
    if (format === "xlsx") {
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="db_backup_${dateString}.xlsx"`);
      
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
      
      for (const collection of collections) {
        const sheet = workbook.addWorksheet(collection.name.substring(0, 31)); // Excel limits sheet names to 31 chars
        const cursor = db.collection(collection.name).find({});
        
        let isFirst = true;
        for await (const doc of cursor) {
          // Flatten simple objects for Excel
          const flatDoc = flattenObject(doc);
          if (isFirst) {
            sheet.columns = Object.keys(flatDoc).map(key => ({ header: key, key: key }));
            isFirst = false;
          }
          sheet.addRow(flatDoc).commit();
        }
        sheet.commit();
      }
      await workbook.commit();
      return res.end();
    }

    // 4. CSV (Zipped - One CSV file per collection)
    if (format === "csv") {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="db_backup_${dateString}_csv.zip"`);
      
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(res);

      for (const collection of collections) {
        const data = await db.collection(collection.name).find({}).toArray();
        if (data.length > 0) {
          const flatData = data.map(doc => flattenObject(doc));
          const json2csvParser = new Parser();
          const csv = json2csvParser.parse(flatData);
          archive.append(csv, { name: `${collection.name}.csv` });
        }
      }
      await archive.finalize();
      return; // res.end() is handled by archive.finalize()
    }

    res.status(400).json({ message: "Invalid format requested" });

  } catch (error) {
    console.error("Export Error:", error);
    if (!res.headersSent) next(error);
    else res.end();
  }
};

// Utility to flatten nested MongoDB objects (e.g., { address: { city: 'NY' } } -> { 'address.city': 'NY' })
const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k]) && !(obj[k] instanceof Date) && !obj[k]._bsontype) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      // Convert arrays and complex types to strings for CSV/Excel
      acc[pre + k] = Array.isArray(obj[k]) ? JSON.stringify(obj[k]) : obj[k]?.toString();
    }
    return acc;
  }, {});
};