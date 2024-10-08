const Quiz = require("../models/quizModel");
const Result = require("../models/resultModel");

const TeacherControllers = {
  getToppers: async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.quizId);
      if (!quiz) {
        return res.status(404).json({ msg: "Quiz not found" });
      }

      const toppers = await Result.aggregate([
        { $match: { quiz: quiz._id } },
        { $sort: { score: -1, timeTaken: 1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 0,
            username: "$user.username",
            score: 1,
            timeTaken: 1,
          },
        },
      ]);

      res.json({
        quizTitle: quiz.title,
        toppers,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  getReport: async (req, res) => {
    try {
      const student = await User.findById(req.params.studentId).select(
        "-password"
      );
      if (!student || student.role !== "student") {
        return res.status(404).json({ msg: "Student not found" });
      }

      const results = await Result.find({ user: student._id })
        .populate("quiz", "title")
        .sort("-createdAt");

      const quizzesTaken = results.length;
      const averageScore =
        results.reduce((acc, result) => acc + result.score, 0) / quizzesTaken;

      const topScores = await Result.aggregate([
        { $match: { user: student._id } },
        { $group: { _id: "$quiz", topScore: { $max: "$score" } } },
        { $sort: { topScore: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "quizzes",
            localField: "_id",
            foreignField: "_id",
            as: "quiz",
          },
        },
        { $unwind: "$quiz" },
        { $project: { _id: 0, quizTitle: "$quiz.title", topScore: 1 } },
      ]);

      const report = {
        student: {
          id: student._id,
          username: student.username,
          email: student.email,
        },
        quizzesTaken,
        averageScore,
        topScores,
        recentResults: results.slice(0, 10),
      };

      res.json(report);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
};

module.exports = TeacherControllers;
