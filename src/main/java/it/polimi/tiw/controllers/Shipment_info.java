package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
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

import it.polimi.tiw.beans.Shipment_policy;
import it.polimi.tiw.beans.Supplier;
import it.polimi.tiw.utils.ConnectionHandler;

/**
 * Servlet implementation class Shipment_info
 */
@WebServlet("/Shipment_info")
public class Shipment_info extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private TemplateEngine templateEngine;
	private Connection connection = null;

       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Shipment_info() {
        super();
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
		List<Supplier> supplier_info = null;
		int supplier_id;
		List<Shipment_policy> shipment_policies = null;
		
		HttpSession session = request.getSession();
		//prende supplier_id dal thymeleaf e supplier_info dalla session (Settato in results, riga 117)
		supplier_id = Integer.parseInt(request.getParameter("supplier_id"));
		supplier_info = (List<Supplier>) session.getAttribute("supplier_info");
		//non funziona perchè è una mappa, non una lista
		
		//il metodo dovrebbe ritornare la lista di shipment policies per un dato supplier id, per poter iterare su questa nell'html
		shipment_policies = supplier_info.get(supplier_id).getShipment_policy();
		
		String path ="/WEB-INF/Results.html";
		ServletContext servletContext = getServletContext();
		final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
		ctx.setVariable("shipment_policies", shipment_policies);
			
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
