import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TransactionLogSchema = new Schema(
  {
    transactionType: {
      type: String,
      required: [true, "Transaction type is required"],
    },
    transactionCode: {
      type: String,
      required: true, // 404 or 500 or 401 or 400 or 200
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"], 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    Message: {
      type: String,
      default: null, // Store error messages or sucessful message 
    },
    stackTrace: {
      type: String,
      default: null, // Store stack trace for debugging failed transactions 
    },
    transactionTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TransactionLog = model("TransactionLog", TransactionLogSchema);

export default TransactionLog;