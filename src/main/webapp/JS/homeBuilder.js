{
    /**
     * Create the home after login and after every press on the home link
     */
 function initializeHome() {

        linkButton('goHomeLink', () => initializeHome());
        linkButton('goCartLink', () => displayCart());
        linkButton('goOrdersLink', () => displayOrders());

        let userData = JSON.parse(sessionStorage.getItem("userData"));
        document.getElementById("id_name").textContent = userData.name + ' ' + userData.surname;
        document.getElementById('goHomeLink').className = "active";
        document.getElementById('goOrdersLink').className = "";
        document.getElementById('goCartLink').className = "";
        refreshHome();
        prepareSearch();
    }

    /**
     * showing last five element viewed
     */

 function refreshHome() {
        document.getElementById("id_detailsContainer").className = "masked";
        document.getElementById("id_cartContainer").innerHTML = "";
        let lastViewedList = new LastViewedList(document.getElementById("id_pageContainer"));
        lastViewedList.show();

    }

    /**
     * Product search
     */

 function prepareSearch(){
        let search_form = document.getElementById("id_textSearch")
       search_form.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                e.stopImmediatePropagation();
                e.preventDefault();
                if(search_form.value === null || search_form.value.length === 0){
                    alert("Insert a valid word");
                } else {
                    doSearch( document.getElementById("id_pageContainer"),search_form.value);
                    }
                }
        });
    }

    /**
     * Create the last viewed List
     * @param id_lastviewedcontainer
     * @constructor
     */
 function LastViewedList(id_lastviewedcontainer) {

        this.listcontainer = id_lastviewedcontainer;

        this.show = function () {

            let self = this;

            doRequest('HomePage', "GET", // callback function
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) { // == 4
                        if (req.status === 200) {
							self.listcontainer.className = "displayed";
                            var productToShow = JSON.parse(req.responseText);

                            if (productToShow.length === 0) {
                                alert("Nothing to show"); //for demo purposes
                                return;
                            }
                            // If conferences list is not emtpy, then update view
                            self.update(productToShow); // self visible by closure
                        } else {
                            // request failed, handle it
                            self.listcontainer.className = "masked";
                            alert("Not possible to recover data"); //for demo purposes
                        }
                    }
                }
            );
        };

        this.update = function (productArray) {
            let table,thead,row, nameCell, priceCell, anchor, linkText;
            this.listcontainer.className = "displayed";
            this.listcontainer.innerHTML = ""; // empty the table body

            // build updated list
            table = document.createElement('table');
            this.listcontainer.appendChild(table);
            thead = document.createElement('thead');
            table.appendChild(thead);
            let th = document.createElement('th');
            th.textContent = "name";
            thead.appendChild(th);
            th = document.createElement('th');
            th.textContent = "price";
            thead.appendChild(th);

            let tbody = document.createElement('tbody');
            table.appendChild(tbody);
            productArray.forEach(function (product) { // self visible here, not this

                row = document.createElement("tr");

                nameCell = document.createElement("td");
                anchor = document.createElement('a');
                nameCell.appendChild(anchor);
                linkText = document.createTextNode(product.name);
                anchor.appendChild(linkText);
                anchor.setAttribute("product_id", product.id);
                anchor.addEventListener("click",(e) => {
                    let detailsList = new DetailsList(product.id);
                    detailsList.show();
                });
                anchor.href="#";
                row.appendChild(nameCell);

                priceCell = document.createElement("td");
                priceCell.textContent = product.price;
                row.appendChild(priceCell);


                tbody.appendChild(row);
            });


        }
    }
 }
