/**
 * AJAX call management
 */

	function makeCall(method, url, formElement, cback, reset = true) {
		console.log("makeCall on "+method+ " "+url+" "+reset); //debug
	    var req = new XMLHttpRequest(); // visible by closure
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
	  
function linkButton(id, cb) {
 	 	var button = document.getElementById(id);
  		button.addEventListener('click', (e) => {
    	e.preventDefault();
    	cb();
  });
}

function buildLittleProduct(product) {
  var product_Container, product_id, name, price, viewButton;

  product_Container = document.createElement('div');
  product_Container.classList.add('Product');

  // product ID
  product_id = document.createElement('p');
  product_id.classList.add('product_id');
  product_id.textContent = product['id'];
  product_Container.appendChild(product_id);

  // product NAME
  name = document.createElement('p');
  name.classList.add('product_name');
  name.textContent = product['name'];
  product_Container.appendChild(name);

  // product PRICE
  price = document.createElement('p');
  price.classList.add('price');
  price.textContent = product['price'] + '€';
  product_Container.appendChild(price);

  //buttom for Visualized the item
  var viewDiv = document.createElement('div');
  viewDiv.id = 'view';
  viewDiv.classList.add('view');
  viewButton = document.createElement('button');
  viewButton.classList.add('view-button');

  var span = document.createElement('SPAN');
  span.textContent = 'Details';

  viewButton.appendChild(span);
  viewDiv.appendChild(viewButton);
  product_Container.appendChild(viewDiv);

  viewButton.addEventListener('click', (e) => {
    //call the POST in the server
    doView(product_id.textContent, product);
  });

  return product_Container;
}
