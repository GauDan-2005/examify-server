const User = require("../models/userModel");
const Quiz = require("../models/quizModel");
const Result = require("../models/resultModel");

const AdminControllers = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  getAllQuizes: async (req, res) => {
    try {
      const quizzes = await Quiz.find().populate("creator", "username email");
      res.json(quizzes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  getAllResults: async (req, res) => {
    try {
      const results = await Result.find()
        .populate("user", "username email")
        .populate("quiz", "title");
      res.json(results);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  getReport: async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      const quizCount = await Quiz.countDocuments();
      const resultCount = await Result.countDocuments();

      const topScorers = await Result.aggregate([
        { $group: { _id: "$user", avgScore: { $avg: "$score" } } },
        { $sort: { avgScore: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $project: { _id: 0, username: "$user.username", avgScore: 1 } },
      ]);

      const popularQuizzes = await Result.aggregate([
        { $group: { _id: "$quiz", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
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
        { $project: { _id: 0, title: "$quiz.title", count: 1 } },
      ]);

      const report = {
        userCount,
        quizCount,
        resultCount,
        topScorers,
        popularQuizzes,
      };

      res.json(report);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
  assignTeacherToStudent: async (req, res) => {
    const { studentId, teacherId } = req.body;

    try {
      const student = await User.findById(studentId);
      const teacher = await User.findById(teacherId);

      if (!student || !teacher) {
        return res.status(404).json({ msg: "Student or Teacher not found" });
      }

      // Add teacher ID to the student's teachers array
      if (!student.teachers.includes(teacherId)) {
        student.teachers.push(teacherId);
        await student.save();
        res.json({ msg: "Teacher assigned successfully" });
      } else {
        res
          .status(400)
          .json({ msg: "Teacher is already assigned to this student" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
};

module.exports = AdminControllers;
