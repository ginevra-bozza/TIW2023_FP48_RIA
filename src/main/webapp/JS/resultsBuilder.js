{
    function doSearch(_listcontainer, textSearch){
        this.listcontainer = _listcontainer;

        this.show = function () {
            var self = this; //Important!

            doRequest('Results?textSearch=' + textSearch, "GET", // callback function
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) { // == 4
                        if (req.status === 200) {
                            document.getElementById('pageContainer').innerHTML = '';
                            let productToShow = JSON.parse(req.responseText);

                            if (productToShow.length === 0) {
                                alert("No results"); //for demo purposes

                            }else {
                                // If conferences list is not emtpy, then update view
                                self.update(productToShow); // self visible by closure
                            }
                        } else {
                            // request failed, handle it
                            self.listcontainer.style.visibility = "hidden";
                            alert("Not possible to recover data"); //for demo purposes
                        }
                    }
                }
            );


        }

        this.update = function (productArray) {
            let table, thead, row, idCell, nameCell, priceCell, th, tbody ;
            this.listcontainer.innerHTML = ""; // empty the table body

            // build updated list

            table = document.createElement('table');
            this.listcontainer.appendChild(table);
            thead = document.createElement('thead');
            table.appendChild(thead);
            th = document.createElement('th');
            th.textContent = "name";
            thead.appendChild(th);
            th = document.createElement('th');
            th.textContent = "price";
            thead.appendChild(th);
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
            productArray.forEach(function (product) { // self visible here, not this
                //Create a row for each conference
                row = document.createElement("tr");

                idCell = document.createElement("td");
                idCell.textContent = product.id;
                row.appendChild(idCell);

                nameCell = document.createElement("td");
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                priceCell = document.createElement("td");
                priceCell.textContent = product.price;
                row.appendChild(priceCell);

                // Add row to table body
                tbody.appendChild(row);
            });

            this.listcontainer.style.visibility = "visible";
        }
        this.show();
    }
}