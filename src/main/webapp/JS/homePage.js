{
	let missionDetails, productList, wizard,
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
            personalMessage = new PersonalMessage(sessionStorage.getItem('name'),
                document.getElementById("id_name"));
            personalMessage.show();

            productList = new LastViewedList(
                alertContainer,
                document.getElementById("id_listcontainer"),
                document.getElementById("id_listcontainerbody"));
            productList.show();
            /*//missionDetails = new MissionDetails({ // many parameters, wrap them in an
              // object
              //alert: alertContainer,
              //detailcontainer: document.getElementById("id_detailcontainer"),
              expensecontainer: document.getElementById("id_expensecontainer"),
              expenseform: document.getElementById("id_expenseform"),
              closeform: document.getElementById("id_closeform"),
              date: document.getElementById("id_date"),
              destination: document.getElementById("id_destination"),
              status: document.getElementById("id_status"),
              description: document.getElementById("id_description"),
              country: document.getElementById("id_country"),
              province: document.getElementById("id_province"),
              city: document.getElementById("id_city"),
              fund: document.getElementById("id_fund"),
              food: document.getElementById("id_food"),
              accomodation: document.getElementById("id_accomodation"),
              transportation: document.getElementById("id_transportation")
            });
            missionDetails.registerEvents(this); // the orchestrator passes itself --this-- so that the wizard can call its refresh function after updating a mission
  wizard = new Wizard(document.getElementById("id_createmissionform"), alertContainer);
            wizard.registerEvents(this);  // the orchestrator passes itself --this-- so that the wizard can call its refresh function after creating a mission

            document.querySelector("a[href='Logout']").addEventListener('click', () => {
              window.sessionStorage.removeItem('username');
            })
          };
           */


            /* this.refresh = function(currentMission) { // currentMission initially null at start
               alertContainer.textContent = "";        // not null after creation of status change
               productList.reset();
               missionDetails.reset();
               productList.show(function() {
                 productList.autoclick(currentMission);
               }); // closure preserves visibility of this
               wizard.reset();
             };
           }
     }*/
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
                            if (req.readyState == XMLHttpRequest.DONE) { // == 4
                                var message = req.responseText;
                                if (req.status == 200) {
                                    var productToShow = JSON.parse(req.responseText);

                                    if (productToShow.length == 0) {
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
                    var row, priceCell;
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


}