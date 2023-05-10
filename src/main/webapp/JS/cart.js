{

    function addToCart(details, supplier_id, supplier_name, price, quantity){
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
            let supplierCart = new SupplierCart(supplier_id, supplier_name);
            cart.push(supplierCart);
        }
        //aggiornare quantity, totale, shipment price


        checkSupplier = false;
        checkProduct = false;
        sessionStorage.setItem("cart", cart);

    }

    function SupplierCart(supplier_id, supplier_name){
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
        }
        this.calculateTotal = function (){
        }
        this.shipmentPrice = function (){
        }
    }

    function ProductInCart(product_in_cart_id, name, supplier_name, price, quantity){
        this.product_id = product_in_cart_id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

}