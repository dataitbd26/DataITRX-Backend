import Chamber from "./Chambers.model.js";

export async function getAllChambers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalChambers] = await Promise.all([
      Chamber.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Chamber.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalChambers,
        totalPages: Math.ceil(totalChambers / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getChambersByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalChambers] = await Promise.all([
      Chamber.find({ branch }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Chamber.countDocuments({ branch }) 
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalChambers,
        totalPages: Math.ceil(totalChambers / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get chamber by ID
export async function getChamberById(req, res) {
  const id = req.params.id;
  try {
    const result = await Chamber.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Chamber not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Create a new chamber
export async function createChamber(req, res) {
  try {
    const chamberData = req.body;
    const result = await Chamber.create(chamberData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Update a chamber by ID
export async function updateChamber(req, res) {
  const id = req.params.id;
  const chamberData = req.body;
  try {
    const result = await Chamber.findByIdAndUpdate(id, chamberData, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Chamber not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Remove a chamber by ID
export async function removeChamber(req, res) {
  const id = req.params.id;
  try {
    const result = await Chamber.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Chamber deleted successfully" });
    } else {
      res.status(404).json({ message: "Chamber not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}