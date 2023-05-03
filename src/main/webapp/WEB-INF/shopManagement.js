/**
 * 
 */
// page components
	  let missionDetails, missionsList, wizard,
	    pageOrchestrator = new pageOrchestrator(); // main controller

	  window.addEventListener("load", () => {
	    if (sessionStorage.getItem("username") == null) {
	      window.location.href = "index.html";
	    } else {
	      pageOrchestrator.start(); // initialize the components
	      pageOrchestrator.refresh();
	    } // display initial content
	  }, false);

	function SearchMessage(_search, messagecontainer) {
			this.search = _search;
			this.show = function() {
				messagecontainer.textContent = this.username;
			}
		}

function ShopEvents(options) {
	    this.alert = options['alert'];
	    this.detailcontainer = options['detailcontainer'];
	    this.expensecontainer = options['expensecontainer'];
	    this.expenseform = options['expenseform'];
	    this.closeform = options['closeform'];
	    this.date = options['date'];
	    this.destination = options['destination'];
	    this.status = options['status'];
	    this.description = options['description'];
	    this.country = options['country'];
	    this.province = options['province'];
	    this.city = options['city'];
	    this.fund = options['fund'];
	    this.food = options['food'];
	    this.accomodation = options['accomodation'];
	    this.travel = options['transportation'];
	    
	    
	    this.search = options['']

	    this.registerEvents = function(orchestrator) {
	      this.expenseform.querySelector("input[type='button']").addEventListener('click', (e) => {
	        var form = e.target.closest("form");
	        if (form.checkValidity()) {
	          var self = this,
	            missionToReport = form.querySelector("input[type = 'hidden']").value;
	          makeCall("POST", 'CreateExpensesReport', form,
	            function(req) {
	              if (req.readyState == 4) {
	                var message = req.responseText;
	                if (req.status == 200) {
	                  orchestrator.refresh(missionToReport);
	                } else if (req.status == 403) {
                  window.location.href = req.getResponseHeader("Location");
                  window.sessionStorage.removeItem('username');
                  }
                  else {
	                  self.alert.textContent = message;
	                }
	              }
	            }
	          );
	        } else {
	          form.reportValidity();
	        }
	      });

	      this.closeform.querySelector("input[type='button']").addEventListener('click', (event) => {
	        var self = this,
	          form = event.target.closest("form"),
	          missionToClose = form.querySelector("input[type = 'hidden']").value;
	        makeCall("POST", 'CloseMission', form,
	          function(req) {
	            if (req.readyState == 4) {
	              var message = req.responseText;
	              if (req.status == 200) {
	                orchestrator.refresh(missionToClose);
	              } else if (req.status == 403) {
                  	window.location.href = req.getResponseHeader("Location");
                  	window.sessionStorage.removeItem('username');
                  }
                  else {
	                self.alert.textContent = message;
	              }
	            }
	          }
	        );
	      });
	    }
	    
	    //Initialize lists and containers
	function PageOrchestrator() {

		var search = document.getElementById("id_search");
		

		this.start = function() {

			search
			
			bin = document.getElementById("bin");
			bin.addEventListener('dragenter', (e) => dragEnter(e))
			bin.addEventListener('dragover', (e) => dragOver(e));
			bin.addEventListener('dragleave', (e) => dragLeave(e));
			bin.addEventListener('drop', (e) => binDrop(e));
			bin.style.visibility = "visible";

			personalMessage = new PersonalMessage(sessionStorage.getItem('username'),
				document.getElementById("id_username"));
			personalMessage.show();

			directoriesList = new DirectoriesList(alertContainer,
				document.getElementById("id_listcontainer"),
				docForm,
				subDirForm);

			subdirectoriesList = new SubdirectoriesList(alertContainer,
				docForm,
				subDirForm);

			documentsList = new DocumentsList(alertContainer,
				document.getElementById("id_listcontainer_doc"),
				docForm,
				subDirForm);


			documentDetails = new DocumentDetails({ //parameters are the elements of the "options" array
				alert: alertContainer,
				date: document.getElementById("id_date"),
				name: document.getElementById("id_name"),
				summary: document.getElementById("id_summary"),
				type: document.getElementById("id_type"),
				detailscontainer: document.getElementById("id_detailscontainer"),
				docForm: docForm,
				subDirForm: subDirForm
			});


			document.querySelector("a[href='Logout']").addEventListener('click', () => {
				window.sessionStorage.removeItem('username');
			})

			document.querySelector("a[id='GoBack']").addEventListener('click', () => {
				this.refresh();
				history.back();
			})

		};