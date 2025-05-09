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
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin));

// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagementView));

// Route to build account update view
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// Route to process account data update
router.post("/update/a", regValidate.checkRegData, utilities.handleErrors(accountController.updateAccountInfo));

// Route to process account password update
router.post("/update/p", regValidate.checkLoginData, utilities.handleErrors(accountController.updateAccountPassword));

// Route to build account tables view
router.get("/accounts", utilities.checkAccountType, utilities.handleErrors(accountController.buildAccountsView));

module.exports = router;