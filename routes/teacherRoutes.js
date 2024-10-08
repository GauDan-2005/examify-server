const express = require("express");
const router = express.Router();

const auth = require("../middleware/userMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");

const QuizControllers = require("../controllers/QuizControllers");
const TeacherControllers = require("../controllers/TeacherControllers");

// Create a new quiz
router.post("/", auth, teacherMiddleware, QuizControllers.createQuiz);

// Get all quizzes
router.get("/", auth, QuizControllers.getQuizzesByTeacher);

// Get a specific quiz
router.get("/:id", auth, QuizControllers.getQuiz);

// Update a quiz
router.put("/:id", auth, teacherMiddleware, QuizControllers.updateQuiz);

// Delete a quiz
router.delete("/:id", auth, teacherMiddleware, QuizControllers.deleteQuiz);

// Generate report for a specific student (admin and teacher)
router.get(
  "/student-report/:studentId",
  auth,
  teacherMiddleware,
  TeacherControllers.getReport
);

// Get quiz toppers (admin and teacher)
router.get(
  "/quiz-toppers/:quizId",
  auth,
  teacherMiddleware,
  TeacherControllers.getToppers
);

module.exports = router;
