import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TokenBlacklistSchema = Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    // The TTL index will automatically delete the document after a specified time based on createdAt.
    // Assuming our tokens expire after 24h as defined in the controller, we set expires: '24h'.
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400 // 24 hours in seconds
    }
  }
);

const TokenBlacklist = model("TokenBlacklist", TokenBlacklistSchema);

export default TokenBlacklist;
