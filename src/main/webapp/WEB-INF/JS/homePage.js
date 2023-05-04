function goToHomePage(){
	var errorContainer = document.getElementById('errorMessage');
  	errorContainer.style.display = 'none';
  	makeCall('GET','HomePage', null,(req) => {
    if (req.readyState == XMLHttpRequest.DONE) {
      var responseBody = req.responseText;
      document.getElementById('pageContainer').innerHTML = '';
      switch (req.status) {
        case 200:
          // request was successful, go to home page
          console.log(responseBody);
          var products = JSON.parse(responseBody);

          var pageContainer = document.getElementById('pageContainer');
          // create heading
          var heading = document.createElement('h3');
          heading.textContent = 'Last visualized products';
          pageContainer.appendChild(heading);
          // create list
          var listContainer = buildLastViewed(products);
          pageContainer.appendChild(listContainer);
          break;

        default:
          // request failed, display error
          errorContainer.style.display = 'block';
          document.getElementById('errorBody').textContent = responseBody;
          break;
          
			}
		}
	});
}

function buildLastViewed(products) {
  var container = document.createElement('div');

  products.forEach((product, i) => {
    container.appendChild(buildLittleProduct(product));
  });
  return container;
}