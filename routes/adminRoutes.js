const express = require("express");
const router = express.Router();

const auth = require("../middleware/userMiddleware");
const adminAuth = require("../middleware/adminMiddleware");

const AdminControllers = require("../controllers/AdminControllers");

// Get all users (admin only)
router.get("/users", auth, adminAuth, AdminControllers.getAllUsers);

// Get all quizzes with creator info (admin only)
router.get("/quizzes", auth, adminAuth, AdminControllers.getAllQuizes);

// Get all results (admin only)
router.get("/results", auth, adminAuth, AdminControllers.getAllResults);

// Generate report (admin only)
router.get("/report", auth, adminAuth, AdminControllers.getReport);

module.exports = router;
