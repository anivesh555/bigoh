const express = require("express");
const router = express.Router();
const {sendEmail} = require("../../utilities/email")
const nodemailer = require("nodemailer");

const {
  registerUser,
  login,
  logout,
//   renewToken,
//   getAccount,
//   getAllUsers,
//   updateUser,
} = require("./controller");
const {
  verifyToken,
  verifyTokenAndAuthorize,
} = require("../../middleware/auth");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);



module.exports = router;
