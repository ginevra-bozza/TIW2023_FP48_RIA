/**
 * AJAX call management
 */

	function makeCall(method, url, formElement, cback, reset = true) {
		console.log("makeCall on "+method+ " "+url+" "); //debug
	    let req = new XMLHttpRequest(); // visible by closure
	    req.onreadystatechange = function() {
	      cback(req)
	    }; // closure
	    req.open(method, url);
	    if (formElement == null) {
	      req.send();
	    } else {
	      req.send(new FormData(formElement));
	    }
	    if (formElement !== null && reset === true) {
	      formElement.reset();
	    }
	  }

    function doRequest(url, method, callback, form = null) {
        console.log("makeCall on "+method+ " "+url+" "); //debug
        console.log(form);
        var request = new XMLHttpRequest();
        request.onreadystatechange = () => callback(request);
        request.open(method, url);
        if (form == null) {
            request.send();
        } else {
            let fd = new FormData(form);
            request.send(fd);
        }
    }
	  
function linkButton(id, cb) {
 	 	var button = document.getElementById(id);
  		button.addEventListener('click', (e) => {
    	e.preventDefault();
    	cb();
  });
}


