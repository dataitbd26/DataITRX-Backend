import jwt from "jsonwebtoken";
import TokenBlacklist from "../app/modules/TokenBlacklist/TokenBlacklist.model.js";

export async function authenticateToken(req, res, next) {
  // Try to grab token from cookies first, then fallback to Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Access token missing" });

  try {
    // Check if Token is Blacklisted
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token has been blacklisted. Please log in again." });
    }

    // Verify token math
    const secret = process.env.JWT_SECRET || "secretKey";
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });
      
      // Inject user payload and the active token so controllers (like logout) can grab it
      req.user = user;
      req.token = token; 
      next();
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ message: "Internal server error during authentication" });
  }
}
