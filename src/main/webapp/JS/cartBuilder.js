const cart = new Map();

function ProductListBySupplier (){
    this.productList = [];
}


function ProductInCart(product_in_cart_id, name, supplier_name, price, quantity){
	this.product_in_cart_id = product_in_cart_id;
	this.name = name;
	this.quantity = quantity;
    this.supplier_name = supplier_name;
    this.price = price;
}

function calculateNewQuantity (productQuantity, addQuantity){
		return productQuantity + addQuantity;	 
	}

function addToCart(details, supplier_id, quantity){
		details.suppliers.forEach(function(s){
			if(s.supplier_id === supplier_id && quantity > 0){
				if(cart.has(s)){
					cart.get(s).productList.forEach(function(p){
						if(details.id === p.product_in_cart_id){
							calculateNewQuantity(p.quantity,quantity);
						}
					});
					cart.get(s).productList.push(new ProductInCart(details.id, details.name, s.supplier_name, s.price, quantity ))
					}
				else{
					cart.set(s, new ProductListBySupplier());
					}
				}
				
			}
		
	)


        

        this.update = function (details) {// build updated list - product
        let list_container = document.getElementById("id_detailsContainer");
            list_container.className = "displayed";
            buildProduct(details);
            buildSuppliersList(details);
        }
        
        this.show = function () {
            let self = this; //Important!

            doRequest('Cart?product_id='+ product_id + '&supplier_id='+ supplier_id + '&quantity=' + quantity, "GET", // callback function
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) { // == 4
                        if (req.status === 200) {
                            try{
                                let productDetails = JSON.parse(req.responseText);
                                if (productDetails.length === 0) {
                                    alert("No results"); //for demo purposes
                                }else {
                                    // If conferences list is not emtpy, then update view
                                    self.update(productDetails[0]); // self visible by closure
                                }
                            } catch (e) {
                                console.log(e);
                            }

                        } else {
                            // request failed, handle it

                            alert("Not possible to recover data"); //for demo purposes
                        }
                    }
                }
            );
		}
}
function displayCart(cartToDisplay){
    let detail_list_container = document.getElementById("id_detailsContainer");
    detail_list_container.className = "masked";
    let page_container = document.getElementById("id_pageContainer");
    page_container.innerHTML="";
    cartToDisplay.forEach(function(supplierCart){
        supplierCart.forEach(function (){
            displayCartBySupplier(cartToDisplay.get(supplierCart),supplierCart);
        })
    })
}

function displayCartBySupplier(productArray,supplier){
    let table, thead, row, idCell, nameCell, priceCell, supplierNameCell, th, tbody, quantityCell, totalPriceCell ;

    table = document.createElement('table');
    this.listcontainer.appendChild(table);
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
    tbody = document.createElement('tbody');
    th.textContent = "Total Price";
    thead.appendChild(th);
    th = document.createElement('th');
    table.appendChild(tbody);
    thead.appendChild(th);
    productArray.forEach(function (product) { // self visible here, not this
        //Create a row for each product
        row = document.createElement("tr");

        idCell = document.createElement("td");
        idCell.textContent = product.id;
        row.appendChild(idCell);

        nameCell = document.createElement("td");
        nameCell.textContent = product.name;
        row.appendChild(nameCell);

        supplierNameCell = document.createElement("td");
        supplierNameCell.textContent = product.supplier_name;
        row.appendChild(supplierNameCell);

        priceCell = document.createElement("td");
        priceCell.textContent = product.price + "€";
        row.appendChild(priceCell);

        quantityCell = document.createElement("td");
        quantityCell.textContent = product.quantity;
        row.appendChild(quantityCell);

        totalPriceCell = document.createElement("td");
        totalPriceCell.textContent = getTotalBySupplierId(supplier.supplier_id);
        row.appendChild(totalPriceCell);
        // Add row to table body
        tbody.appendChild(row);
    });

    this.listcontainer.className = "displayed";
}

function getQuantityBySupplierId(supplier_id) {
    this.quantity = 0;
    if (cart.get(supplier_id) !== null) {
        cart.get(supplier_id).forEach(function (s) {
            this.quantity += s.quantity;
        })
        return this.quantity
    } else {
        return this.quantity;
    }
}

function getTotalBySupplierId(supplier_id){
    this.total = 0;
    if(cart.get(supplier_id) !== null){
        cart.get(supplier_id).forEach(function (s){
            this.total += s.price;
        })
        return this.total }
    else {
        return this.total;
    }


}
