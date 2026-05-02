import jwt from "jsonwebtoken";
import User from "../Model/users.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found"
      });
    }

    req.user = { id: user._id, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token"
    });
  }
};
