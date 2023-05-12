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

import it.polimi.tiw.DAO.OrderDAO;
import it.polimi.tiw.DAO.SupplierDAO;
import it.polimi.tiw.beans.Order;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.utils.ConnectionHandler;

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
			supplier_id = Integer.parseInt(request.getParameter("supplier_id"));
			String jsonToParse = request.getParameter("order");
			System.out.println(jsonToParse);
			System.out.println(supplier_id);
			
		if(supplier_id != 0) {
			String supplier_name = supplierDao.findSupplierById(supplier_id).getSupplier_name();
			int total= user.getTotalBySupplierId(supplier_id);
			int shipment_price = supplierDao.getShipmentPrice(supplier_id,user.getCart().get(supplier_id), total);
			
			order.createOrder(user, supplier_id, supplier_name, total + shipment_price);
			user.getCart().remove(supplier_id);
			session.setAttribute("currentUser",user);
			
			}
		} catch (NumberFormatException e) {
			
			System.out.println("Printed orders");
		} 
		userOrders = order.getOrdersByUser(user.getEmail());		
		String path ="/WEB-INF/Orders.html";
		ServletContext servletContext = getServletContext();
		final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
		ctx.setVariable("userOrders", userOrders);
		
		templateEngine.process(path, ctx, response.getWriter());
	}

}
