const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = 10; // Số vòng lặp để tạo salt
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};
module.exports = { hashPassword, comparePassword };
