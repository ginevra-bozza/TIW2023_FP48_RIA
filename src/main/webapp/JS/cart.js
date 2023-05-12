

    function addToCart(details, supplier_id, supplier_name, price, quantity , shipment_policy, free_shipment_price){

        if(quantity <= 0) {
            alert("invalid quantity");
            //bloccare azione
        }
        let cart = getCartFromSession();

        let checkSupplier = false;
        let checkProduct = false;

        cart.forEach( function (s){
            if(s.supplier_id === supplier_id){
                checkSupplier = true;
                s.productsArray.forEach(function (product){
                    if(details.id === product.product_id){
                        product.quantity += quantity;
                        checkProduct = true;
                        s.updateTotalQuantity(quantity);
                        s.updateTotal(price,quantity);

                    }
                })
                if(!checkProduct){
                    s.productsArray.push(new ProductInCart(details.id, details.name, quantity, price));
                    s.updateTotalQuantity(quantity);
                    s.updateTotal(price,quantity);

                }
            }


        });
        if(!checkSupplier) {
            let supplierCart = new SupplierCart(supplier_id, supplier_name ,shipment_policy, free_shipment_price);
            supplierCart.productsArray.push(new ProductInCart(details.id, details.name, quantity, price));
            supplierCart.updateTotalQuantity(quantity)
            supplierCart.updateTotal(price,quantity);
            cart.push(supplierCart);
        }

        checkSupplier = false;
        checkProduct = false;

        let jsonCart = JSON.stringify(cart);
        console.log(jsonCart);

        sessionStorage.setItem("cart", jsonCart);
        displayCart();
    }

    function SupplierCart (supplier_id, supplier_name, shipment_policy, free_shipment_price) {

        this.supplier_id = supplier_id;
        this.supplier_name = supplier_name;
        this.productsArray = [];
        this.totalQuantity = 0;
        this.totalValue = 0;
        this.shipmentPrice = 0;
        this.shipment_policy = shipment_policy;
        this.free_shipment_price = free_shipment_price;

        this.updateTotalQuantity = function (quantity) {
            let self = this;
            self.totalQuantity += quantity;
        }

        this.updateTotal = function(price, quantity){
            let self = this;
            self.totalValue += price * quantity;
            self.calculateShipmentPrice();
        }

        this.calculateShipmentPrice = function() {
            let self = this;
            if (self.totalValue > self.free_shipment_price) {
                self.shipmentPrice = 0;
            } else {
                this.shipment_policy.forEach(function (shPolicy) {
                    if (self.totalQuantity > shPolicy.minimum && self.totalQuantity < shPolicy.maximum) {
                        self.shipmentPrice = shPolicy.shipmentPrice;
                    }
                });
            }
        }
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
        let cartToDisplay = getCartFromSession();
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
        table.appendChild(tbody);

        cartToDisplay.forEach(function (s){
            displayCartBySupplier(s.supplier_id, tbody);
        });
        cartContainer.className = "displayed";
    }
    function displayCartBySupplier(supplier_id, tbody){
        let cart = getCartFromSession();
        let row, supplierIdCell, supplierNameCell, totalQuantityCell, totalPriceCell, insideTable, insideThead,
            insideTh, insideTbody, insideRow, idCell, nameCell, priceCell, quantityCell;
        cart.forEach( function (s){
            if(s.supplier_id == supplier_id){
                row = document.createElement("tr");
                tbody.appendChild(row);

                supplierIdCell = document.createElement("td");
                supplierIdCell.textContent = s.supplier_id;
                row.appendChild(supplierIdCell);

                supplierNameCell = document.createElement("td");
                supplierNameCell.textContent = s.supplier_name;
                row.appendChild(supplierNameCell);

                totalQuantityCell = document.createElement("td");
                totalQuantityCell.textContent = s.totalQuantity;
                row.appendChild(totalQuantityCell);

                totalPriceCell = document.createElement("td");
                totalPriceCell.textContent = s.totalValue + "€";
                row.appendChild(totalPriceCell);

                /*shipmentPriceCell = document.createElement("td");
                shipmentPriceCell.textContent = s.shipmentPrice;
                row.appendChild(shipmentPriceCell);*/

                insideTable = document.createElement('table');
                row.appendChild(insideTable);
                console.log("products array for this supplier: "+s.productsArray);
                s.productsArray.forEach(function (product) {
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
        })

    }




