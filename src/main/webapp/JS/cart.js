

    function addToCart(details, supplier_id, supplier_name, price, quantity, shipment_policy, free_shipment_price){
        if(quantity <= 0) {
            alert("invalid quantity");
            //bloccare azione
        }
        let cart;
        if(sessionStorage.getItem("cart") !== undefined && sessionStorage.getItem("cart") !== null){
            cart = sessionStorage.getItem("cart");
        } else {
            cart = [];
            sessionStorage.setItem("cart", cart);
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
            cart.push(supplierCart);
        }
        //aggiornare quantity, totale, shipment price


        checkSupplier = false;
        checkProduct = false;
        sessionStorage.setItem("cart", cart);



        displayCart();
    }

    function SupplierCart(supplier_id, supplier_name, shipment_policy, free_shipment_price){
        this.supplier_id = supplier_id;
        this.supplier_name = supplier_name;
        this.productsArray = [];
        this.totalQuantity = 0;
        this.totalValue = 0;
        this.shipmentPrice = 0;


        this.updateQuantity = function (product_id, quantityToAdd){
            let self = this;
            self.productsArray.forEach(function (p){
                if(p.product_id === product_id){
                    p.quantity += quantityToAdd;
                }
            })

        }
        this.calculateTotalQuantity = function (){
            let self= this;
            self.productsArray.forEach(function (p) {
                self.totalQuantity += p.quantity;
            })

        }
        this.calculateTotal = function (){
            let self= this;
            self.productsArray.forEach(function (p) {
                self.totalValue += p.price * p.quantity;
            })
        }
        this.shipmentPrice = function (){
            let self = this;

            if(self.totalValue > free_shipment_price) {
                self.shipmentPrice = 0;
            }else{
            shipmentPolicy.forEach(function (shPolicy) {
                if(totalQuantity > shPolicy.minimum && totalQuantity < shPolicy.maximum){
                    self.shipmentPrice = shPolicy.shipmentPrice;
                }
            })
        }
    }

        this.displayCartBySupplier = function (){
            let table, thead, row, idCell, nameCell, priceCell, supplierNameCell, th, tbody, quantityCell, totalPriceCell, shipmentPriceCell ;
            let self = this;
            self.listcontainer = document.getElementById("id_pageContainer");

            table = document.createElement('table');
            self.listcontainer.appendChild(table);
            thead = document.createElement('thead');
            table.appendChild(thead);
            th = document.createElement('th');
            th.textContent = "Id";
            thead.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Name";
            thead.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Supplier_name";
            thead.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Price";
            thead.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Quantity";
            thead.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Total Price";
            thead.appendChild(th);
            th = document.createElement('th');
            th.textContent = "Shipment Price";
            thead.appendChild(th);
            tbody = document.createElement('tbody');
            thead.appendChild(th);
            table.appendChild(tbody);

            self.productsArray.forEach(function (product) { // self visible here, not this
                //Creates a row for each product
                row = document.createElement("tr");

                idCell = document.createElement("td");
                idCell.textContent = product.product_id;
                row.appendChild(idCell);

                nameCell = document.createElement("td");
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                supplierNameCell = document.createElement("td");
                supplierNameCell.textContent = self.supplier_name;
                row.appendChild(supplierNameCell);

                priceCell = document.createElement("td");
                priceCell.textContent = product.price + "€";
                row.appendChild(priceCell);

                quantityCell = document.createElement("td");
                quantityCell.textContent = product.quantity;
                row.appendChild(quantityCell);

                totalPriceCell = document.createElement("td");
                totalPriceCell.textContent = self.totalValue;
                row.appendChild(totalPriceCell);

                shipmentPriceCell = document.createElement("td");
                shipmentPriceCell.textContent = self.totalValue;
                row.appendChild(shipmentPriceCell);
                // Add row to table body
                tbody.appendChild(row);
            });

            self.listcontainer.className = "displayed";
        }
    }

    function ProductInCart(product_in_cart_id, name, supplier_name, price, quantity){
        this.product_id = product_in_cart_id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
    function displayCart() {
        let cartToDisplay = sessionStorage.getItem("cart");
        cartToDisplay.forEach(function (sCart) {
            sCart.displayCartBySupplier();
        })
    }


