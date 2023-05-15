/**
 * Login management, refers to the homePage
 */

(function() {

	document.getElementById("loginbutton").addEventListener('click', (e) => {
		var form = e.target.closest("form");
		
		if (form.checkValidity()) //end of "if" condition
		{
			makeCall("POST", 'CheckLogin',form,
				function(x) {
					if (x.readyState === XMLHttpRequest.DONE) {
						let message = x.responseText;
						console.log("Status: "+x.status);
						switch (x.status) {
							case 200:
								console.log(message);
								sessionStorage.setItem("userData",message);
								window.location.href = "Home.html";
								break;
							case 400: // bad request
								document.getElementById("errormessage").textContent = message;
								break;
							case 401: // unauthorized
								document.getElementById("errormessage").textContent = message;
								break;
							case 500: // server error
								document.getElementById("errormessage").textContent = message;
								break;
						}
					}
				}
			);
		} else {
			form.reportValidity();
		}
	});


	

})();
