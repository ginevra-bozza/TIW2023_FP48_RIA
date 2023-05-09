

{
    function doSearch(_listcontainer, textSearch){
        this.listcontainer = _listcontainer;

        this.show = function () {
            var self = this; //Important!

            doRequest('Results?textSearch=' + textSearch, "GET", // callback function
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
                            self.listcontainer.style.visibility = "hidden";
                            alert("Not possible to recover data"); //for demo purposes
                        }
                    }
                }
            );


        }

        this.update = function (productArray) {
            let table, thead, row, idCell, nameCell, priceCell, th, tbody, anchor, linkText ;
            this.listcontainer.innerHTML = ""; // empty the table body

            // build updated list

            table = document.createElement('table');
            this.listcontainer.appendChild(table);
            thead = document.createElement('thead');
            table.appendChild(thead);
            th = document.createElement('th');
            th.textContent = "id";
            thead.appendChild(th);
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
                priceCell.textContent = product.price + "€";
                row.appendChild(priceCell);

                // Add row to table body
                tbody.appendChild(row);
            });

            this.listcontainer.style.visibility = "visible";
        }
        this.show();
    }
    
    
    function DetailsList(product_id){
        let list_container = document.getElementById("id_detailsContainer");

        this.show = function () {
            let self = this; //Important!

            doRequest('Results?product_id='+ product_id, "POST", // callback function
                function (req) {
                    if (req.readyState === XMLHttpRequest.DONE) { // == 4
                        if (req.status === 200) {
                            try{
                                let productDetails = JSON.parse(req.responseText);
                                list_container.class = "displayed";
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

        this.update = function (details) {
            let table, thead, row, idCell, nameCell, descriptionCell, categoryCell, imageCell, th, tbody, div,
                productImg;
            let suppliersTable, suppliersThead, suppliersTbody, sTh, supplierIdCell, supplierNameCell, insideRow,
                policiesTable;
            let productContainer = document.getElementById("id_productDetails");
            let suppliersContainer = document.getElementById("id_suppliersDetails");

            // build updated list - product
            buildProduct(details);


            //suppliersTable
            suppliersTable = document.createElement('table');
            suppliersContainer.appendChild(suppliersTable);

            suppliersThead = document.createElement('thead');
            suppliersTable.appendChild(suppliersThead);
            sTh = document.createElement('th');
            sTh.textContent = "id";
            suppliersThead.appendChild(sTh);
            sTh = document.createElement('th');
            sTh.textContent = "supplier name";
            suppliersThead.appendChild(sTh);
            sTh = document.createElement('th');
            sTh.textContent = "evaluation";
            suppliersThead.appendChild(sTh);
            sTh = document.createElement('th');
            sTh.textContent = "free shipment price";
            suppliersThead.appendChild(sTh);
            sTh = document.createElement('th');
            sTh.textContent = "shipment info";
            suppliersThead.appendChild(sTh);
            suppliersTbody = document.createElement('tbody');
            suppliersTable.appendChild(suppliersTbody);

            insideRow = document.createElement("tr");
            suppliersTbody.appendChild(insideRow);

        }
    }
}