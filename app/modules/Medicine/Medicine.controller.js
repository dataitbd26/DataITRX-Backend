import Medicine from "./Medicine.model.js";

export async function getAllMedicines(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const result = await Medicine.find().skip(skip).limit(limit);
    const total = await Medicine.countDocuments();
    
    res.status(200).json({
      data: result,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllMedicine(req, res) {
  try {
    const result = await Medicine.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getByIdMedicine(req, res) {
  const id = req.params.id;
  try {
    const result = await Medicine.findById(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getMedicineByManufacturer(req, res) {
  const manufacturer = req.params.manufacturer;
  try {
    const result = await Medicine.find({ manufacturer: manufacturer });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getMedicineByGenericName(req, res) {
  const genericName = req.params.genericName;
  try {
    const result = await Medicine.find({ genericName: genericName });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createMedicine(req, res) {
  try {
    const MedicineData = req.body;
    const result = await Medicine.create(MedicineData);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeMedicine(req, res) {
  const id = req.params.id;
  try {
    const result = await Medicine.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateMedicine(req, res) {
  const id = req.params.id;
  const MedicineData = req.body;
  try {
    const result = await Medicine.findByIdAndUpdate(id, MedicineData, {
      new: true,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}