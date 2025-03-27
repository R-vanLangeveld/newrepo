const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

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
		res.status(201).render("account/login", {title: "Login", nav});
	} else {
		req.flash("notice", "Sorry, the registration failed.")
		res.status(501).render("account/registration", {title: "Register", nav});
	}
}

/* ****************************************
* Process Login
**************************************** */
async function logIn(req, res) {
	let nav = await utilities.getNav();
	const { account_email } = req.body;
	
	const regResult = await accountModel.logIn(account_email);

	if (regResult) {
		req.flash("notice", `Hello ${regResult[0].account_firstname}. Thank you for logging in.`);
		res.status(201).render("account/login", {title: "Login", nav});
	} else {
		req.flash("notice", "Sorry, something went wrong while you were logging in.");
		res.status(501).render("account/login", {title: "Login", nav, errors: null});
	}
}

module.exports = { buildLogin, buildRegistration, registerAccount, logIn };