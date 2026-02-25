import Labtest from "./Labtests.model.js";

export async function getAllLabtests(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, totalLabtests] = await Promise.all([
      Labtest.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Labtest.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: result,
      pagination: {
        totalItems: totalLabtests,
        totalPages: Math.ceil(totalLabtests / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get labtest by ID
export async function getLabtestById(req, res) {
  const id = req.params.id;
  try {
    const result = await Labtest.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Labtest not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Create a new labtest
export async function createLabtest(req, res) {
  try {
    const labtestData = req.body;
    const result = await Labtest.create(labtestData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Update a labtest by ID
export async function updateLabtest(req, res) {
  const id = req.params.id;
  const labtestData = req.body;
  try {
    const result = await Labtest.findByIdAndUpdate(id, labtestData, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Labtest not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Remove a labtest by ID
export async function removeLabtest(req, res) {
  const id = req.params.id;
  try {
    const result = await Labtest.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Labtest deleted successfully" });
    } else {
      res.status(404).json({ message: "Labtest not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}