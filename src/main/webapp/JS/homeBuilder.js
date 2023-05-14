{
    function initializeHome() {

        //var personalMessage = new PersonalMessage(sessionStorage.getItem('email'),
          //  document.getElementById("id_name"));
        //personalMessage.show();
        linkButton('goHomeLink', () => initializeHome());
        linkButton('goCartLink', () => displayCart());
        linkButton('goOrdersLink', () => displayOrders());
        refreshHome();
        prepareSearch();
    }

    //showing last five element viewed
    function refreshHome() {
        document.getElementById("id_detailsContainer").className = "masked";
        document.getElementById("id_cartContainer").innerHTML = "";
        let lastViewedList = new LastViewedList(document.getElementById("id_pageContainer"));
        lastViewedList.show();

    }

    //Product search
    function prepareSearch(){
        let search_form = document.getElementById("id_textSearch")
       search_form.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                e.preventDefault();
                sessionStorage.setItem('id_searchForm', search_form.value);
                //sessionStorage.removeItem('viewItem');
                doSearch( document.getElementById("id_pageContainer"),search_form.value);

                }
        });
    }

    function LastViewedList(id_lastviewedcontainer) {

        this.listcontainer = id_lastviewedcontainer;


        this.show = function () {

            var self = this; //Important!

            doRequest('HomePage', "GET", // callback function
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) { // == 4
                        if (req.status === 200) {
                            var productToShow = JSON.parse(req.responseText);

                            if (productToShow.length === 0) {
                                alert("Nothing to show"); //for demo purposes
                                return;
                            }
                            // If conferences list is not emtpy, then update view
                            self.update(productToShow); // self visible by closure
                        } else {
                            // request failed, handle it
                            self.listcontainer.style.visibility = "hidden";
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
                //Create a row for each conference
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

                // Add row to table body
                tbody.appendChild(row);
            });


        }
    }
}