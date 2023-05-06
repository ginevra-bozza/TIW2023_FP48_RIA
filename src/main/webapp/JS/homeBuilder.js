{
    function initializeHome() {

        var personalMessage = new PersonalMessage(sessionStorage.getItem('name'),
            document.getElementById("id_name"));
        personalMessage.show();
        refreshHome();
        search();
    }

    //showing last five element viewed
    function refreshHome() {
        lastViewedList = new LastViewedList(
            alertContainer,
            //document.getElementById("id_lastviewedcontainer"),
            document.getElementById("id_lastviewedlistcontainerbody"));
        lastViewedList.show();


    }

    //Product search
    function search(){
        searchForm.addEventListener('keydown', (e) => {
            var searchForm = document.getElementById("id_searchForm");
            if (e.code === 'Enter') {
                e.preventDefault();
                var textSearch = document.getElementById('textSearch');
                sessionStorage.setItem('searchedProduct', textSearch.value);
                var searchedProducts = new ResultsList(
                    alertContainer,
                    document.getElementById("id_resultlistcontainer"),
                    document.getElementById("id_resultlistcontainerbody"));
                searchedProducts.show();
            } else {
                errorContainer.style.display = 'block';
                document
                    .getElementById('errorBody')
                    .textContent('Error in Input string');
            }
        });
    }

    function LastViewedList(id_lastviewedlistcontainerbody) {
        //id_lastviewedcontainer,
            //this.listcontainer = id_lastviewedcontainer;
        this.listcontainerbody = id_lastviewedlistcontainerbody;

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
            var row, nameCell, priceCell;
            this.listcontainerbody.innerHTML = ""; // empty the table body

            // build updated list
            var self = this;

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
                self.listcontainerbody.appendChild(row);
            });


        }
    }
}