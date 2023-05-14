

    function addToCart(details, supplier_id, supplier_name, price, quantity , shipment_policy, free_shipment_price){
        quantity = parseInt(quantity);
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
                    }
                })
                if(!checkProduct){
                    s.productsArray.push(new ProductInCart(details.id, details.name, quantity, price));
                }
            }
            /*s.updateTotalQuantity(quantity);
            s.updateTotal(price,quantity);*/
           // s.shipmentPrice = calculateShipmentPrice(s);
            s.update();

        });
        if(!checkSupplier) {
            let supplierCart = new SupplierCart(supplier_id, supplier_name ,shipment_policy, free_shipment_price);
            supplierCart.productsArray.push(new ProductInCart(details.id, details.name, quantity, price));
            //supplierCart.updateTotalQuantity(quantity)
            //supplierCart.updateTotal(price,quantity);
            //supplierCart.shipmentPrice = calculateShipmentPrice(supplierCart);
            supplierCart.update();
            cart.push(supplierCart);
        }

        checkSupplier = false;
        checkProduct = false;

        let jsonCart = JSON.stringify(cart);
        console.log(jsonCart);

        sessionStorage.setItem("cart", jsonCart);
        displayCart(cart);
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

        this.update = function (){
            let self = this;
            self.totalValue =  recalculateTotal(self);
            self.totalQuantity = recalculateQuantity(self);
            self.shipmentPrice = calculateShipmentPrice(self);

        }
    }
    function recalculateTotal(supplierCart) {
        let totalToCalculate = 0;
        supplierCart.productsArray.forEach(function (p){
            totalToCalculate += parseInt(p.quantity) * parseInt(p.price);
        })
        return totalToCalculate;
    }
    function recalculateQuantity(supplierCart) {
        let quantityToCalculate = 0;
        supplierCart.productsArray.forEach(function (p){
            quantityToCalculate += parseInt(p.quantity);
        })
        return quantityToCalculate;
    }
    function calculateShipmentPrice(supplierCart){
        console.log("Calculating shipment price on: "+supplierCart);
        let shipment_price = 0;
        if (supplierCart.totalValue <= supplierCart.free_shipment_price) {
            supplierCart.shipment_policy.forEach(function (shPolicy) {
                if (supplierCart.totalQuantity >= shPolicy.minimum && supplierCart.totalQuantity <= shPolicy.maximum) {
                   shipment_price = parseInt(shPolicy.shipment_price);
                }
            });
        }
        return shipment_price;
    }
    function ProductInCart(product_in_cart_id, name, quantity, price) {
        this.product_id = product_in_cart_id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    function displayCart(cart) {
        let cartToDisplay;
        let listContainer = document.getElementById("id_pageContainer");
        let detailsContainer = document.getElementById("id_detailsContainer")
        let cartContainer = document.getElementById("id_cartContainer")
        let emptyCartMessage = document.createElement("p");

        let table, thead, th, tbody, headRow;

        listContainer.className = "masked";
        detailsContainer.className = "masked";
        cartContainer.innerHTML = "";

        if(cart === undefined || cart === null)
            cartToDisplay = getCartFromSession();
        else
            cartToDisplay = cart;

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

        tbody.appendChild(emptyCartMessage);

        if(cartToDisplay !== undefined && cartToDisplay !== null && cartToDisplay.length > 0){
            emptyCartMessage.className = "masked";
            cartToDisplay.forEach(function (s) {
                displayCartBySupplier(s.supplier_id, tbody, s);
                s.update();
            });
        } else {
            emptyCartMessage.textContent = "No product available";
            emptyCartMessage.className = "displayed";
        }

        cartContainer.className = "displayed";
    }

    function displayCartBySupplier(supplier_id, tbody, supplierCart) {

        let row, supplierIdCell, supplierNameCell, totalQuantityCell, totalPriceCell, insideTable, insideThead,
            insideTh, insideTbody, insideRow, idCell, nameCell, priceCell, quantityCell, shipmentPriceCell, orderButton;
        let s = [];
        let checkCart = false;

        if(supplierCart === null || supplierCart === undefined){
            let cart = getCartFromSession();
            if(cart!== undefined && cart.length > 0 && cart !== null){
                cart.forEach( function (sCart){
                    if(sCart.supplier_id == supplier_id){
                        checkCart = true;
                        s = sCart;
                    }
                })
            }
        } else {
            s = supplierCart;
            checkCart = true;
            s.update();
        }


        if(checkCart){
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

            shipmentPriceCell = document.createElement("td");
            shipmentPriceCell.textContent = s.shipmentPrice;
            row.appendChild(shipmentPriceCell);
                orderButton = document.createElement("button");
                orderButton.type = "file";
                orderButton.textContent = "order";
                totalPriceCell.appendChild(orderButton);

                orderButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    let supplier_id = e.target.parentNode.parentNode.children[0].textContent;
                    let supplierCart;
                    getCartFromSession().forEach(function (supplier) {
                        if(supplier.supplier_id == supplier_id){
                            supplierCart = supplier;
                        }
                    })
                    supplierCart.update();
                    const myJSON_order = encodeURIComponent(JSON.stringify(supplierCart));
                    let param = '?order=' + myJSON_order;
                    console.log(myJSON_order);
                    executeOrder(param);

                });


            insideTable = document.createElement('table');
            row.appendChild(insideTable);
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

    }

    function removeFromCart() {
        let cart = getCartFromSession();
        let ordersList = JSON.parse(sessionStorage.getItem("order"));

        console.log("cart before update"+JSON.stringify(cart));
        cart.forEach( function (s){
            if(s.supplier_id == ordersList[0].supplier_id){
                let index = cart.indexOf(s);
                cart.splice(index, 1);
                console.log("cart after update"+JSON.stringify(cart));
                sessionStorage.setItem("cart",JSON.stringify(cart));
            }
            s.update();
        })
    }





