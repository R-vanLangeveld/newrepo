const pool = require("../database/");

/* ***************************
*  Get all classification data
*************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
*  Get all inventory items and classification_name by classification_id
*************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
    `SELECT * FROM public.inventory AS i 
    JOIN public.classification AS c 
    ON i.classification_id = c.classification_id 
    WHERE i.classification_id = $1`,
    [classification_id]);
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
*  Get the required inventory item by inv_id
*************************** */
async function getVehicleDataByInventoryId(inv_id) {
  try {
    const data = await pool.query(
    `SELECT * from public.inventory
    WHERE inv_id = $1`,
    [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("getvehicledatabyinventoryid error " + error);
  }
}

/* *****************************
* Add new classification
***************************** */
async function addNewClassification(classification_name) {
	try {
		const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
		return await pool.query(sql, [classification_name]);
	} catch (error) {
		return error.message;
	}
}

/* *****************************
* Add new vehicle
***************************** */
async function addNewVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
	try {
		const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
		return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]);
	} catch (error) {
		return error.message;
	}
}

/* **********************
* Check for existing classification
********************** */
async function checkExistingClassification(classification_name) {
	try {
		const sql = "SELECT * FROM classification WHERE classification_name = $1"
		const classification = await pool.query(sql, [classification_name]);
		return classification.rowCount;
	} catch (error) {
		return error.message;
	}
}

/* *****************************
* Update vehicle
***************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
	try {
		const sql = "UPDATE inventory SET classification_id = $1, inv_make = $2, inv_model = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_year = $8, inv_miles = $9, inv_color = $10 WHERE inv_id = $11 RETURNING *"
		const data = await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id]);
    return data.rows[0];
	} catch (error) {
		console.error(`model error: ${error}`);
	}
}

/* *****************************
* Delete vehicle
***************************** */
async function deleteFromInventory(inv_id) {
	try {
		const sql = "DELETE FROM inventory WHERE inv_id = $1"
		const data = await pool.query(sql, [inv_id]);
    return data;
	} catch (error) {
		new Error("Delete Inventory Error");
	}
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleDataByInventoryId, addNewClassification, addNewVehicle, checkExistingClassification, updateInventory, deleteFromInventory };