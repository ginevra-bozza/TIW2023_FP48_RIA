function executeOrder(param){
    let list_container = document.getElementById("id_pageContainer")
        let self = this; //Important!
        console.log(param);
        doRequest('OrderServlet' + param, "GET", // callback function
            function (req) {
                if (req.readyState === XMLHttpRequest.DONE) { // == 4
                    if (req.status === 200) {
                        document.getElementById('id_pageContainer').innerHTML = '';
                        let productToShow = JSON.parse(req.responseText);

                        if (productToShow.length === 0) {
                            alert("No results"); //for demo purposes

                        }else {
                            // If conferences list is not emtpy, then update view
                            self.update(productToShow); // self visible by closure
                        }
                    } else {
                        // request failed, handle it
                        list_container.className = "masked";
                        alert("Not possible to recover data"); //for demo purposes
                    }
                }
            });

}