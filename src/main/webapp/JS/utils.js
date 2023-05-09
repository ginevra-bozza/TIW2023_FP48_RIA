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
