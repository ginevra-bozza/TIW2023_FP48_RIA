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

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

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
	private TemplateEngine templateEngine;
	private Connection connection = null;
	private boolean checkMethod = false;
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
		
		ProductDAO product = new ProductDAO(connection);
		if(productList != null)
			productList.clear();
		productList = product.searchProduct((String) session.getAttribute("searchedProduct"));
			String path ="/WEB-INF/Results.html";
			ServletContext servletContext = getServletContext();
			final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
			ctx.setVariable("productList", productList);
			ctx.setVariable("checkMethod", checkMethod);
			templateEngine.process(path, ctx, response.getWriter());
	}


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// If the user is not logged in (not present in session) redirect to the login
				checkMethod = true;
				
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
					response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Incorrect param values");
					return;
				}

				ProductDAO productDAO = new ProductDAO(connection);
				SupplierDAO supplierDAO = new SupplierDAO(connection);
				User user = (User)session.getAttribute("currentUser");
				
				List<Product> product = new ArrayList<Product>();
				product = productDAO.findProductByID(product_Id);
				
				
				for(Product p : product) 
						p.setVisualized(true);
				
				user.addToVisualizedList(product.get(0));
				
				Map<Integer,Supplier> supplier_info = new HashMap<>();
				supplier_info = supplierDAO.findSuppliers(product_Id);
				
				if (product == null || supplier_info == null) {
					response.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found");
					return;
				}
				
				// Redirect to the Home page and add missions to the parameters
				String path = "/WEB-INF/Results.html";
				ServletContext servletContext = getServletContext();
				final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
				ctx.setVariable("productList", productList);
				ctx.setVariable("product_id", product_Id);
				ctx.setVariable("supplier_info", supplier_info);
				ctx.setVariable("product_name", product.get(0).getName());
				ctx.setVariable("category", product.get(0).getCategory());
				ctx.setVariable("description", product.get(0).getDescription());
				ctx.setVariable("checkMethod", checkMethod);
				templateEngine.process(path, ctx, response.getWriter());
				checkMethod = false;
				
				
	}
	
	
	
	public void destroy() {
		try {
			ConnectionHandler.destroyConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

}
