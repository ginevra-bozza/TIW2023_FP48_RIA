

    function addToCart(details, supplier_id, supplier_name, price, quantity, shipment_policy, free_shipment_price){
        if(quantity <= 0) {
            alert("invalid quantity");
            //bloccare azione
        }
        let cart;
        if(sessionStorage.getItem("cart") !== undefined && sessionStorage.getItem("cart") !== null){
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
                        s.updateQuantity(product.product_id, quantity);
                        checkProduct = true;
                    }
                })
                if(!checkProduct){
                    s.productsArray.push(new ProductInCart(details.id, details.name, quantity, price));
                }
            }
        });
        if(!checkSupplier) {
            let supplierCart = new SupplierCart(supplier_id, supplier_name, shipment_policy, free_shipment_price);
            supplierCart.productsArray.push(new ProductInCart(details.id, details.name, quantity, price));
            cart.push(supplierCart);
        }
        //aggiornare quantity, totale, shipment price

        cart.forEach( function (s) {
            if (s.supplier_id === supplier_id) {
                s.calculateTotal();
                s.calculateTotalQuantity();
                s.calculateShipmentPrice();
            }
        });

        checkSupplier = false;
        checkProduct = false;

        let jsonCart = JSON.stringify(cart);
        console.log(jsonCart);

        sessionStorage.setItem("cart", jsonCart);
        displayCart(jsonCart);
    }

    function SupplierCart(supplier_id, supplier_name, shipment_policy, free_shipment_price) {

        console.log("creating new supplier cart with id: " + supplier_id);

        this.supplier_id = supplier_id;
        this.supplier_name = supplier_name;
        this.productsArray = [];
        this.totalQuantity = 0;
        this.totalValue = 0;
        this.shipmentPrice = 0;


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
    }


        function ProductInCart(product_in_cart_id, name, quantity, price) {
            this.product_id = product_in_cart_id;
            this.name = name;
            this.price = price;
            this.quantity = quantity;
        }

        function displayCart(jsonCart) {
            //let cartToDisplay = JSON.parse(sessionStorage.getItem("cart"));
            let cartToDisplay = JSON.parse(jsonCart);
            console.log(cartToDisplay[0]);

            let table, thead, row, idCell, nameCell, priceCell, supplierNameCell, th, tbody, quantityCell,
                totalPriceCell, shipmentPriceCell;
            let listcontainer = document.getElementById("id_cartContainer");
            listcontainer.innerHTML ="";

            table = document.createElement('table');
            listcontainer.appendChild(table);
            thead = document.createElement('thead');
            table.appendChild(thead);
            row = document.createElement("tr");
            thead.appendChild(row);
            th = document.createElement('th');
            th.textContent = "Supplier id";
            row.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Supplier name";
            row.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Total quantity";
            row.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Total price";
            row.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Shipment Price";
            row.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Products";
            row.appendChild(th);

            tbody = document.createElement('tbody');
            thead.appendChild(th);
            table.appendChild(tbody);

            for (let i = 0; i < cartToDisplay.length; i++) {
            //cartToDisplay.forEach(function (sCart) {
                row = document.createElement("tr");

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


                cartToDisplay[i].productsArray.forEach(function (product) { // self visible here, not this
                    //Creates a row for each product
                    insideTable = document.createElement('table');
                    self.listcontainer.appendChild(insideTable);
                    insidethead = document.createElement('thead');
                    insideTable.appendChild(insidethead);
                    insideth = document.createElement('th');
                    insideth.textContent = "Product id";
                    insidethead.appendChild(insideth);
                    insideth = document.createElement('th');
                    insideth.textContent = "Name";
                    insidethead.appendChild(insideth);
                    insideth = document.createElement('th');
                    insideth.textContent = "Price";
                    insidethead.appendChild(insideth);
                    insideth = document.createElement('th');
                    insideth.textContent = "Quantity";
                    insidethead.appendChild(insideth);

                    insidetbody = document.createElement('tbody');
                    insideTable.appendChild(insidetbody);

                    insideRow = document.createElement("tr");

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

            listcontainer.className = "displayed";

    }



