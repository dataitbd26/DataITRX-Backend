import User from "./Users.model.js";
import UserLog from "../UserLog/UserLog.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Get all users
export async function getAllUsers(req, res) {
  try {
    const result = await User.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get users by branch
export async function getUserByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const result = await User.find({ branch });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get user by ID
export async function getUserById(req, res) {
  const id = req.params.id;
  try {
    const result = await User.findById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Create a new user with hashed password
export async function createUser(req, res) {
  try {
    const userData = req.body;
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const result = await User.create(userData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Login user
export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "inactive") {
      return res.status(403).json({ message: "Account is inactive. Please contact support." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Log login time
    await UserLog.create({
      userEmail: user.email,
      username: user.name || "no name",
      loginTime: new Date(),
      role: user.role,
      branch: user.branch,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", { expiresIn: "24h" });

    // Remove password field from user object before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ message: "Login successful", user: userResponse, token });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Remove a user by ID
export async function removeUser(req, res) {
  const id = req.params.id;
  try {
    const result = await User.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function logoutUser(req, res) {
  const { email } = req.body;
  try {
    // Find the most recent login entry
    const log = await UserLog.findOne({ userEmail: email }).sort({ createdAt: -1 });
    if (log && !log.logoutTime) {
      log.logoutTime = new Date();
      await log.save();
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const currentUser = req.user;
    const targetUserId = req.params.id;
    const updates = req.body;

    // --- ✅ SUPER ADMIN LOGIC ---
    // If the person making the request is a superadmin, bypass all other checks.
    if (currentUser.role === 'superadmin') {
      // Hash password if it's being changed
      if (updates.password && updates.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      } else {
        delete updates.password;
      }

      const updatedUser = await User.findByIdAndUpdate(targetUserId, updates, { new: true }).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      // Successfully updated, end the function here.
      return res.status(200).json(updatedUser);
    }


    // ---  पुराने नियम (OLD RULES FOR ADMIN & MANAGER) ---
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Security: Prevent anyone other than a superadmin from editing another superadmin
    if (targetUser.role === 'superadmin') {
      return res.status(403).json({ message: "Forbidden: Cannot modify a superadmin account." });
    }

    // Security: Prevent a Manager from editing an Admin's profile
    if (currentUser.role === 'manager' && targetUser.role === 'admin') {
      return res.status(403).json({ message: "Forbidden: Managers cannot edit administrator accounts." });
    }

    // Security: Prevent a Manager from assigning the 'admin' role
    if (updates.role && updates.role === 'admin' && currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: You do not have permission to assign the admin role." });
    }

    // Handle Password Reset for admins/managers
    if (updates.password && updates.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    } else {
      delete updates.password;
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, updates, { new: true })
      .select("-password");

    res.status(200).json(updatedUser);

  } catch (err) {
    console.error("Error in updateUser function:", err);
    res.status(500).send({ error: "An unexpected server error occurred." });
  }
}

export async function changePassword(req, res) {
  // Note: Check your middleware. Usually it is req.user.id, not req.user.userId
  const { id } = req.user; 
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Update the password and save the user
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}