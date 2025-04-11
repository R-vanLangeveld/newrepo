'use strict'

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector('#classificationList');
classificationList.addEventListener('change', function () {
	let classification_id = classificationList.value;
	console.log(`classificationId is: ${classification_id}`);
	let classIdURL = `/inv/getInventory/${classification_id}`;
	fetch(classIdURL).then(function (response) {
		if (response.ok) {
			return response.json();
		}
		throw Error('Network response was not OK');
	}).then(function (data) {
		console.log(data);
		buildInventoryList(data);
	}).catch(function (error) {
		let inventoryDisplay = document.getElementById('inventoryDisplay');
		inventoryDisplay.innerHTML = ``;
		console.log('JSON fetch error: ', error.message);
		throw Error('Fetch of JSON data failed.');
	});
});

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
	let inventoryDisplay = document.getElementById('inventoryDisplay');
	let dataTable = '<thead>';
	dataTable += '<tr><th>Vehicle Name</th><th>&nbsp;</th><th>&nbsp;</th></tr>';
	dataTable += '</thead>';
	dataTable += '<tbody>';
	data.forEach(function (element) {
		console.log(`${element.inv_id}, ${element.inv_model}`);
		dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
		dataTable += `<td><a href="/inv/edit/${element.inv_id}" title="Click to update">Modify</a></td>`;
		dataTable += `<td><a href="/inv/delete/${element.inv_id}" title="Click to delete">Delete</a></td></tr>`;
	});
	dataTable += '</tbody>';
	inventoryDisplay.innerHTML = dataTable;
}