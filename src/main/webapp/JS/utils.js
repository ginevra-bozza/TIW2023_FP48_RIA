/**
 * AJAX call management
 */

	function makeCall(method, url, formElement, cback, reset = true) {
		console.log("makeCall on "+method+ " "+url+" "); //debug
	    let req = new XMLHttpRequest(); // visible by closure
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

    productContainer.innerHTML ="";
    productContainer.className = "displayed";

    // build updated list

    table = document.createElement('table');
    productContainer.appendChild(table);
    thead = document.createElement('thead');
    table.appendChild(thead);
    th = document.createElement('th');
    th.textContent = "Id";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Name";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Description";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Category";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Image";
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
    row.appendChild(nameCell);

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

function buildSuppliersList(details) {

  	let suppliersArray = details.suppliers;
    let suppliersContainer = document.getElementById("id_suppliersDetails");
    let suppliersTable, suppliersThead, sTh, suppliersTbody, row;
    let idCell, nameCell, evaluationCell, evaluationSpan, freeShipmentCell, policiesCell,goToCartCell,quantityForm,cartButton,quantityCell, totalCell;
    let quantityInput;
    let cart = sessionStorage.getItem("cart");

    suppliersContainer.innerHTML ="";

    suppliersTable = document.createElement('table');
    suppliersContainer.appendChild(suppliersTable);

    suppliersThead = document.createElement('thead');
    suppliersTable.appendChild(suppliersThead);
    sTh = document.createElement('th');
    sTh.textContent = "Id";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "Supplier name";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "Evaluation";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "Free shipment price";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "Supplier Products";
    suppliersThead.appendChild(sTh);
    sTh = document.createElement('th');
    sTh.textContent = "Shipment info";
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
            evaluationSpan.textContent += `\u2B50`;
        }
        row.appendChild(evaluationCell);

        freeShipmentCell = document.createElement("td");
        freeShipmentCell.textContent = supplier.free_shipment_price;
        row.appendChild(freeShipmentCell);

        quantityCell = document.createElement("td");
        quantityCell.textContent = getQuantityBySupplier(supplier);
        row.appendChild(quantityCell);

        totalCell = document.createElement("td");
        totalCell.textContent = getTotalBySupplier(supplier);
        row.appendChild(totalCell);

        policiesCell = document.createElement("td");
        buildShipmentPolicies(policiesCell, supplier.shipment_policy);
        row.appendChild(policiesCell);

        goToCartCell = document.createElement("td");
        row.appendChild(goToCartCell);

        quantityForm = document.createElement("form");
        goToCartCell.appendChild(quantityForm);

        quantityForm.setAttribute("action" , "#");
        quantityForm.setAttribute("id", "id_quantityForm");

        quantityInput = document.createElement("input");
        quantityInput.setAttribute("placeholder", "Insert quantity");
        quantityInput.setAttribute("type", "number");
        //quantityInput.setAttribute("required min", "1");
        quantityForm.appendChild(quantityInput);

        cartButton = document.createElement("button");
        cartButton.setAttribute("type", "submit");
        cartButton.textContent = "add to cart";
        quantityForm.appendChild(cartButton);

        quantityForm.addEventListener("submit", (e) => {
            if(e.target.elements[0].value  > 0){
                addToCart(details, idCell.textContent, e.target.elements[0].value);
                displayCart();
            }
            else {
                alert("quantity not valid");
            }
        });

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
    th.textContent = "Minimum";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Maximum";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Shipment price";
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