// Required Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));

// Route to process registration
router.post("/registration", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));

// Route to process login
router.post("/login", regValidate.loginRules(), regValidate.checkRegDataLogin, utilities.handleErrors(accountController.logIn));

module.exports = router;