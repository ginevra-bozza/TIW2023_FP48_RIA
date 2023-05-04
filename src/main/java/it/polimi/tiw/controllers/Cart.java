package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;

import java.util.HashMap;

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

import it.polimi.tiw.DAO.ProductDAO;
import it.polimi.tiw.DAO.SupplierDAO;
import it.polimi.tiw.beans.Product;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.utils.ConnectionHandler;

/**
 * Servlet implementation class Chart
 */
@WebServlet("/Cart")
public class Cart extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private TemplateEngine templateEngine;
	private Connection connection = null;
	
	
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Cart() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    public void init() throws ServletException {
    	ServletContext servletContext = getServletContext();
		ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver(servletContext);
		templateResolver.setTemplateMode(TemplateMode.HTML);
		this.templateEngine = new TemplateEngine();
		this.templateEngine.setTemplateResolver(templateResolver);
		templateResolver.setSuffix(".html");
		connection = ConnectionHandler.getConnection(servletContext);
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("currentUser");
		Map<Integer, ArrayList<Product>> cart = new HashMap<Integer,ArrayList<Product>>();
		Map<Integer, Integer> shipment_prices = new HashMap<Integer,Integer>();
		ProductDAO product = new ProductDAO(connection);
		SupplierDAO supplierDao = new SupplierDAO(connection);
		int quantity = 0;
		int product_id = 0;
		int supplier_id = 0;
		int shipment_price = 0;

		if(user.getCart() == null)
			user.setCart(cart);
		
		try {
			quantity = Integer.parseInt(request.getParameter("quantity"));
			product_id = Integer.parseInt(request.getParameter("product_id"));
			supplier_id = Integer.parseInt(request.getParameter("supplier_id"));
			
			Product choosenProduct = product.findProductByID(product_id,supplier_id);
			if(quantity > 0) {
				choosenProduct.setQuantity(quantity);
			} else {
				response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid quantity when adding products to the cart");
				}
			
			if(user.getCart().containsKey(choosenProduct.getSupplier_id())) 
				user.getCart().get(choosenProduct.getSupplier_id()).add(choosenProduct);
			
			else {
				user.getCart().put(choosenProduct.getSupplier_id(), new ArrayList<Product>());
				user.getCart().get(choosenProduct.getSupplier_id()).add(choosenProduct);
				shipment_prices.remove(supplier_id);
			}
			shipment_price = supplierDao.getShipmentPrice(supplier_id,user.getCart().get(supplier_id),user.getTotalBySupplierId(supplier_id));
			shipment_prices.put(supplier_id,shipment_price);
			
		} catch (NumberFormatException e) {
			
			if(user.getCart().size() == 0 ) {
				System.out.println("Error: user has no cart");
				
			} else {
				System.out.println("Printed cart");

			}
		}
		
		
			
		
		session.setAttribute("currentUser",user);
		
		String path ="/WEB-INF/Cart.html";
		ServletContext servletContext = getServletContext();
		final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
		ctx.setVariable("shipment_prices", shipment_prices);
		templateEngine.process(path, ctx, response.getWriter());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
}
