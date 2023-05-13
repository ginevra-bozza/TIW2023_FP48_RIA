function executeOrder(param){
    let list_container = document.getElementById("id_pageContainer")
        let self = this; //Important!
        console.log(param);
        doRequest('Orders' + param, "POST", // callback function
            function (req) {
                if (req.readyState === XMLHttpRequest.DONE) { // == 4
                    if (req.status === 200) {
                        document.getElementById('id_pageContainer').innerHTML = '';
                        let orderToShow = JSON.parse(req.responseText);

                        if (orderToShow.length === 0) {
                            let emptyOrders = document.createElement("p");
                            emptyOrders.textContent = "No orders";

                        }else {

                        }
                    } else {
                        // request failed, handle it
                        list_container.className = "masked";
                        alert("Not possible to recover data"); //for demo purposes
                    }
                }
            });

}


function buildOrdersList(order) {

    let table, thead, row, idCell, totalCell, supplierNameCell, addressCell, imageCell, th, tbody, div, productImg;
    let productContainer = document.getElementById("id_pageContainer");
    productContainer.className = "displayed";

    // build updated list
    table = document.createElement('table');
    productContainer.appendChild(table);
    thead = document.createElement('thead');
    table.appendChild(thead);
    th = document.createElement('th');
    th.textContent = "Order Id";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Total";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Supplier name";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Shipment address";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Shipment date";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Products";
    thead.appendChild(th);

    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    row = document.createElement("tr");
    tbody.appendChild(row);

    idCell = document.createElement("td");
    idCell.textContent = order.order_id;
    row.appendChild(idCell);

    totalCell = document.createElement("td");
    totalCell.textContent = order.total;
    row.appendChild(totalCell);

    supplierNameCell = document.createElement("td");
    supplierNameCell.textContent = order.supplier_name;
    row.appendChild(supplierNameCell);

    addressCell = document.createElement("td");
    addressCell.textContent = order.shipment_address;
    row.appendChild(addressCell);

    dateCell = document.createElement("td");
    dateCell.textContent = order.shipment_date;
    row.appendChild(dateCell);

    
    row.appendChild(thead);
    th = document.createElement('th');
    th.textContent = "Order Id";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Total";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Supplier name";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Shipment address";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Shipment date";
    thead.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Products";
    thead.appendChild(th);


    order.products.forEach(function (product) {
        row = document.createElement("tr");

        suppliersTbody.appendChild(row);

        idCell = document.createElement("td");
        idCell.textContent = product.supplier_id;
        row.appendChild(idCell);

        nameCell = document.createElement("td");
        nameCell.textContent = product.supplier_name;
        row.appendChild(nameCell);

        priceCell = document.createElement("td");
        priceCell.textContent = product.price;
        row.appendChild(priceCell);

        evaluationCell = document.createElement("td");
        evaluationSpan = document.createElement("span");
        evaluationCell.appendChild(evaluationSpan);

}

