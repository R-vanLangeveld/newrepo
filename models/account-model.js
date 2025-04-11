const pool = require("../database/");

/* *****************************
* Register new account
***************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
	try {
		return await pool.query("INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *", [account_firstname, account_lastname, account_email, account_password]);
	} catch (error) {
		return error.message;
	}
}

/* **********************
* Check for existing email
********************** */
async function checkExistingEmail(account_email) {
	try {
		const email = await pool.query("SELECT * FROM account WHERE account_email = $1", [account_email]);
		return email.rowCount;
	} catch (error) {
		return error.message;
	}
}

/* ********************************************
* Gets account information using account_email
******************************************** */
async function getAccountByEmail(account_email) {
	try {
		const account = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1", [account_email]);
		return account.rows[0];
	} catch (error) {
		return new Error("No matching email found");
	}
}

/* ********************************************
* Gets account information using account_id
******************************************** */
async function getAccountById(account_id) {
	try {
		const account = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1", [account_id]);
		return account.rows[0];
	} catch (error) {
		return error.message;
	}
}

/* ********************************************
* Update account information
******************************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
	try {
		const account = await pool.query("UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *", [account_firstname, account_lastname, account_email, account_id]);
		return account.rows[0];
	} catch (error) {
		return error.message;
	}
}

/* ********************************************
* Update account password
******************************************** */
async function updateAccountPassword(account_id, account_password) {
	try {
		const account = await pool.query("UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *", [account_password, account_id]);
		return account.rows[0];
	} catch (error) {
		return error.message;
	}
}

/* ********************************************
* Get All Non Client Accounts
******************************************** */
async function getNonClients() {
	return await pool.query("SELECT account_firstname, account_lastname, account_email, account_type FROM account WHERE account_type <> 'Client' ORDER BY account_type DESC");
}

/* ********************************************
* Get All Client Accounts
******************************************** */
async function getClients() {
	return await pool.query("SELECT account_firstname, account_lastname, account_email FROM account WHERE account_type = 'Client'");
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountInfo, updateAccountPassword, getNonClients, getClients };