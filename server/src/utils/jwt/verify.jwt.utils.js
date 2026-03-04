import { jwt } from "jsonwebtoken";

const verifyToken = (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("Internal Server Error: key is missing");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token has expired. Please log in again.");
    }
    if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid token signature.");
    }

    throw new Error("Authentication failed.");
  }
};

export default { verifyToken };
