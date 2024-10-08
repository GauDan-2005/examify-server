const express = require("express");
const router = express.Router();
const auth = require("../middleware/userMiddleware");
const QuizControllers = require("../controllers/QuizControllers");

// Get all quizzes
router.get("/", auth, QuizControllers.getQuizzesByStudents);

// Get a specific quiz
router.get("/:id", auth, QuizControllers.getQuiz);

// Submit a quiz result
router.post("/:id/submit", auth, QuizControllers.submitQuiz);

module.exports = router;
