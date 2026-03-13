const Buyer = require("../models/Buyer");
const Farmer = require("../models/Farmer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

exports.registerUser = async (req, res) => {

  try {

    const { name, email, phone, password, farmName, location, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (role === "buyer") {

      const existingBuyer = await Buyer.findOne({ email });

      if (existingBuyer) {
        return res.status(400).json({ message: "Buyer already exists" });
      }

      user = await Buyer.create({
        name,
        email,
        phone,
        password: hashedPassword
      });

    }

    else if (role === "vendor") {

      const existingFarmer = await Farmer.findOne({ email });

      if (existingFarmer) {
        return res.status(400).json({ message: "Farmer already exists" });
      }

      user = await Farmer.create({
        name,
        email,
        phone,
        password: hashedPassword,
        farmName,
        location
      });

    }

    res.status(201).json({
      token: generateToken(user._id, role),
      role: role
    });

  }

  catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

};



exports.loginUser = async (req, res) => {

  try {

    const { email, password, role } = req.body;

    let user;

    if (role === "buyer") {
      user = await Buyer.findOne({ email });
    }

    else if (role === "vendor") {
      user = await Farmer.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id, role),
      role: role
    });

  }

  catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

};