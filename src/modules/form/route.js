const express = require("express");
const router = express.Router();

const controller = require("./controller")

router.post("/create", controller.createForm);
router.post("/fill_data", controller.fillFormData);
router.get("/fill_data", controller.getFormData);



module.exports = router;