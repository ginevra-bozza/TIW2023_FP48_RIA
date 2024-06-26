package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import it.polimi.tiw.DAO.OrderDAO;
import it.polimi.tiw.DAO.ProductDAO;
import it.polimi.tiw.DAO.SupplierDAO;
import it.polimi.tiw.beans.Order;
import it.polimi.tiw.beans.Product;
import it.polimi.tiw.beans.Supplier;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.utils.ConnectionHandler;
import it.polimi.tiw.utils.ParametersNotMatchingException;
import java.net.URLDecoder;

/**
 * Servlet implementation class Order
 * This servlet is called when a new order is placed or when the user clicks on the menu link "Orders"
 * After check for the validity of parameters, saves the new order in the database, and sends to the client the list of orders for that user
 * 
 */
@WebServlet("/Orders")
public class OrderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;   
    /**
     * @see HttpServlet#HttpServlet()
     */
    public OrderServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    public void init() throws ServletException {
    	ServletContext servletContext = getServletContext();
		connection = ConnectionHandler.getConnection(servletContext);
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		HttpSession session = request.getSession();
		String loginpath = getServletContext().getContextPath() + "/index.html";
		
		if (session.isNew() || session.getAttribute("currentUser") == null) {
			System.out.println("User is: "+session.getAttribute("currentUser"));
			response.sendRedirect(loginpath);
			return;
		}
		
		OrderDAO order = new OrderDAO(connection);
		User user = new User();
		user = (User)session.getAttribute("currentUser");
		
		Gson gson = new Gson();
		List<Order> ordersList = new ArrayList<Order>();
		
		ordersList = order.getOrdersByUser(user.getEmail());
		
		if(ordersList == null || ordersList.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_NO_CONTENT);
		} else {
			gson = new GsonBuilder().create();
		
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().println(gson.toJson(ordersList));
		}
			
}
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		
		String loginpath = getServletContext().getContextPath() + "/index.html";
		
		if (session.isNew() || session.getAttribute("currentUser") == null) {
			System.out.println("User is: "+session.getAttribute("currentUser"));
			response.sendRedirect(loginpath);
			return;
		}
		
		User user = new User();
		OrderDAO order = new OrderDAO(connection);
		user = (User)session.getAttribute("currentUser");
		ArrayList<Product> orderCart = new ArrayList<Product>();
		
		SupplierDAO supplierDao = new SupplierDAO(connection);
		ProductDAO productDao = new ProductDAO(connection);
		int supplier_id = 0;
		String supplier_name = null;
		int totalValue = 0;
		int total = 0;
		int shipment_price = 0;
		List<Order> ordersList = new ArrayList<Order>();
		Gson gson;
		
		try {
			
			String jsonToParse = request.getParameter("order");
			String decodedJson = URLDecoder.decode(jsonToParse, "UTF-8");
			
			gson = new Gson();

	        // Parse the JSON string into a JsonObject
	        JsonObject jsonObject = gson.fromJson(decodedJson, JsonObject.class);

	        // Extract supplier data
	        supplier_id = jsonObject.get("supplier_id").getAsInt();
	        supplier_name = jsonObject.get("supplier_name").getAsString();
	        total = jsonObject.get("totalValue").getAsInt();
	        shipment_price = jsonObject.get("shipment_price").getAsInt();
	        
	        // Extract productsArray
	        JsonArray productsArray = jsonObject.get("productsArray").getAsJsonArray();
	      
	        // Iterate over the products and print their details
	        for (int i = 0; i < productsArray.size(); i++) {
	            JsonObject productObject = productsArray.get(i).getAsJsonObject();
	            Product product = new Product();
	            product.setProduct_id(productObject.get("product_id").getAsInt());
	            product.setName(productObject.get("name").getAsString());
	            product.setPrice(productObject.get("price").getAsInt());
	            product.setSupplier_id(supplier_id);
	            product.setQuantity(productObject.get("quantity").getAsInt());
		
				orderCart.add(product);
	        }
		
		} catch (NumberFormatException e) {
			
			System.out.println("Printed orders");
		} 
		
		try {
			//check the validity of the data sent by the client before creating the order
			
			if(supplier_id <= 0 && supplier_id > 20) {
				System.out.println("Failed on supplier_id " +supplier_id);
				throw new ParametersNotMatchingException();
			}
				
			
			Supplier checkSupplier = supplierDao.findSupplierById(supplier_id);
			if(!checkSupplier.getSupplier_name().equals(supplier_name)) {
				System.out.println("Failed on supplier_name:  " +supplier_name+ " vs "+checkSupplier.getSupplier_name());
				throw new ParametersNotMatchingException();
			}
			
			for(Product p: orderCart) {
				Product checkProduct = productDao.findProductByID(p.getProduct_id(),p.getSupplier_id());
				if(checkProduct.getPrice() != p.getPrice() || !checkProduct.getName().equals(p.getName())) {
					System.out.println("Failed on price:  " +p.getPrice()+ " vs "+checkProduct.getPrice()+" or product name: "+p.getName()+ " vs "+checkProduct.getName());
					throw new ParametersNotMatchingException();
				}
				totalValue += p.getPrice() * p.getQuantity();
				
			}
			if(totalValue != total) {
				System.out.println("Failed on total:  " +total+ " vs "+totalValue);
				throw new ParametersNotMatchingException();
			}
				
			if(supplierDao.getShipmentPrice(supplier_id, orderCart , total) != shipment_price){
				System.out.println("Failed on shipment_price:  " +shipment_price+ " vs "+supplierDao.getShipmentPrice(supplier_id, orderCart , total));
				throw new ParametersNotMatchingException();
			}
			response.setStatus(HttpServletResponse.SC_OK);
			//create a new order and gets the list of orders
			order.createOrder(user, orderCart, supplier_id, supplier_name, totalValue);
			ordersList = order.getOrdersByUser(user.getEmail());
			
			gson = new GsonBuilder().create();
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().println(gson.toJson(ordersList));
		
		}catch (ParametersNotMatchingException e){
	
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().println("Error: you tried to send incorrect data");
		}
		
		
	
		
	}
	

}
