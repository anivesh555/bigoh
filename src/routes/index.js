const express = require("express");
const router = express.Router();
const formRouter = require("./../modules/form/route")




router.use("/form", formRouter);




module.exports = router;
