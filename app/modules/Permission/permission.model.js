import mongoose from "mongoose";
const { Schema, model } = mongoose;

const permissionSchema = new Schema(
  {
    title: { type: String, required: true },
    isAllowed: { type: Boolean, required: true },
    role: { type: String, required: true },
    group_name: { type: String, required: true },
    path: { type: String, required: true },
    // Branch field removed
  },
  { timestamps: true }
);

// ✅ OPTIMIZATION: Prevent duplicates for the same role/path combination
permissionSchema.index({ role: 1, path: 1 }, { unique: true });

const Permission = model("Permission", permissionSchema);
export default Permission;