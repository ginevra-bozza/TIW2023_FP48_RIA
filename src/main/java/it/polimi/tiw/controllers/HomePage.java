package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
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

import it.polimi.tiw.DAO.ProductDAO;
import it.polimi.tiw.beans.Product;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.utils.ConnectionHandler;

/**
 * Servlet implementation class HomePage
 */
@WebServlet("/HomePage")
public class HomePage extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private TemplateEngine templateEngine;
	private List<Product> visualizedProducts;
	private ProductDAO productDAO = null;
	private Connection connection = null;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public HomePage() {
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

		String path = "/WEB-INF/Home.html";
		ServletContext servletContext = getServletContext();
		HttpSession session = request.getSession();
		
		productDAO = new ProductDAO(connection);
		User user = new User();
		user = (User)session.getAttribute("currentUser");
		visualizedProducts = user.getVisualizedProducts();
		
		//fill visualizedProducts list with random elements
		if(visualizedProducts.size() < 5) {
			List<Product> randomProductsList = productDAO.getRandomProducts(5 - visualizedProducts.size());
			visualizedProducts.addAll(randomProductsList);
			user.setVisualizedProducts(visualizedProducts);
			session.setAttribute("currentUser",user);
		}
		
		//Gson gson = new GsonBuilder().create();
		String productJson = "[";
		for (Product p : visualizedProducts) {
			productJson += "{\"id\":" + p.getProduct_id() + ",\"name\":\"" + p.getName()
					 + "\",\"price\":\""	+ p.getPrice() + "\",";
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
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	
	

}
