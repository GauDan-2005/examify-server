const express = require("express");
const router = express.Router();
const auth = require("../middleware/userMiddleware");
const QuizControllers = require("../controllers/QuizControllers");
const teacherMiddleware = require("../middleware/teacherMiddleware");

// Create a new quiz
router.post("/", auth, teacherMiddleware, QuizControllers.createQuiz);

// Get all quizzes
router.get("/", auth, QuizControllers.getAllQuizes);

// Get a specific quiz
router.get("/:id", auth, QuizControllers.getQuiz);

// Update a quiz
router.put("/:id", auth, teacherMiddleware, QuizControllers.updateQuiz);

// Delete a quiz
router.delete("/:id", auth, teacherMiddleware, QuizControllers.deleteQuiz);

// Submit a quiz result
router.post("/:id/submit", auth, QuizControllers.submitQuiz);

module.exports = router;
