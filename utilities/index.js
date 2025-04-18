const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* **************************
* Constructs the nav HTML unordered list
************************** */
Util.getNav = async function (req, res, next) {
	let data = await invModel.getClassifications();
	let list = '<ul>';
	list += '<li><a href="/" title="Home page">Home</a></li>';
	data.rows.forEach((row) => {
		list += '<li>';
		list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
		list += '</li>';
	});
	list += '</ul>';
	return list;
}

/* **************************************
* Build the classification view HTML
************************************** */
Util.buildClassificationGrid = async function(data){
	let grid;
	if(data.length > 0){
		grid = '<ul id="inv-display">';
		data.forEach(vehicle => { 
			grid += '<li>';
			grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"></a>`;
			grid += '<div class="namePrice">';
			grid += '<hr>';
			grid += '<h2>';
			grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a>`;
			grid += '</h2>';
			grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
			grid += '</div>';
			grid += '</li>';
		});
		grid += '</ul>';
	} else { 
		grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
	};
	return grid;
}

/* **************************************
* Build the detail view HTML
************************************** */
Util.buildDetailPage = async function(data){
	let details;
	data.forEach(info => {
		details = '<div class="padding">';
		details += '<picture class="inv_image">';
		details += `<source media="(min-width: 300px)" srcset="${info.inv_image}">`;
		details += `<img src="${info.inv_image}" alt="Image of a ${info.inv_color} ${info.inv_make} ${info.inv_model}">`;
		details += '</picture>';
		details += '<section>';
		details += `<h2>${info.inv_make} ${info.inv_model} Details</h2>`;
		details += `<p><b>Price: $${new Intl.NumberFormat('en-US').format(info.inv_price)}</b></p>`;
		details += `<p><b>Description:</b> ${info.inv_description}</p>`;
		details += `<p><b>Color:</b> ${info.inv_color}</p>`;
		details += `<p><b>Miles:</b> ${new Intl.NumberFormat('en-US').format(info.inv_miles)}</p>`;
		details += '</section>';
		details += '</div>';
	});
	return details;
}

/* **************************************
* Build the dynamic drop-down list for the add-inventory view
************************************** */
Util.buildClassificationList = async function (classification_id = null) {
	let data = await invModel.getClassifications();
	let classificationList = '<select name="classification_id" id="classificationList" required>';
	classificationList += '<option value="">Choose a Classification</option>';
	data.rows.forEach((row) => {
		classificationList += `<option value="${row.classification_id}" id="${row.classification_id}"`;
		if (classification_id != null && row.classification_id == classification_id) {
			classificationList += ' selected';
		}
		classificationList += `>${row.classification_name}</option>`;
	});
	classificationList += '</select>';
	return classificationList;
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
	if (req.cookies.jwt) {
		jwt.verify(
			req.cookies.jwt,
			process.env.ACCESS_TOKEN_SECRET,
			function (err, accountData) {
				if (err) {
					req.flash("Please log in");
					res.clearCookie("jwt");
					res.locals.loggedin = 0;
					return res.redirect("/account/login");
				}
				res.locals.accountData = accountData;
				res.locals.loggedin = 1;
				next();
			}
		);
	} else {
		next();
	}
}

/* ****************************************
* Check Login
**************************************** */
Util.checkLogin = (req, res, next) => {
	if (res.locals.loggedin) {
		next();
	} else {
		req.flash("notice", "Please log in.");
		return res.redirect("/account/login");
	}
}

/* ****************************************
* Check Account Type
**************************************** */
Util.checkAccountType = (req, res, next) => {
	if (req.cookies.jwt) {
		jwt.verify(
			req.cookies.jwt,
			process.env.ACCESS_TOKEN_SECRET,
			function (err, accountData) {
				if (err) {
					req.flash("Please log in");
					return res.redirect("/account/login");
				}
				res.locals.accountData = accountData;
				if (accountData.account_type != "Client") {
					next();
				} else {
					req.flash("Please log in");
					return res.redirect("/account/login");
				}
			}
		);
	} else {
		req.flash("Please log in");
		return res.redirect("/account/login");
	}
}

/* ****************************************
* Build Employee Table
**************************************** */
Util.buildEmployeeTable = async function (req, res, next) {
	let data = await accountModel.getNonClients();
	let dataTable = '<thead>';
	dataTable += '<tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Account Type</th></tr>';
	dataTable += '</thead>';
	dataTable += '<tbody>';
	data.rows.forEach(function (element) {
		dataTable += `<tr><td>${element.account_firstname}</td>`;
		dataTable += `<td>${element.account_lastname}</td>`;
		dataTable += `<td>${element.account_email}</td>`;
		dataTable += `<td>${element.account_type}</td></tr>`;
	});
	dataTable += '</tbody>';
	return dataTable;
}

/* ****************************************
* Build Client Table
**************************************** */
Util.buildClientTable = async function (req, res, next) {
	let data = await accountModel.getClients();
	let dataTable = '<thead>';
	dataTable += '<tr><th>First Name</th><th>Last Name</th><th>Email</th></tr>';
	dataTable += '</thead>';
	dataTable += '<tbody>';
	data.rows.forEach(function (element) {
		dataTable += `<tr><td>${element.account_firstname}</td>`;
		dataTable += `<td>${element.account_lastname}</td>`;
		dataTable += `<td>${element.account_email}</td></tr>`;
	});
	dataTable += '</tbody>';
	return dataTable;
}

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;