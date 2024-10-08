const express = require("express");
const router = express.Router();
const authController = require("../controllers/UserControllers");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

module.exports = router;
