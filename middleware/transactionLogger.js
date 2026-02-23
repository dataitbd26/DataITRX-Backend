import TransactionLog from "./../app/modules/TransactionLog/TransactionLog.model.js";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate unique transaction codes

export default async function transactionLogger(req, res, next) {
  try {
    if (req.method === "GET") {
      return next();
    }

    const clientIP =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      "Unknown IP";

    const transactionCode = uuidv4(); // Generate a unique transaction code

    // Initial log data (assuming success)
    const logData = {
      transactionType: req.method,
      transactionCode,
      userEmail: req.headers["x-user-email"] || "Unknown User",
      userName: req.headers["x-user-name"] || "Unknown User",
      branch: req.headers["x-user-branch"] || "Unknown Branch",
      ipAddress: req.headers["x-user-ip"] || clientIP,
      status: "success",
      amount: req.body.amount || 0,
      details: `Request to ${req.originalUrl} - Method: ${req.method}`,
      Message: "Transaction successfully processed",
      transactionTime: new Date(),
    };

    // Proceed with the request processing
    const originalSend = res.send;
    res.send = async function (body) {
      try {
        if (res.statusCode >= 400) {
          logData.status = "failed"; // Mark as failed if response status is an error
          logData.details += ` - Error Status: ${res.statusCode}`;
          logData.transactionCode = res.statusCode.toString(); // Assign error code as transactionCode
          logData.Message = typeof body === "string" ? body : JSON.stringify(body);
        }

        await TransactionLog.create(logData);
    
      } catch (error) {
        console.error("Error logging transaction:", error);
      }
      originalSend.apply(res, arguments);
    };

    next();
  } catch (error) {
    console.error("Error logging transaction:", error);

    const errorLogData = {
      transactionType: req.method,
      transactionCode: "500", // Default error code for server failure
      userEmail: req.headers["x-user-email"] || "Unknown User",
      userName: req.headers["x-user-name"] || "Unknown User",
      branch: req.headers["x-user-branch"] || "Unknown Branch",
      ipAddress: req.headers["x-user-ip"] || "Unknown IP",
      status: "failed",
      amount: req.body.amount || 0,
      details: `Error processing request to ${req.originalUrl}`,
      Message: error.message,
      stackTrace: error.stack,
      transactionTime: new Date(),
    };

    await TransactionLog.create(errorLogData);
    next();
  }
}
