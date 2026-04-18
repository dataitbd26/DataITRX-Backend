import TransactionLog from "./TransactionLog.model.js";
import User from "../User/Users.model.js";

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
  const { 
    page = 1, 
    limit = 10, 
    status, 
    transactionType, 
    branch, 
    search, 
    statusCode, 
    startDate, 
    endDate 
  } = req.query;

  try {
    // Build dynamic query object
    let query = {};
    
    // Exact match filters
    if (status) query.status = status;
    if (branch) query.branch = branch;
    if (statusCode) query.statusCode = statusCode;

    // Partial match filters (Case-insensitive)
    if (transactionType) {
      query.transactionType = { $regex: transactionType, $options: "i" };
    }

    // Global Search (Matches User Name, Email, or Transaction Code)
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { transactionCode: { $regex: search, $options: "i" } }
      ];
    }

    // Date Range Filter (Using transactionTime or createdAt)
    if (startDate || endDate) {
      query.transactionTime = {}; // Change to query.createdAt if your schema uses that
      if (startDate) query.transactionTime.$gte = new Date(startDate);
      // Set end date to the end of the selected day
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        query.transactionTime.$lte = endOfDay;
      }
    }

    const totalLogs = await TransactionLog.countDocuments(query);
    const logs = await TransactionLog.find(query)
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

// Update a transaction log by ID
export async function updateTransactionLog(req, res) {
  const id = req.params.id;
  const logData = req.body;
  try {
    const updatedLog = await TransactionLog.findByIdAndUpdate(id, logData, {
      new: true,
      runValidators: true,
    });
    if (updatedLog) {
      res.status(200).json(updatedLog);
    } else {
      res.status(404).json({ message: "Transaction log not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete a transaction log by ID
export async function removeTransactionLog(req, res) {
  const id = req.params.id;
  try {
    const deletedLog = await TransactionLog.findByIdAndDelete(id);
    console.log("Deleted Log:", deletedLog); // Debugging log
    if (deletedLog) {
      res.status(200).json({ message: "Transaction log deleted successfully" });
    } else {
      res.status(404).json({ message: "Transaction log not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========== NEW FUNCTION FOR DYNAMIC BRANCH DROPDOWN ==========
// Get distinct branch names from transaction logs
export async function getDistinctBranches(req, res) {
  try {
    const branches = await TransactionLog.distinct('branch');
    // Filter out null/empty values and format for dropdown
    const branchOptions = branches
      .filter(b => b && b.trim() !== '')
      .map(b => ({ label: b, value: b }));
    res.status(200).json(branchOptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}