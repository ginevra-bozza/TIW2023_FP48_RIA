package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import it.polimi.tiw.DAO.ProductDAO;
import it.polimi.tiw.DAO.SupplierDAO;
import it.polimi.tiw.beans.Order;
import it.polimi.tiw.beans.Product;
import it.polimi.tiw.beans.Supplier;
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
		Map<Product,Integer> orderCart = new HashMap<Product,Integer>();
		
		SupplierDAO supplierDao = new SupplierDAO(connection);
		ProductDAO productDao = new ProductDAO(connection);
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
	        String supplier_name = jsonObject.get("supplier_name").getAsString();
	        System.out.println("Supplier ID: " + supplier_id);
	        int total = jsonObject.get("totalValue").getAsInt();
	        //int shipment_price = jsonObject.get("totalValue").getAsInt();
	        // Extract productsArray
	        JsonArray productsArray = jsonObject.get("productsArray").getAsJsonArray();
	        System.out.println("Products:");

	        // Iterate over the products and print their details
	        for (int i = 0; i < productsArray.size(); i++) {
	            JsonObject productObject = productsArray.get(i).getAsJsonObject();
	            Product product = new Product();
	            product.setProduct_id(productObject.get("product_id").getAsInt());
	            product.setName(productObject.get("name").getAsString());
	            product.setPrice(productObject.get("price").getAsInt());
	            product.setSupplier_id(supplier_id);
				int quantity = productObject.get("quantity").getAsInt();
	            
				orderCart.put(product, quantity);

	    }
		//check data validity
		
		} catch (NumberFormatException e) {
			
			System.out.println("Printed orders");
		} 
		//userOrders = order.getOrdersByUser(user.getEmail());		
		
		try {
		if(supplier_id != 0) {
			Supplier checkSupplier = supplierDao.findSupplierById(supplier_id);
			if(checkSupplier.getSupplier_name().equals(supplier_name)) {
				for(Product p: orderCart.keySet()) {
					Product checkProduct = productDao.findProductByID(p.getProduct_id(),p.getSupplier_id());
					if(checkProduct.getPrice() == p.getPrice())
				}
			}
		
			//int total= user.getTotalBySupplierId(supplier_id);
			//int shipment_price = supplierDao.getShipmentPrice(supplier_id,user.getCart().get(supplier_id), total);
			
			//order.createOrder(user, supplier_id, supplier_name, total + shipment_price);
			//user.getCart().remove(supplier_id);
			//session.setAttribute("currentUser",user);
			
			}
		}catch (){
			
		}
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		//response.getWriter().println(productDetailsJson);
	}
	

}
