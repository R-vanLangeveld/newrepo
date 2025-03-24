const invModel = require("../models/inventory-model");
const Util = {};

/* **************************
* Constructs the nav HTML unordered list
************************** */
Util.getNav = async function (req, res, next) {
	let data = await invModel.getClassifications();
	let list = "<ul>";
	list += '<li><a href="/" title="Home page">Home</a></li>';
	data.rows.forEach((row) => {
		list += "<li>";
		list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
		list += "</li>";
	});
	list += "</ul>";
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
		grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
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
		details += `<picture class="inv_image">`;
		details += `<source media="(min-width: 300px)" srcset="${info.inv_image}">`;
		details += `<img src="${info.inv_image}" alt="Image of a ${info.inv_color} ${info.inv_make} ${info.inv_model}">`;
		details += `</picture>`;
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

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;