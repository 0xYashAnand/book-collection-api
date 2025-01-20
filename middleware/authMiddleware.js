const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Extract token from the Authorization header
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
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
