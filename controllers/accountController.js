const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
* Deliver login view
**************************************** */
async function buildLogin(req, res, next) {
	let nav = await utilities.getNav();
	res.render("account/login", {title: "Login", nav, errors: null});
}

/* ****************************************
* Deliver registration view
**************************************** */
async function buildRegistration(req, res, next) {
	let nav = await utilities.getNav();
	res.render("account/registration", {title: "Register", nav, errors: null});
}

/* ****************************************
* Process Registration
**************************************** */
async function registerAccount(req, res) {
	let nav = await utilities.getNav();
	const { account_firstname, account_lastname, account_email, account_password } = req.body;
	
	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hashSync(account_password, 10);
	} catch (error) {
		req.flash("notice", "Sorry, there was an error processing the registration.");
		res.status(500).render("account/registration", {title: "Register", nav, errors: null});
	}

	const regResult = await accountModel.registerAccount(
		account_firstname,
		account_lastname,
		account_email,
		hashedPassword
	);

	if (regResult) {
		req.flash("notice", `Thank you ${account_firstname} for registering. Please log in.`);
		res.status(201).render("account/login", {title: "Login", nav, errors: null});
	} else {
		req.flash("notice", "Sorry, the registration failed.")
		res.status(501).render("account/registration", {title: "Register", nav});
	}
}

/* ****************************************
* Process Login
**************************************** */
async function accountLogin(req, res) {
	let nav = await utilities.getNav();
	const { account_email, account_password } = req.body;
	const accountData = await accountModel.getAccountByEmail(account_email);
	if (!accountData) {
		req.flash("notice", "Please check your credentials and try again.");
		res.status(400).render("account/login", {title: "Login", nav, errors: null, account_email});
		return
	}
	try {
		if (await bcrypt.compare(account_password, accountData.account_password)) {
			delete accountData.account_password;
			const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000 });
			if (process.env.NODE_ENV === "development") {
				res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
			} else {
				res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
			}
			return res.redirect("/account/");
		} else {
			req.flash("message notice", "Please check your credentials and try again.");
			res.status(400).render("account/login", {title: "Login", nav, errors: null, account_email});
		}
	} catch (error) {
		throw new Error("Access Forbidden");
	}
}

/* ****************************************
* Deliver account management view
**************************************** */
async function buildManagementView(req, res, next) {
	let nav = await utilities.getNav();
	res.render("account/management", {title: "Account Management", nav, errors: null});
}

/* ****************************************
* Deliver Update Account view
**************************************** */
async function buildUpdateAccount(req, res, next) {
	let nav = await utilities.getNav();
	
  const account_id = parseInt(req.params.account_id);
	const accountInfo = await accountModel.getAccountById(account_id);
	
	res.render("account/update", {title: "Edit Account", nav, errors: null, account_id: accountInfo[0].account_id, account_firstname: accountInfo[0].account_firstname, account_lastname: accountInfo[0].account_lastname, account_email: accountInfo[0].account_email});
}

/* ****************************************
* Process Account Info Update
**************************************** */
async function updateAccountInfo(req, res) {
	let nav = await utilities.getNav();
	const { account_id, account_firstname, account_lastname, account_email } = req.body;
	
	const updateResult = await accountModel.updateAccountInfo(
		account_id, 
		account_firstname, 
		account_lastname, 
		account_email
	);

	const accountData = await accountModel.getAccountById(account_id);
	if (accountData) {
		try {
			delete accountData.account_password;
			const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000 });
			if (process.env.NODE_ENV === "development") {
				res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
			} else {
				res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
			}
		} catch (error) {
			console.log(error);
		}
		req.flash("notice", "Your account has been updated.");
		res.render("account/management", {title: "Account Management", nav, errors: null});
	} else {
		req.flash("notice", "Sorry, the update failed.")
		res.status(501).render("account/update", {title: "Edit Account", nav});
	}
}

/* ****************************************
* Process Password Update
**************************************** */
async function updateAccountPassword(req, res) {
	let nav = await utilities.getNav();
	const { account_id, account_password } = req.body;

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hashSync(account_password, 10);
	} catch (error) {
		req.flash("notice", "Sorry, there was a processing error.");
		res.status(500).render("account/update", {title: "Edit Account", nav, errors: null});
	}

	const updateResult = await accountModel.updateAccountPassword(account_id, hashedPassword);

	if (updateResult) {
		const accountData = await accountModel.getAccountById(account_id);
		try {
			delete accountData.account_password;
			const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000 });
			if (process.env.NODE_ENV === "development") {
				res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
			} else {
				res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
			}
		} catch (error) {
			console.log(error);
		}
		req.flash("notice", "Your account has been updated.");
		res.render("account/management", {title: "Account Management", nav, errors: null});
	} else {
		req.flash("notice", "Sorry, the update failed.")
		res.status(501).render("account/update", {title: "Edit Account", nav});
	}
}

/* ****************************************
* Deliver account list view
**************************************** */
async function buildAccountsView(req, res, next) {
	let nav = await utilities.getNav();
	const employees = await utilities.buildEmployeeTable();
	const clients = await utilities.buildClientTable();
	res.render("account/account-list", {title: "Accounts", nav, errors: null, employees, clients});
}

module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildManagementView, buildUpdateAccount, updateAccountInfo, updateAccountPassword, buildAccountsView };