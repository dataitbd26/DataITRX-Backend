import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserSchema = Schema(
  {


    name: {
      type: String,
      required: [true, "Please provide employee name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
    },

    phone: {
      type: String,
      required: [true, "Please provide phone number"],
    },

    photo: {
      type: String,
      default: "",
    },

role: {
  type: String,
  required: [true, "Please provide user role"],
  enum: {
    values: ["Compounders", "Assistants", "Doctor", "Admin", "SuperAdmin"],
    message: "{VALUE} is not a valid role",
  },
},

    status: {
      type: String,
      enum: ["active", "inactive", "on-leave"],
      default: "active",
    },

    branch: {
      type: String,
      required: [true, "Please provide hotel branch"],
    },
  },
  { timestamps: true }
);


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add a method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);

export default User;
