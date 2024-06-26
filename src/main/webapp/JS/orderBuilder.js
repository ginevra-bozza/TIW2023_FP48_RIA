/**
 * This function is called when the order button is clicked, calls the server
 * and sends the JSON string of the order for that supplier
 * @param param is the JSON string produced in displayCartBySupplier
 */
function executeOrder(param) {
    let list_container = document.getElementById("id_pageContainer")

    doRequest('Orders' + param, "POST", // callback function
        function (req) {
            if (req.readyState === XMLHttpRequest.DONE) { // == 4
                if (req.status === 200) {
                    document.getElementById('id_pageContainer').innerHTML = '';
                    console.log("DATA FROM SERVER: " + req.responseText);
                    sessionStorage.setItem("order", req.responseText);
                    let orderToShow = JSON.parse(req.responseText);

                    if (orderToShow.length === 0) {
                        let emptyOrders = document.createElement("p");
                        emptyOrders.textContent = "No orders";

                    } else {
                        console.log(orderToShow);
                        buildOrdersList(orderToShow);
                        removeFromCart();
                    }
                } else if (req.status === 400) {
                    let errorMessage = document.createElement("p");
                    errorMessage.textContent = req.responseText;
                } else {
                    // request failed, handle it
                    list_container.className = "masked";
                    alert("Not possible to recover data"); //for demo purposes
                }
            }
        });
}

/**
 * This function create a table of the orders from the JSON file received from the server
 * @param order
 */

function buildOrdersList(order) {
    document.getElementById('goHomeLink').className = "";
    document.getElementById('goOrdersLink').className = "active";
    document.getElementById('goCartLink').className = "";
    let table, thead, row, idCell, totalCell, supplierNameCell, addressCell, dateCell, th, tbody;
    let resultContainer = document.getElementById("id_pageContainer");
    let cartContainer = document.getElementById("id_cartContainer");
    cartContainer.className = "masked";
    resultContainer.innerHTML = "";
    resultContainer.className = "displayed";


    // build updated list
    table = document.createElement('table');
    resultContainer.appendChild(table);
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

    for (let i = 0; i < order.length; i++){
    row = document.createElement("tr");
    tbody.appendChild(row);

    idCell = document.createElement("td");
    idCell.textContent = order[i].order_id;
    row.appendChild(idCell);

    totalCell = document.createElement("td");
    totalCell.textContent = order[i].total;
    row.appendChild(totalCell);

    supplierNameCell = document.createElement("td");
    supplierNameCell.textContent = order[i].supplier_name;
    row.appendChild(supplierNameCell);

    addressCell = document.createElement("td");
    addressCell.textContent = order[i].shipment_address;
    row.appendChild(addressCell);

    dateCell = document.createElement("td");
    dateCell.textContent = order[i].shipment_date;
    row.appendChild(dateCell);

    let insideTable, insideThead, insideTh, insideTbody, insideRow, nameCell, priceCell, quantityCell;

    insideTable = document.createElement("table");
    row.appendChild(insideTable);

    insideThead = document.createElement("thead");
    insideTable.appendChild(insideThead);

    insideTh = document.createElement('th');
    insideTh.textContent = "Product name";
    insideThead.appendChild(insideTh);
    insideTh = document.createElement('th');
    insideTh.textContent = "category";
    insideThead.appendChild(insideTh);
    insideTh = document.createElement('th');
    insideTh.textContent = "Price (€)";
    insideThead.appendChild(insideTh);
    insideTh = document.createElement('th');
    insideTh.textContent = "Quantity";
    insideThead.appendChild(insideTh);

    insideTbody = document.createElement("tbody");
    insideTable.appendChild(insideTbody)


        for (let j = 0; j < order[i].products.length; j++) {
            insideRow = document.createElement("tr");

            insideTbody.appendChild(insideRow);

            idCell = document.createElement("td");
            idCell.textContent = order[i].products[j].name;
            insideRow.appendChild(idCell);

            nameCell = document.createElement("td");
            nameCell.textContent = order[i].products[j].category;
            insideRow.appendChild(nameCell);

            priceCell = document.createElement("td");
            priceCell.textContent = order[i].products[j].price;
            insideRow.appendChild(priceCell);

            quantityCell = document.createElement("td");
            quantityCell.textContent = order[i].products[j].quantity;
            insideRow.appendChild(quantityCell);
        }
    }
}

/**
 * This method is called when the user clicks on the Orders button in the menu, it calls the server to get the list of orders
 * for the specific user. If no order is present, shows a message
 */
    function displayOrders(){

       let ordersContainer = document.getElementById("id_pageContainer");
       ordersContainer.className = "displayed";
       let orders = JSON.parse(sessionStorage.getItem("order"));
       let emptyOrdersMessage;

        if(orders === undefined || orders === null || orders.length <= 0){
            doRequest('Orders', "GET", // callback function
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) { // == 4
                        if (req.status === 200) {
                            ordersContainer.innerHTML = '';
                            let orderToShow = JSON.parse(req.responseText);
                            sessionStorage.setItem("order", req.responseText);
                            buildOrdersList(orderToShow);

                        } else if (req.status === 204) {
                            emptyOrdersMessage = document.createElement("p");
                            emptyOrdersMessage.textContent = "No orders";
                            ordersContainer.innerHTML = '';
                            ordersContainer.appendChild(emptyOrdersMessage);

                        } else {
                            // request failed, handle it
                            ordersContainer.className = "masked";
                            alert("Not possible to recover data"); //for demo purposes
                        }
                    }
                });

        } else {
            buildOrdersList(orders);
        }

    }

