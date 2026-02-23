import UserLog from "./UserLog.model.js";

// Get all user logs
export async function getAllUserLogs(req, res) {
  try {
    const result = await UserLog.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getPaginatedUserLogs(req, res) {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page

  try {
    const totalLogs = await UserLog.countDocuments(); // Total count of logs
    const logs = await UserLog.find()
      .sort({ createdAt: -1 }) // Sort by latest
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: parseInt(page),
      logs,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get user logs by branch
export async function getUserLogsByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const result = await UserLog.find({ branch });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get user log by ID
export async function getUserLogById(req, res) {
  const id = req.params.id;
  try {
    const result = await UserLog.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User log not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Create a new user log
export async function createUserLog(req, res) {
  try {
    const userLogData = req.body;
    const result = await UserLog.create(userLogData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Update a user log by ID
export async function updateUserLog(req, res) {
  const id = req.params.id;
  const userLogData = req.body;
  try {
    const result = await UserLog.findByIdAndUpdate(id, userLogData, { new: true });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User log not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Remove a user log by ID
export async function removeUserLog(req, res) {
  const id = req.params.id;
  try {
    const result = await UserLog.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "User log deleted successfully" });
    } else {
      res.status(404).json({ message: "User log not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
