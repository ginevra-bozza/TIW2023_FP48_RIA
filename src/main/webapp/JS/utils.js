/**
 * AJAX call management
 */

	function makeCall(method, url, formElement, cback, reset = true) {
		console.log("makeCall on "+method+ " "+url+" "); //debug
	    var req = new XMLHttpRequest(); // visible by closure
	    req.onreadystatechange = function() {
	      cback(req)
	    }; // closure
	    req.open(method, url);
	    if (formElement == null) {
	      req.send();
	    } else {
	      req.send(new FormData(formElement));
	    }
	    if (formElement !== null && reset === true) {
	      formElement.reset();
	    }
	  }

    function doRequest(url, method, callback, form = null) {
        console.log("makeCall on "+method+ " "+url+" "); //debug
        console.log(form);
        var request = new XMLHttpRequest();
        request.onreadystatechange = () => callback(request);
        request.open(method, url);
        if (form == null) {
            request.send();
        } else {
            var fd = new FormData(form);
            request.send(fd);
        }
    }
	  
function linkButton(id, cb) {
 	 	var button = document.getElementById(id);
  		button.addEventListener('click', (e) => {
    	e.preventDefault();
    	cb();
  });
}

function buildProduct(product) {

    let table, thead, row, idCell, nameCell, descriptionCell, categoryCell, imageCell, th, tbody, div, productImg ;
    let productContainer = document.getElementById("id_productDetails");
    productContainer.className = "displayed";

    // build updated list

    table = document.createElement('table');
    productContainer.appendChild(table);
    thead = document.createElement('thead');
    table.appendChild(thead);
    th = document.createElement('th');
    th.textContent = "id";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "name";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "description";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "category";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "image";
    thead.appendChild(th);
    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    row = document.createElement("tr");
    tbody.appendChild(row);

    idCell = document.createElement("td");
    idCell.textContent = product.id;
    row.appendChild(idCell);

    nameCell = document.createElement("td");
    nameCell.textContent = product.name;
    row.appendChild(idCell);

    descriptionCell = document.createElement("td");
    descriptionCell.textContent = product.description;
    row.appendChild(descriptionCell);

    categoryCell = document.createElement("td");
    categoryCell.textContent = product.category;
    row.appendChild(categoryCell);

    imageCell = document.createElement("td");
    div = document.createElement("div");
    imageCell.appendChild(div);
    productImg = document.createElement("img");
    productImg.src = "."+product['image'];
    div.appendChild(productImg);

    row.appendChild(imageCell);


}

function buildSuppliersList(suppliersArray) {

    let suppliersContainer = document.getElementById("id_suppliersDetails");
    let suppliersTable, suppliersThead, sTh, suppliersTbody, row;
    let idCell, nameCell, evaluationCell, evaluationSpan, freeShipmentCell, policiesCell;

    suppliersTable = document.createElement('table');
    suppliersContainer.appendChild(suppliersTable);

    suppliersThead = document.createElement('thead');
    suppliersTable.appendChild(suppliersThead);
    sTh = document.createElement('th');
    sTh.textContent = "id";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "supplier name";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "evaluation";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "free shipment price";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "shipment info";
    suppliersThead.appendChild(sTh);


    suppliersTbody = document.createElement('tbody');
    suppliersTable.appendChild(suppliersTbody);


    suppliersArray.forEach(function (supplier) {
        row = document.createElement("tr");
        suppliersTbody.appendChild(row);

        idCell = document.createElement("td");
        idCell.textContent = supplier.supplier_id;
        row.appendChild(idCell);

        nameCell = document.createElement("td");
        nameCell.textContent = supplier.supplier_name;
        row.appendChild(nameCell);

        evaluationCell =  document.createElement("td");
        evaluationSpan = document.createElement("span");
        evaluationCell.appendChild(evaluationSpan);

        for (let i = 0; i < supplier.evaluation ; i++) {
            evaluationSpan.textContent += "&#x2605";
        }
        row.appendChild(evaluationCell);

        freeShipmentCell = document.createElement("td");
        freeShipmentCell.textContent = supplier.free_shipment_price;
        row.appendChild(freeShipmentCell);

        policiesCell = document.createElement("td");
        buildShipmentPolicies(policiesCell, supplier.shipment_policy);
        row.appendChild(policiesCell);
    });
}

function buildShipmentPolicies(listContainer, policiesArray){
    let policiesTable, thead, th, tbody, row;
    let minimumCell, maximumCell, priceCell;

    policiesTable = document.createElement('table');
    listContainer.appendChild(policiesTable);

    thead = document.createElement('thead');
    policiesTable.appendChild(thead);
    th = document.createElement('th');
    th.textContent = "minimum";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "maximum";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "shipment price";
    thead.appendChild(th);

    tbody = document.createElement('tbody');
    policiesTable.appendChild(tbody);

    policiesArray.forEach(function (shipment_policy) {
        row = document.createElement("tr");
        tbody.appendChild(row);

        minimumCell = document.createElement("td");
        minimumCell.textContent = shipment_policy.minimum;
        row.appendChild(minimumCell);

        maximumCell = document.createElement("td");
        maximumCell.textContent = shipment_policy.maximum;
        row.appendChild(maximumCell);

        priceCell = document.createElement("td");
        priceCell.textContent = shipment_policy.shipment_price;
        row.appendChild(priceCell);
    })

}