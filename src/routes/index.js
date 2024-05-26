const express = require("express");
const router = express.Router();
const formRouter = require("./../modules/form/route")
// const userRouter = require("./../modules/users/route")


router.use("/form", formRouter);
// router.use("/user", userRouter);





module.exports = router;
