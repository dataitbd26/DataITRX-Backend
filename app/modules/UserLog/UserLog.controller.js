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
  // 1. Explicitly convert string queries to numbers
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const totalLogs = await UserLog.countDocuments(); 
    
    const logs = await UserLog.find()
      .sort({ createdAt: -1 }) 
      .skip((page - 1) * limit) // Now safely doing math with numbers
      .limit(limit);            // Now safely passing a number

    res.status(200).json({
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
      logs,
    });
  } catch (err) {
    console.error("Pagination Error:", err); // Logs error to your terminal
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
