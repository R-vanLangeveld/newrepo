// Required Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

module.exports = router;