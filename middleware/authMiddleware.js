const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Extract token from the Authorization header
  const authHeader = req.header("Authorization") || req.header("authorization");
  if (!authHeader) {
    return res
      .status(403)
      .json({ error: "Access denied. Auth-Token not found" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ error: "Access denied. User not authenticated." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
