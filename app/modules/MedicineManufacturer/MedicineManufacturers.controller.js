// MedicineManufacturers.controller.js

import MedicineManufacturer from "./MedicineManufacturers.model.js";

export async function getAllMedicineManufacturers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalMedicineManufacturers] = await Promise.all([
      MedicineManufacturer.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      MedicineManufacturer.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalMedicineManufacturers,
        totalPages: Math.ceil(totalMedicineManufacturers / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getMedicineManufacturersByStatus(req, res) {
  const status = req.params.status;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalMedicineManufacturers] = await Promise.all([
      MedicineManufacturer.find({ status }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      MedicineManufacturer.countDocuments({ status }) 
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalMedicineManufacturers,
        totalPages: Math.ceil(totalMedicineManufacturers / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get medicine manufacturer by ID
export async function getMedicineManufacturerById(req, res) {
  const id = req.params.id;
  try {
    const result = await MedicineManufacturer.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Medicine manufacturer not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Create a new medicine manufacturer
export async function createMedicineManufacturer(req, res) {
  try {
    const manufacturerData = req.body;
    const result = await MedicineManufacturer.create(manufacturerData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Update a medicine manufacturer by ID
export async function updateMedicineManufacturer(req, res) {
  const id = req.params.id;
  const manufacturerData = req.body;
  try {
    const result = await MedicineManufacturer.findByIdAndUpdate(id, manufacturerData, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Medicine manufacturer not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Remove a medicine manufacturer by ID
export async function removeMedicineManufacturer(req, res) {
  const id = req.params.id;
  try {
    const result = await MedicineManufacturer.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Medicine manufacturer deleted successfully" });
    } else {
      res.status(404).json({ message: "Medicine manufacturer not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}