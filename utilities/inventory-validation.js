const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

/* ***********************************
* Vehicle Data Validation Rules
*********************************** */
validate.addInventoryRules = () => {

	return [
		body("classification_id").trim().escape().notEmpty().withMessage("Please provide a classification."),

		body("inv_make").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Please provide a make."),

		body("inv_model").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Please provide a model."),

		body("inv_description").trim().escape().notEmpty().withMessage("Please provide a description."),

		body("inv_image").trim().notEmpty().withMessage("Please provide a valid image path."),

		body("inv_thumbnail").trim().notEmpty().withMessage("Please provide a valid thumbnail image path."),

		body("inv_price").trim().escape().notEmpty().withMessage("Please provide a price."),

		body("inv_year").trim().escape().notEmpty().isLength({ min: 4, max: 4 }).withMessage("Please provide a year."),

		body("inv_miles").trim().escape().notEmpty().withMessage("Please provide miles."),

		body("inv_color").trim().escape().notEmpty().withMessage("Please provide a color.")
	]
}

/* ***********************************
* Classification Data Validation Rules
*********************************** */
validate.addClassificationRules = () => {
	return [
		body("classification_name").trim().escape().notEmpty().isEmail().normalizeEmail().withMessage("A valid classification name is required.").custom(async (classification_name) => {
			const classificationExists = await invModel.checkExistingClassification(classification_name);
			if (classificationExists) {
				throw new Error("That classification already exists.");
			}
		})
	]
}

/* ******************************
* Check data and return errors or continue to add new vehicle
****************************** */
validate.checkVehicleData = async (req, res, next) => {
	const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		res.render("inventory/add-inventory", {errors, title: "New Vehicle", nav, classificationList: await utilities.buildClassificationList(), classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color});
		return
	}
	next();
}

/* ******************************
* Check data and return errors or continue to add new classification
****************************** */
validate.checkClassificationData = async (req, res, next) => {
	const { classification_name } = req.body;
	let errors = [];
	errors = validationResult(req);
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav();
		res.render("inventory/add-classification", {errors, title: "New Classification", nav, classification_name});
		return
	}
	next();
}

module.exports = validate;