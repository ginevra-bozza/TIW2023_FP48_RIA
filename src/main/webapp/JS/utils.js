/**
 * AJAX call management
 */

	function makeCall(method, url, formElement, cback, reset = true) {
		console.log("makeCall on "+method+ " "+url+" "); //debug
	    let req = new XMLHttpRequest(); // visible by closure
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

/**
 * AJAX call management without form sending
 *
 */
function doRequest(url, method, callback, form = null) {
        console.log("makeCall on "+method+ " "+url+" "); //debug
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => callback(request);
        request.open(method, url);
        if (form == null) {
            request.send();
        } else {
            let fd = new FormData(form);
            request.send(fd);
        }
    }

/**
 * links a button with its event in the menu
 */
function linkButton(id, cb) {
 	 	let button = document.getElementById(id);
  		button.addEventListener('click', (e) => {
    	e.preventDefault();
    	cb();
  });
}

/**
 * recover the cart from sessionStorage
 * @returns cart element
 */
function getCartFromSession(){

        let cart = [];
        let jsonCart;
        if(sessionStorage.getItem("cart")!== undefined && sessionStorage.getItem("cart") !== null && sessionStorage.getItem("cart").length > 0){
            jsonCart = JSON.parse(sessionStorage.getItem("cart"));
            //retrieves each supplierCart in cart array
            for (let i = 0; i < jsonCart.length; i++) {
                let supplierCart = jsonCart[i];
                cart.push(new SupplierCart(supplierCart.supplier_id, supplierCart.supplier_name,
                    supplierCart.shipment_policy, supplierCart.free_shipment_price));

                cart[i].totalValue = supplierCart.totalValue;
                cart[i].totalQuantity = supplierCart.totalQuantity;
                cart[i].shipment_price = supplierCart.shipmentPrice;
                cart[i].productsArray = [];

                //retrieves the productArray for each supplierCart
                for (let j = 0; j < supplierCart.productsArray.length ; j++) {
                    let productInCart = supplierCart.productsArray[j];
                    cart[i].productsArray.push(new ProductInCart(productInCart.product_id, productInCart.name,
                        productInCart.quantity, productInCart.price));
                    console.log("cart[i] is: "+cart[i]);

                }
            }
        }
        return cart;
}