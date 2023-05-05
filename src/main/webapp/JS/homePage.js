{
    window.onload = function() { // wait for the document to finish loading
        var title = document.getElementById("");
        title.onclick = function() {
            var element = document.getElementById("id_listcontainer");
            element.className = "displayed";
        };
    };

	let missionDetails, lastViewedList, wizard,
	    pageOrchestrator = new PageOrchestrator(); // main controller

	  window.addEventListener("load", () => {
	    /*if (sessionStorage.getItem("user") == null) {
	      window.location.href = "index.html";
	      console.log("failed access")
	    } else {
	      */pageOrchestrator.start(); // initialize the components
	      pageOrchestrator.refresh();
	    } // display initial content
	  //}
	  ,false);
	  
	  function PersonalMessage(_username, messagecontainer) {
	    this.username = _username;
	    this.show = function() {
	      messagecontainer.textContent = this.username;
	    }
	  }
	  
	  
	  function PageOrchestrator() {
	    var alertContainer = document.getElementById("id_alert");

	    
	    this.start = function() {
            var searchForm  =  document.getElementById("id_searchForm");

            personalMessage = new PersonalMessage(sessionStorage.getItem('name'),
                document.getElementById("id_name"));
            personalMessage.show();

            lastViewedList = new LastViewedList(
                alertContainer,
                document.getElementById("id_listcontainer"),
                document.getElementById("id_listcontainerbody"));
            lastViewedList.show();

            searchForm.querySelector("input[type='button']").addEventListener('click', () => {



                searchedProducts = new ResultsList(
                    alertContainer,
                    document.getElementById("id_resultlistcontainer"),
                    document.getElementById("id_resultlistcontainerbody"));
                searchedProducts.show();
            });



	    this.refresh = function(currentProduct) { // currentMission initially null at start
	      //alertContainer.textContent = "";        // not null after creation of status change
	      //missionsList.reset();
	      //missionDetails.reset();
	      //missionsList.show(function() {
	        //missionsList.autoclick(currentProduct); 
	      //}); // closure preserves visibility of this
	      
	    };

	  }
}

        function LastViewedList(_listcontainer, _listcontainerbody) {

            this.listcontainer = _listcontainer;
            this.listcontainerbody = _listcontainerbody;

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

                this.listcontainer.style.visibility = "visible";
            }
        }

        function ResultsList(_listcontainer, _listcontainerbody){
            this.listcontainer = _listcontainer;
            this.listcontainerbody = _listcontainerbody;

            this.show = function () {
                var self = this; //Important!

                makeCall("GET", 'Results', null,
                    // callback function
                    function (req) {
                        if (req.readyState === XMLHttpRequest.DONE) { // == 4
                            var message = req.responseText;
                            if (req.status === 200) {
                                var productToShow = JSON.parse(req.responseText);

                                if (productToShow.length === 0) {
                                    alert("No results"); //for demo purposes
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
                    });
            }

            this.update = function (productArray) {
                var row, idCell, nameCell, priceCell;
                this.listcontainerbody.innerHTML = ""; // empty the table body

                // build updated list
                var self = this;
                productArray.forEach(function (product) { // self visible here, not this
                    //Create a row for each conference
                    row = document.createElement("tr");

                    idCell = document.createElement("td");
                    idCell.textContent = product.id;
                    row.appendChild(idCellCell);

                    nameCell = document.createElement("td");
                    nameCell.textContent = product.name;
                    row.appendChild(nameCell);

                    priceCell = document.createElement("td");
                    priceCell.textContent = product.price;
                    row.appendChild(priceCell);

                    // Add row to table body
                    self.listcontainerbody.appendChild(row);
                });

                this.listcontainer.style.visibility = "visible";
            }
        }


}