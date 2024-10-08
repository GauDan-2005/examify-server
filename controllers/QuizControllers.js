const Quiz = require("../models/quizModel");
const Result = require("../models/resultModel");

const QuizControllers = {
  createQuiz: async (req, res) => {
    try {
      const { title, description, questions, timeLimit } = req.body;
      const newQuiz = new Quiz({
        title,
        description,
        creator: req.user.id,
        questions,
        timeLimit,
      });
      const quiz = await newQuiz.save();
      res.json(quiz);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  getAllQuizes: async (req, res) => {
    try {
      const quizzes = await Quiz.find().sort({ createdAt: -1 });
      res.json(quizzes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  getQuizzesByStudents: async (req, res) => {
    try {
      const student = await User.findById(req.user.id).populate("teachers");

      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      const teacherIds = student.teachers.map((teacher) => teacher._id);

      const quizzesByTeacher = [];

      for (const teacherId of teacherIds) {
        const quizzes = await Quiz.find({ creator: teacherId });
        quizzesByTeacher.push(quizzes);
      }

      res.json(quizzesByTeacher);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  getQuizzesByTeacher: async (req, res) => {
    try {
      const quizzes = await Quiz.find({ creator: teacherId }).sort({
        createdAt: -1,
      });
      res.json(quizzes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  getQuiz: async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ msg: "Quiz not found" });
      }
      res.json(quiz);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Quiz not found" });
      }
      res.status(500).send("Server error");
    }
  },
  updateQuiz: async (req, res) => {
    try {
      const { title, description, questions, timeLimit, isActive } = req.body;
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ msg: "Quiz not found" });
      }
      if (quiz.creator.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }
      if (title) quiz.title = title;
      if (description) quiz.description = description;
      if (questions) quiz.questions = questions;
      if (timeLimit) quiz.timeLimit = timeLimit;
      if (typeof isActive !== "undefined") quiz.isActive = isActive;
      await quiz.save();
      res.json(quiz);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Quiz not found" });
      }
      res.status(500).send("Server error");
    }
  },
  deleteQuiz: async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ msg: "Quiz not found" });
      }
      if (quiz.creator.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      await Quiz.deleteOne({ _id: req.params.id });

      res.json({ msg: "Quiz removed" });
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Quiz not found" });
      }
      res.status(500).send("Server error");
    }
  },
  submitQuiz: async (req, res) => {
    try {
      const { answers, timeTaken } = req.body;
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ msg: "Quiz not found" });
      }
      let score = 0;
      const answersWithCorrectness = answers.map((answer, index) => {
        const isCorrect =
          answer.selectedOption === quiz.questions[index].correctOption;
        if (isCorrect) score++;
        return { ...answer, isCorrect };
      });
      const result = new Result({
        user: req.user.id,
        quiz: req.params.id,
        score,
        answers: answersWithCorrectness,
        timeTaken,
      });
      await result.save();
      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
};

module.exports = QuizControllers;
