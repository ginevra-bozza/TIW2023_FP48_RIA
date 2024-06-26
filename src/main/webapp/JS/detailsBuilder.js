{
    /**
     * Build a table with product details
     * @param product
     */
    function buildProduct(product) {

        let table, thead, row, idCell, nameCell, descriptionCell, categoryCell, imageCell, th, tbody, div, productImg;
        let productContainer = document.getElementById("id_productDetails");

        productContainer.innerHTML = "";
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
        productImg.src = "." + product['image'];
        div.appendChild(productImg);
        row.appendChild(imageCell);
    }

    /**
     * Build a table that represent the product details by his supplier
     * @param details
     */
    function buildSuppliersList(details) {
        let totalQuantity = 0;
        let totalValue = 0;

        let suppliersArray = details.suppliers;
        let suppliersContainer = document.getElementById("id_suppliersDetails");
        let suppliersTable, suppliersThead, sTh, suppliersTbody, row;
        let idCell, nameCell, priceCell, evaluationCell, evaluationSpan, freeShipmentCell, policiesCell, goToCartCell,
            quantityForm, cartButton, quantityCell, totalCell;
        let quantityInput;

        suppliersContainer.innerHTML = "";

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
        sTh = document.createElement("th");
        sTh.textContent = "Price";
        suppliersThead.appendChild(sTh);
        sTh = document.createElement('th');
        sTh.textContent = "Evaluation";
        suppliersThead.appendChild(sTh);
        sTh = document.createElement('th');
        sTh.textContent = "Free shipment price";
        suppliersThead.appendChild(sTh);
        sTh = document.createElement('th');
        sTh.textContent = "Products in cart";
        suppliersThead.appendChild(sTh);
        sTh = document.createElement('th');
        sTh.textContent = "Total";
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

            priceCell = document.createElement("td");
            priceCell.textContent = supplier.price;
            row.appendChild(priceCell);

            evaluationCell = document.createElement("td");
            evaluationSpan = document.createElement("span");
            evaluationCell.appendChild(evaluationSpan);

            for (let i = 0; i < supplier.evaluation; i++) {
                evaluationSpan.textContent += `\u2B50`;
            }
            row.appendChild(evaluationCell);

            freeShipmentCell = document.createElement("td");
            freeShipmentCell.textContent = supplier.free_shipment_price;
            row.appendChild(freeShipmentCell);

            let cart = getCartFromSession();
            let supplierFromCart;
            let checkSupplier = false; //check if the supplier has already products in the cart

            cart.forEach(function (s){
                if(idCell.textContent == s.supplier_id){
                    supplierFromCart = s;
                    checkSupplier = true;
                }
            });
            if(checkSupplier){
                totalQuantity = supplierFromCart.totalQuantity;
                totalValue = supplierFromCart.totalValue;
            } else {
                totalQuantity = 0;
                totalValue = 0;
            }

            quantityCell = document.createElement("td");
            quantityCell.textContent = totalQuantity;
            quantityCell.id = "popup"

            quantityCell.addEventListener("mouseover", (e) => {
                let cartPopup = document.getElementById("id_single_Cart_popUp");
                let cartContentPopup = document.getElementById("id_cart_content");
                cartContentPopup.innerHTML = "";
                let supplier_id = e.target.parentNode.children[0].textContent;
                let thead, th, tbody, headRow;
                let popUpTable = document.createElement('table');

                popUpTable.className = "modalContent";
                cartContentPopup.appendChild(popUpTable);
                thead = document.createElement('thead');
                popUpTable.appendChild(thead);
                headRow = document.createElement('tr');
                thead.appendChild(headRow);
                th = document.createElement('th');
                th.textContent = "Supplier id";
                headRow.appendChild(th);
                th = document.createElement('th');
                th.textContent = "Supplier name";
                headRow.appendChild(th);
                th = document.createElement('th');
                th.textContent = "Total quantity";
                headRow.appendChild(th);
                th = document.createElement('th');
                th.textContent = "Total price";
                headRow.appendChild(th);
                th = document.createElement('th');
                th.textContent = "Shipment Price";
                headRow.appendChild(th);
                th = document.createElement('th');
                th.textContent = "Products";
                headRow.appendChild(th);

                tbody = document.createElement('tbody');
                popUpTable.appendChild(tbody);
                displayCartBySupplier(supplier_id, tbody, null);
                e.preventDefault();
                if(tbody !== null && tbody !== undefined) {
                    cartPopup.style.display = "block";
                        cartPopup.onclick =  function (event) {
                            event.preventDefault();
                            if (event.target == cartPopup) {
                                cartPopup.style.display = "none";
                            }
                    }
                }
            });

            row.appendChild(quantityCell);

            totalCell = document.createElement("td");
            totalCell.textContent = totalValue;
            row.appendChild(totalCell);

            policiesCell = document.createElement("td");
            buildShipmentPolicies(policiesCell, supplier.shipment_policy);
            row.appendChild(policiesCell);

            goToCartCell = document.createElement("td");
            row.appendChild(goToCartCell);

            quantityForm = document.createElement("form");
            goToCartCell.appendChild(quantityForm);

            quantityForm.setAttribute("action", "#");
            quantityForm.setAttribute("id", "id_quantityForm");

            quantityInput = document.createElement("input");
            quantityInput.setAttribute("placeholder", "Insert quantity");
            quantityInput.setAttribute("type", "number");
            quantityForm.appendChild(quantityInput);

            cartButton = document.createElement("button");
            cartButton.setAttribute("type", "submit");
            cartButton.textContent = "add to cart";
            quantityForm.appendChild(cartButton);

            //add to cart event handling
            quantityForm.addEventListener("submit", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                let supplier_id = e.target.parentNode.parentNode.children[0].textContent;
                let supplier_name= e.target.parentNode.parentNode.children[1].textContent;
                let supplier_price = e.target.parentNode.parentNode.children[2].textContent;
                let free_shipment = e.target.parentNode.parentNode.children[4].textContent;
                if (e.target.elements[0].value > 0) {
                    addToCart(details, supplier_id, supplier_name, supplier_price, e.target.elements[0].value, getShipmentPolicies(supplier_id), free_shipment);
                } else {
                   alert("quantity not valid");
                }
            });

            function getShipmentPolicies(supplier_id) {
                let shipment_policy = [];
                suppliersArray.forEach(function (s) {
                    if (s.supplier_id == supplier_id) {
                        for (let i = 0; i < s.shipment_policy.length ; i++) {
                            shipment_policy.push(s.shipment_policy[i]);
                        }
                    }
                });
                return shipment_policy;
            }
        });
    }

    /**
     * Produce a list of shipmentPolicies for every supplier
     * @param listContainer
     * @param policiesArray
     */
    function buildShipmentPolicies(listContainer, policiesArray) {
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
}