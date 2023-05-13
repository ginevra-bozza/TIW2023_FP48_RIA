package it.polimi.tiw.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import it.polimi.tiw.beans.Order;
import it.polimi.tiw.beans.Product;
import it.polimi.tiw.beans.User;

public class OrderDAO {

	private Connection con;
	private ResultSet result = null;
	private ResultSet orderId_result = null;
	private ResultSet product_result = null;

	public OrderDAO(Connection connection) {
		this.con = connection;
	}

	public List<Order> getOrdersByUser(String email) {
		
		String query = "SELECT order_id, total, shipment_date, shipment_address, supplier_id, supplier_name FROM online_order where email = ? ORDER BY shipment_date desc";
		String orderedProducts_query = "SELECT product.product_id, product_name, category, image, price, quantity FROM product left join completedorders c on product.product_id = c.product_id WHERE order_id = ? AND product.supplier_id = ?";
		List<Order> orders = new ArrayList<Order>();
		orders.clear();
		
		PreparedStatement pstatement;
		PreparedStatement orderedProducts_pstatement;
		
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setString(1, email);
			result = pstatement.executeQuery();
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while(result.next()) {
				Order order = new Order();
				
				order.setEmail(email);
				order.setOrder_id(result.getInt("order_id"));
				order.setSupplier_id(result.getInt("supplier_id"));
				order.setSupplier_name(result.getString("supplier_name"));
				order.setTotal(result.getInt("total"));
				order.setShipment_date(result.getDate(3));
				order.setShipment_address(result.getString("shipment_address"));
				
				orderedProducts_pstatement = con.prepareStatement(orderedProducts_query);
				orderedProducts_pstatement.setInt(1, order.getOrder_id());
				orderedProducts_pstatement.setInt(2, order.getSupplier_id());
				product_result = orderedProducts_pstatement.executeQuery();
				
				while(product_result.next()) {
					Product product = new Product();
					
					product.setProduct_id(product_result.getInt("product_id"));
					product.setName(product_result.getString("product_name"));
					product.setCategory(product_result.getString("category"));
					//product.setImage(result.getString("image"));
					product.setPrice(product_result.getInt("price"));
					product.setQuantity(product_result.getInt("quantity"));
					order.getProducts().add(product);
				}
				
				orders.add(order);	
			}
					
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return orders;
	}
	
	public void createOrder(User user, ArrayList<Product> orderCart, int supplier_id, String supplier_name, int totalValue) {
		
		String shipment_address = user.getAddress();
		String email = user.getEmail();
		int order_id = 0;
		
		String query = "INSERT INTO online_order (total, email, supplier_id, supplier_name, shipment_date, shipment_address) VALUE (?,?,?,?,CURDATE(),?);";
		String orderId_query = "SELECT max(order_id) FROM online_order";
		String insert_query = "INSERT INTO completedOrders (order_id, email, supplier_id, product_id, quantity) VALUE (?,?,?,?,?);";
		
		PreparedStatement pstatement;
		PreparedStatement orderId_pstatement;
		PreparedStatement insert_pstatement;
		
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, totalValue);
			pstatement.setString(2, email);
			pstatement.setInt(3, supplier_id);
			pstatement.setString(4, supplier_name);
			pstatement.setString(5, shipment_address);
			pstatement.executeUpdate();
			
			orderId_pstatement = con.prepareStatement(orderId_query);
			orderId_result = orderId_pstatement.executeQuery();
			while(orderId_result.next()) {
				order_id = orderId_result.getInt("max(order_id)");
			}
			
			for(Product p : orderCart) {
				insert_pstatement = con.prepareStatement(insert_query);
				insert_pstatement.setInt(1, order_id);
				insert_pstatement.setString(2, email);
				insert_pstatement.setInt(3, supplier_id);
				insert_pstatement.setInt(4, p.getProduct_id());
				insert_pstatement.setInt(5, p.getQuantity());
				
				insert_pstatement.executeUpdate();	
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		
	}
}
