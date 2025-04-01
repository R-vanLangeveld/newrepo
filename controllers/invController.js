const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
*  Build inventory by classification view
*************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  });
}

/* ***************************
*  Build detail view
*************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getVehicleDataByInventoryId(inv_id);
  const details = await utilities.buildDetailPage(data);
  let nav = await utilities.getNav();
  res.render("inventory/detail", {
    title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
    nav,
    details
  });
}

/* ***************************
*  Build management view
*************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {title: "Vehicle Management", nav, errors: null});
}

/* ***************************
*  Build new classification view
*************************** */
invCont.buildAddNewClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {title: "New Classification", nav, errors: null});
}

/* ****************************************
* Add classification
**************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  
  const regResult = await invModel.addNewClassification(
    classification_name
  );

  if (regResult) {
    req.flash("notice", `${classification_name} has been added`);
    res.status(201).render("inventory/management", {title: "Vehicle Management", nav});
  } else {
    req.flash("notice", "Sorry, the classification couldn't be added.")
    res.status(501).render("inventory/classification", {title: "New Classification", nav});
  }
}

/* ***************************
*  Build new vehicle view
*************************** */
invCont.buildAddNewVehicleView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-inventory", {title: "New Vehicle", nav, errors: null, classificationList: await utilities.buildClassificationList()});
}

/* ****************************************
* Add vehicle
**************************************** */
invCont.addVehicleToInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
  
  const regResult = await invModel.addNewVehicle(
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  );

  if (regResult) {
    req.flash("notice", `${inv_make} ${inv_model} has been added to the inventory`);
    res.status(201).render("inventory/management", {title: "Vehicle Management", nav});
  } else {
    req.flash("notice", "Sorry, the vehicle couldn't be added.")
    res.status(501).render("inventory/inventory", {title: "New Vehicle", nav, classificationList: await utilities.buildClassificationList()});
  }
}

module.exports = invCont;