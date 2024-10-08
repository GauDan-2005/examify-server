const User = require("../models/userModel");

module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "teacher" && user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Access denied. Teacher or Admin only." });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
