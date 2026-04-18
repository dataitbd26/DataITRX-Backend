import User from "./Users.model.js";
import UserLog from "../UserLog/UserLog.model.js";
import TokenBlacklist from "../TokenBlacklist/TokenBlacklist.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Get all users
export async function getAllUsers(req, res) {
  try {

    const { search, branch, role } = req.query;


    let query = {};


    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (branch) {
      query.branch = branch;
    }

    if (role) {
      query.role = role;
    }

    const result = await User.find(query).select("-password");

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching users:", err);
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

    const secret = process.env.JWT_SECRET || "secretKey";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "24h" });

     // Set HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,     // Force true for testing
      sameSite: 'none', // Force 'none' for testing
      maxAge: 24 * 60 * 60 * 1000
    });

    // Remove password field from user object before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Send token in response payload as well just in case legacy frontend code expects it,
    // although they will now primarily transparently use the cookie.
    res.status(200).json({ message: "Login successful", user: userResponse, token });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Remove a user by ID
export async function removeUser(req, res) {
  const id = req.params.id;
  const currentUser = req.user; // Grab the user from the JWT token

  try {

    // Prevent SuperAdmin from accidentally deleting themselves
    if (currentUser.role !== 'SuperAdmin') {
      return res.status(403).json({
        message: "Access denied. Only SuperAdmins can delete accounts."
      });
    }

    // 2. Self-Deletion Check: Prevent SuperAdmin from deleting themselves
    // Note: Use .toString() if one is an objectId and the other is a string
    if (currentUser.id.toString() === id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

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
  const token = req.token; // Extracted safely from authMiddleware
  
  try {
    // 1. Mark MongoDB UserLog logoutTime
    if (email) {
      const log = await UserLog.findOne({ userEmail: email }).sort({ createdAt: -1 });
      if (log && !log.logoutTime) {
        log.logoutTime = new Date();
        await log.save();
      }
    }

    // 2. Blacklist the Token
    if (token) {
      // Create entry, ignoring duplicate key errors if the exact token is submitted twice
      await TokenBlacklist.create({ token }).catch(err => {
        if (err.code !== 11000) throw err; // Only swallow duplicate key error
      });
    }

    // 3. Clear HttpOnly Cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).send({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const currentUser = req.user; // from JWT token
    const targetUserId = req.params.id;
    const updates = req.body;

    // --- ✅ SUPER ADMIN LOGIC ---
    // Note: Fixed the casing to match your Schema exactly ("SuperAdmin")
    if (currentUser.role === 'SuperAdmin') {

      // If SuperAdmin provided a new password, hash it
      if (updates.password && updates.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      } else {
        // If password field is empty, remove it from updates so we don't overwrite the existing one
        delete updates.password;
      }

      const updatedUser = await User.findByIdAndUpdate(targetUserId, updates, { new: true }).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      // Successfully updated, end the function here.
      return res.status(200).json(updatedUser);
    }


    // --- ❌ OLD RULES FOR ADMIN & MANAGER ---
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Security: Prevent anyone other than a SuperAdmin from editing another SuperAdmin
    if (targetUser.role === 'SuperAdmin') {
      return res.status(403).json({ message: "Forbidden: Cannot modify a SuperAdmin account." });
    }

    // Security: Prevent a Manager from editing an Admin's profile
    if (currentUser.role === 'Manager' && targetUser.role === 'Admin') {
      return res.status(403).json({ message: "Forbidden: Managers cannot edit administrator accounts." });
    }

    // Security: Prevent a Manager from assigning the 'Admin' role
    if (updates.role && updates.role === 'Admin' && currentUser.role !== 'Admin') {
      return res.status(403).json({ message: "Forbidden: You do not have permission to assign the Admin role." });
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