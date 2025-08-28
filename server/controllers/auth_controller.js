const bcrypt = require("bcrypt");
const User = require("../models/user_model");

// Register a new user (admin only)
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { username: username },
          { email: email },
        ],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' if no role is provided
    });

    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    return res.status(201).json({ user: userResponse });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { username: username },
          { email: username },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.json({ user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Logout user
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res.status(500).json({ error: "Could not log out" });
    }

    res.clearCookie("connect.sid"); // Clear session cookie
    return res.json({ message: "Logged out successfully" });
  });
};

// Get current user
const getCurrentUser = (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
