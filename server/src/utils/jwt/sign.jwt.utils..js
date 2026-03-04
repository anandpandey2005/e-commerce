import { jwt } from "jsonwebtoken";

const signToken = (data) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT Signing Failed");
  }

  try {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.error("JWT Signing Failed:", error.message);
    throw new Error("Could not generate authentication token.");
  }
};

export default { signToken };
