
// TransactionLog.controller.js
import TransactionLog from "./TransactionLog.model.js";

// Get all transaction logs
export async function getAllTransactionLogs(req, res) {
  try {
    const logs = await TransactionLog.find();
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get paginated transaction logs
export async function getPaginatedTransactionLogs(req, res) {
  const { page = 1, limit = 10 } = req.query;

  try {
    const totalLogs = await TransactionLog.countDocuments();
    const logs = await TransactionLog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: parseInt(page),
      logs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get transaction logs by branch
export async function getTransactionLogsByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const logs = await TransactionLog.find({ branch });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a single transaction log by ID
export async function getTransactionLogById(req, res) {
  const id = req.params.id;
  try {
    const log = await TransactionLog.findById(id);
    if (log) {
      res.status(200).json(log);
    } else {
      res.status(404).json({ message: "Transaction log not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new transaction log
export async function createTransactionLog(req, res) {
  try {
    const logData = req.body;
    const newLog = await TransactionLog.create(logData);
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a transaction log by ID
export async function removeTransactionLog(req, res) {
  const id = req.params.id;
  try {
    const deletedLog = await TransactionLog.findByIdAndDelete(id);
    if (deletedLog) {
      res.status(200).json({ message: "Transaction log deleted successfully" });
    } else {
      res.status(404).json({ message: "Transaction log not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}