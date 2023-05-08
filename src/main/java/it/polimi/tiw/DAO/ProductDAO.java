package it.polimi.tiw.DAO;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;



import java.sql.Blob;
import java.sql.Clob;

import it.polimi.tiw.beans.Product;

public class ProductDAO {
	private Connection con;
	private ResultSet result = null;

	public ProductDAO(Connection connection) {
		this.con = connection;
	}
	
	public List<Product> searchProduct (String productName) {
		List<Product> products = new ArrayList<Product>();

		//String query = "SELECT product_id, supplier_id, product_name, price FROM product WHERE product_name like ? or product_description like ?";// group by product_id having min(price)";
		String query = "SELECT p.product_id, p.supplier_id, p.product_name, p.price FROM product p JOIN (SELECT product_id, MIN(price) AS min_price FROM product WHERE product_name LIKE ? OR product_description LIKE ? GROUP BY product_id) AS sub ON p.product_id = sub.product_id AND p.price = sub.min_price";
		PreparedStatement pstatement;
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setString(1, "%"+productName+"%");
			pstatement.setString(2, "%"+productName+"%");
			result = pstatement.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while (result.next()) {
					Product product = new Product();
					product.setProduct_id(result.getInt("product_id"));
					product.setName(result.getString("product_name"));
					product.setPrice(result.getInt("price"));
					product.setSupplier_id(result.getInt("supplier_id"));
					products.add(product);
					}	
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return products;
		}

	public List<Product> findProductByID(Integer product_Id) throws IOException {
		List<Product> products = new ArrayList<Product>();
		String query = "SELECT  product_id, supplier_id, product_name, product_description, category, image, price  FROM product WHERE product_id = ? order by price asc;";
		PreparedStatement pstatement;
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, product_Id);
			result = pstatement.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while (result.next()) {
					Product product = new Product();
					product.setProduct_id(result.getInt("product_id"));
					product.setName(result.getString("product_name"));
					product.setPrice(result.getInt("price"));
					product.setCategory(result.getString("category"));
					product.setSupplier_id(result.getInt("supplier_id"));
					product.setImage(result.getString("image"));
					product.setDescription(result.getString("product_description"));
								
					products.add(product);
					
					}	
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return products;
		}

	public Product findProductByID(int product_id, int supplier_id) {
		Product product = new Product();
		String query = "SELECT * FROM product where product_id = ? and supplier_id = ?;";
		PreparedStatement pstatement;
		try {
			
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, product_id);
			pstatement.setInt(2, supplier_id);
			result = pstatement.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while (result.next()) {
					product.setProduct_id(result.getInt("product_id"));
					product.setName(result.getString("product_name"));
					product.setPrice(result.getInt("price"));
					product.setCategory(result.getString("category"));
					product.setSupplier_id(result.getInt("supplier_id"));
					product.setImage(result.getString("image"));
					product.setDescription(result.getString("product_description"));
			}	
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return product;
	}
	
	
	public List<Product> getRandomProducts(int listSize) {
		//create a list of random products from 'Electronics' category, to visualize on the home page
		List<Product> randomProducts = new ArrayList<Product>();
		String query = "SELECT * FROM product WHERE category = 'Electronics' ORDER BY RAND() LIMIT ?";
		
		PreparedStatement pstatement;
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, listSize);
			result = pstatement.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while (result.next()) {
					Product product = new Product();
					product.setProduct_id(result.getInt("product_id"));
					product.setName(result.getString("product_name"));
					product.setPrice(result.getInt("price"));
					product.setCategory(result.getString("category"));
					product.setSupplier_id(result.getInt("supplier_id"));
					product.setImage(result.getString("image"));
					product.setDescription(result.getString("product_description"));
					randomProducts.add(product);
			}	
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return randomProducts;
	}
}


	
	
	
	