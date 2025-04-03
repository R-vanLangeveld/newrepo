// Required Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build inventory management view
router.get("/classification", utilities.handleErrors(invController.buildAddNewClassificationView));

// Route to build inventory management view
router.get("/inventory", utilities.handleErrors(invController.buildAddNewVehicleView));

// Route to process new classification request
router.post("/classification", invValidate.addClassificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification));

// Route to process new vehicle request
router.post("/inventory", invValidate.addInventoryRules(), invValidate.checkVehicleData, utilities.handleErrors(invController.addVehicleToInventory));

// Get inventory for AJAX Route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build the view for editing vehicle data
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventoryView));

// Route to process vehicle data edit request
router.post("/update", invValidate.addInventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

// Route to build the view for deleting vehicle data
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteFromInventoryView));

// Route to process vehicle data edit request
router.post("/delete", utilities.handleErrors(invController.deleteFromInventory));

module.exports = router;