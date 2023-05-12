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

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import it.polimi.tiw.DAO.OrderDAO;
import it.polimi.tiw.DAO.SupplierDAO;
import it.polimi.tiw.beans.Order;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.utils.ConnectionHandler;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
/**
 * Servlet implementation class Order
 */
@WebServlet("/Orders")
public class OrderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private TemplateEngine templateEngine;
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

		
		}
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		
		User user = new User();
		OrderDAO order = new OrderDAO(connection);
		user = (User)session.getAttribute("currentUser");
		
		
		SupplierDAO supplierDao = new SupplierDAO(connection);
		int supplier_id = 0;
		List<Order> userOrders = new ArrayList<Order>();
		
		try {
			//supplier_id = Integer.parseInt(request.getParameter("supplier_id"));
			String jsonToParse = request.getParameter("order");
			
			String decodedJson = URLDecoder.decode(jsonToParse, "UTF-8");
			
			System.out.println(decodedJson);
			
			Gson g = new Gson();

			Gson gson = new Gson();

	        // Parse the JSON string into a JsonObject
	        JsonObject jsonObject = gson.fromJson(decodedJson, JsonObject.class);

	        // Extract supplier_id
	        supplier_id = jsonObject.get("supplier_id").getAsInt();
	        System.out.println("Supplier ID: " + supplier_id);
	        //int total = jsonObject.get("totalValue").getAsInt();
	        //int shipment_price = jsonObject.get("totalValue").getAsInt();
	        // Extract productsArray
	        JsonArray productsArray = jsonObject.get("productsArray").getAsJsonArray();
	        System.out.println("Products:");

	        // Iterate over the products and print their details
	        for (int i = 0; i < productsArray.size(); i++) {
	            JsonObject productObject = productsArray.get(i).getAsJsonObject();
	            int product_id = productObject.get("product_id").getAsInt();
	            String name = productObject.get("name").getAsString();
	            String price = productObject.get("price").getAsString();
	            String quantity = productObject.get("quantity").getAsString();

	            System.out.println("Product " + (i + 1));
	            System.out.println("Product ID: " + product_id);
	            System.out.println("Name: " + name);
	            System.out.println("Price: " + price);
	            System.out.println("Quantity: " + quantity);
	            System.out.println();
	        
	    }
		
		if(supplier_id != 0) {
			//String supplier_name = supplierDao.findSupplierById(supplier_id).getSupplier_name();
			//int total= user.getTotalBySupplierId(supplier_id);
			//int shipment_price = supplierDao.getShipmentPrice(supplier_id,user.getCart().get(supplier_id), total);
			
			//order.createOrder(user, supplier_id, supplier_name, total + shipment_price);
			//user.getCart().remove(supplier_id);
			//session.setAttribute("currentUser",user);
			
			}
		} catch (NumberFormatException e) {
			
			System.out.println("Printed orders");
		} 
		//userOrders = order.getOrdersByUser(user.getEmail());		
		
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		//response.getWriter().println(productDetailsJson);
	}

}
