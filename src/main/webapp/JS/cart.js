

    function addToCart(details, supplier_id, supplier_name, price, quantity /*, shipment_policy*/, free_shipment_price){
        if(quantity <= 0) {
            alert("invalid quantity");
            //bloccare azione
        }
        let cart;
        if(sessionStorage.getItem("cart") !== undefined && sessionStorage.getItem("cart") !== null && sessionStorage.getItem("cart").length > 0){
            cart = JSON.parse(sessionStorage.getItem("cart"));
        } else {
            cart = [];
        }

        let checkSupplier = false;
        let checkProduct = false;

        cart.forEach( function (s){
            if(s.supplier_id === supplier_id){
                checkSupplier = true;
                s.productsArray.forEach(function (product){
                    if(details.id === product.product_id){
                        /* ------------------da sistemare---------------------------------------------------------------*/
                        //s.updateQuantity(product.product_id, quantity);
                        checkProduct = true;
                    }
                })
                if(!checkProduct){
                    s.productsArray.push(new ProductInCart(details.id, details.name, quantity, price));
                }
            }
        });
        if(!checkSupplier) {
            let supplierCart = new SupplierCart(supplier_id, supplier_name /*shipment_policy*/, free_shipment_price);
            supplierCart.productsArray.push(new ProductInCart(details.id, details.name, quantity, price));
            cart.push(supplierCart);
        }
        //aggiornare quantity, totale, shipment price
        /* ------------------da sistemare---------------------------------------------------------------*/
        /*cart.forEach( function (s) {
            if (s.supplier_id === supplier_id) {
                s.calculateTotal();
                s.calculateTotalQuantity();
                s.calculateShipmentPrice();
            }
        });*/
        /* ----------------------------------------------------------------------------------------------*/


        checkSupplier = false;
        checkProduct = false;

        let jsonCart = JSON.stringify(cart);
        console.log(jsonCart);

        sessionStorage.setItem("cart", jsonCart);
        alert("Calling displayCart");
        displayCart();
    }

    function SupplierCart(supplier_id, supplier_name, shipment_policy, free_shipment_price) {

        console.log("creating new supplier cart with id: " + supplier_id);

        this.supplier_id = supplier_id;
        this.supplier_name = supplier_name;
        this.productsArray = [];
        this.totalQuantity = 0;
        this.totalValue = 0;
        this.shipmentPrice = 0;

        /* ------------------da sistemare---------------------------------------------------------------*/
        this.updateQuantity = function (product_id, quantityToAdd) {
            let self = this;
            self.productsArray.forEach(function (p) {
                if (p.product_id === product_id) {
                    p.quantity += quantityToAdd;
                }
            })

        }
        this.calculateTotalQuantity = function () {
            let self = this;
            self.productsArray.forEach(function (p) {
                self.totalQuantity += p.quantity;
            })

        }
        this.calculateTotal = function () {
            let self = this;
            self.productsArray.forEach(function (p) {
                self.totalValue += p.price * p.quantity;
            })
        }
        this.calculateShipmentPrice = function () {
            let self = this;

            if (self.totalValue > free_shipment_price) {
                self.shipmentPrice = 0;
            } else {
                shipment_policy.forEach(function (shPolicy) {
                    if (self.totalQuantity > shPolicy.minimum && totalQuantity < shPolicy.maximum) {
                        self.shipmentPrice = shPolicy.shipmentPrice;
                    }
                })
            }
        }
        /* -------------------------------------------------------------------------------------------*/
    }


        function ProductInCart(product_in_cart_id, name, quantity, price) {
            this.product_id = product_in_cart_id;
            this.name = name;
            this.price = price;
            this.quantity = quantity;
        }

        function displayCart() {

            let listContainer = document.getElementById("id_pageContainer");
            let detailsContainer = document.getElementById("id_detailsContainer")
            let cartContainer = document.getElementById("id_cartContainer")
            let cartToDisplay = JSON.parse(sessionStorage.getItem("cart"));
            let table, thead, row, idCell, nameCell, priceCell, supplierNameCell, th, tbody, quantityCell,
                totalPriceCell, shipmentPriceCell, headRow, supplierIdCell, totalQuantityCell, insideTable,
                insideThead, insideTh, insideRow, insideTbody ;

            listContainer.className = "masked";
            detailsContainer.className = "masked";
            cartContainer.innerHTML = "";

            table = document.createElement('table');
            cartContainer.appendChild(table);
            thead = document.createElement('thead');
            table.appendChild(thead);
            headRow = document.createElement("tr");
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
            table.appendChild(tbody);

            for (let i = 0; i < cartToDisplay.length; i++) {

                row = document.createElement("tr");
                tbody.appendChild(row);

                supplierIdCell = document.createElement("td");
                supplierIdCell.textContent = cartToDisplay[i].supplier_id;
                row.appendChild(supplierIdCell);

                supplierNameCell = document.createElement("td");
                supplierNameCell.textContent = cartToDisplay[i].supplier_name;
                row.appendChild(supplierNameCell);

                totalQuantityCell = document.createElement("td");
                totalQuantityCell.textContent = cartToDisplay[i].totalQuantity;
                row.appendChild(totalQuantityCell);

                totalPriceCell = document.createElement("td");
                totalPriceCell.textContent = cartToDisplay[i].totalValue + "€";
                row.appendChild(totalPriceCell);

                shipmentPriceCell = document.createElement("td");
                shipmentPriceCell.textContent = cartToDisplay[i].shipmentPrice;
                row.appendChild(shipmentPriceCell);

                insideTable = document.createElement('table');
                row.appendChild(insideTable);

                cartToDisplay[i].productsArray.forEach(function (product) {
                    //Creates a row for each product

                    insideThead = document.createElement('thead');
                    insideTable.appendChild(insideThead);
                    insideTh = document.createElement('th');
                    insideTh.textContent = "Product id";
                    insideThead.appendChild(insideTh);
                    insideTh = document.createElement('th');
                    insideTh.textContent = "Name";
                    insideThead.appendChild(insideTh);
                    insideTh = document.createElement('th');
                    insideTh.textContent = "Price";
                    insideThead.appendChild(insideTh);
                    insideTh = document.createElement('th');
                    insideTh.textContent = "Quantity";
                    insideThead.appendChild(insideTh);

                    insideTbody = document.createElement('tbody');
                    insideTable.appendChild(insideTbody);

                    insideRow = document.createElement("tr");
                    insideTbody.appendChild(insideRow);

                    idCell = document.createElement("td");
                    idCell.textContent = product.product_id;
                    insideRow.appendChild(idCell);

                    nameCell = document.createElement("td");
                    nameCell.textContent = product.name;
                    insideRow.appendChild(nameCell);

                    priceCell = document.createElement("td");
                    priceCell.textContent = product.price + "€";
                    insideRow.appendChild(priceCell);

                    quantityCell = document.createElement("td");
                    quantityCell.textContent = product.quantity;
                    insideRow.appendChild(quantityCell);
                });

            }
    }



