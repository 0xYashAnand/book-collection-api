const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/mysql");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation (optional but recommended)
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Please provide all required fields (username, email, password)",
      });
    }

    // Check if user email already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Email already exists, Please login" });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res
        .status(400)
        .json({ error: "Username already exists, Please login" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Signup failed, Please try again" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User validation
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};
