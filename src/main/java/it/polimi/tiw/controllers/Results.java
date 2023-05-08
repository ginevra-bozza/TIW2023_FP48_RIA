package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
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

import org.apache.commons.lang.StringEscapeUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimi.tiw.DAO.ProductDAO;
import it.polimi.tiw.DAO.SupplierDAO;
import it.polimi.tiw.beans.Product;
import it.polimi.tiw.beans.Supplier;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.utils.ConnectionHandler;

/**
 * Servlet implementation class Results
 */
@WebServlet("/Results")
public class Results extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	List<Product> productList = null;

       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Results() {
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

		
		User user = (User) session.getAttribute("user");

		String searchedProduct = null;
		try {

			searchedProduct = request.getParameter("textSearch");
			// check the validity
			if (searchedProduct == null || searchedProduct.isEmpty()) {
				throw new Exception("Missing or empty credential value");
			}
		} catch (Exception e) {

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
			response.getWriter().println("Input Error");
			return;

		}
		
		ProductDAO product = new ProductDAO(connection);
		if(productList != null)
			productList.clear();
			productList = product.searchProduct(searchedProduct);
			
			String productJson = "[";
			for (Product p : productList) {
				productJson += "{\"id\":" + p.getProduct_id() + ",\"name\":\"" + p.getName()
						 + "\",\"price\":\""	+ p.getPrice() + "\"},";
			}
			productJson = productJson.substring(0, productJson.length() - 1);
			
			productJson += "]";
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().println(productJson);
	}


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// If the user is not logged in (not present in session) redirect to the login
				
				
				String loginpath = getServletContext().getContextPath() + "/index.html";
				HttpSession session = request.getSession();
				if (session.isNew() || session.getAttribute("currentUser") == null) {
					System.out.println("User is: "+session.getAttribute("currentUser"));
					response.sendRedirect(loginpath);
					return;
					}
				//get product details
				Integer product_Id = null;
				try {
					product_Id = Integer.parseInt(request.getParameter("product_id"));
				} catch (NumberFormatException | NullPointerException e) {
					// only for debugging e.printStackTrace();
					System.out.println(product_Id);
					response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Incorrect param values");
					return;
				}

				ProductDAO productDAO = new ProductDAO(connection);
				SupplierDAO supplierDAO = new SupplierDAO(connection);
				User user = (User)session.getAttribute("currentUser");
				
				List<Product> product = new ArrayList<Product>();
				product = productDAO.findProductByID(product_Id);
				
				Map<Supplier,Integer> supplier_info = new HashMap<>();
				for(Product p : product) {
					p.setVisualized(true);
					Supplier supplier = supplierDAO.findSupplierById(p.getSupplier_id());
					supplier_info.put(supplier,p.getPrice());
				}
				user.addToVisualizedList(product.get(0));
				
				if (product == null || supplier_info == null) {
					response.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found");
					return;
				}
				Gson gson = new GsonBuilder().create();

				String productDetailsJson = "";
				Product detailedProduct = product.get(0);
				
				productDetailsJson = "[{\"id\":" + detailedProduct.getProduct_id() 
						+ ",\"name\":\"" + detailedProduct.getName()
						+ "\",\"description\":\"" + detailedProduct.getDescription()
						+ "\",\"category\":\"" + detailedProduct.getCategory()
						+ "\",\"image\":\"" + detailedProduct.getImage() + "\",\"suppliers:\":";
				String supplierString = "[";
				
				for (Supplier s: supplier_info.keySet()) {
					supplierString +=  gson.toJson(s);
					supplierString = supplierString.substring(0, supplierString.length() - 1);
					supplierString += ",\"price\":" + supplier_info.get(s) + "},";
				}
				supplierString = supplierString.substring(0, supplierString.length() - 1);
				supplierString += "]";
				
				
				productDetailsJson += supplierString + "}]";
				
				System.out.println(productDetailsJson);
				response.setStatus(HttpServletResponse.SC_OK);
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.getWriter().println(productDetailsJson);
				
	}

	
	
	
	public void destroy() {
		try {
			ConnectionHandler.destroyConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

}
