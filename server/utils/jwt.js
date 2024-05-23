const jwt = require("jsonwebtoken");
const env = require("../config/env.config");

// Create a token
const createToken = async (payload) => {
  const token = await jwt.sign(payload, env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const createVerifyToken = async (payload) => {
  const verifyToken = await jwt.sign(payload, env.VERIFY_EMAIL_SECRET_KEY, {
    expiresIn: "7d",
  });
  return verifyToken;
};

module.exports = { createToken, createVerifyToken };
