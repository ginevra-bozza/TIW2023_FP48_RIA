{
    function initializeHome() {

        //var personalMessage = new PersonalMessage(sessionStorage.getItem('email'),
          //  document.getElementById("id_name"));
        //personalMessage.show();
        refreshHome();
        search();
    }

    //showing last five element viewed
    function refreshHome() {
        lastViewedList = new LastViewedList(document.getElementById("id_pageContainer"));
        lastViewedList.show();


    }

    //Product search
    function search(){
       document.getElementById("id_searchForm").addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                e.preventDefault();
                //var textSearch = document.getElementById('id_textSearch');
                //sessionStorage.setItem('searchedProduct', textSearch.value);
                var form = e.target.closest("form");
                var searchedProducts = new ResultsList( document.getElementById("id_pageContainer"),form);
                searchedProducts.show();
                }
        });
    }

    function LastViewedList(id_lastviewedcontainer) {

        this.listcontainer = id_lastviewedcontainer;


        this.show = function () {

            var self = this; //Important!

            makeCall("GET", 'HomePage', null,
                // callback function
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) { // == 4
                        var message = req.responseText;
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
            var table,thead,row, nameCell, priceCell;
            this.listcontainer.innerHTML = ""; // empty the table body

            // build updated list
            var self = this;
            table = document.createElement('table');
            this.listcontainer.appendChild(table);
            thead = document.createElement('thead');
            table.appendChild(thead);
            var th = document.createElement('th');
            th.textContent = "name";
            thead.appendChild(th);
            var th = document.createElement('th');
            th.textContent = "price";
            thead.appendChild(th);

            var tbody = document.createElement('tbody');
            table.appendChild(tbody);
            productArray.forEach(function (product) { // self visible here, not this
                //Create a row for each conference
                row = document.createElement("tr");

                nameCell = document.createElement("td");
                nameCell.textContent = product.name;
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