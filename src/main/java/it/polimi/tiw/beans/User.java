package it.polimi.tiw.beans;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import it.polimi.tiw.DAO.SupplierDAO;

public class User {
	private String name;
	private String surname;
	private String password;
	private String email;
	private String address;
	private List<Product> visualizedProducts = new ArrayList<Product>();
	private Map<Integer, ArrayList<Product>> cart = new HashMap<Integer, ArrayList<Product>>();

	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Map<Integer, ArrayList<Product>> getCart() {
		return cart;
	}
	public void setCart(Map<Integer, ArrayList<Product>> cart) {
		this.cart = cart;
	}
	public List<Product> getVisualizedProducts() {
		return visualizedProducts;
	}

	public void setVisualizedProducts(List<Product> visualizedProducts) {
		this.visualizedProducts = visualizedProducts;
	}
	public void addToVisualizedList(Product visualizedProduct) {
		Boolean check = false;
		for(Product p: visualizedProducts) {
			if(p.getProduct_id() == visualizedProduct.getProduct_id())
				check = true;
		}
		if(!check) //if that product_id is not present in the list
			visualizedProducts.add(0, visualizedProduct);
	}
	
	public int getTotalBySupplierId(int supplier_id){
			int total = 0;
			for(Product p: cart.get(supplier_id)) {
				for(int i=1; i<=p.getQuantity();i++ )
					total+=p.getPrice();
			}
			return total;
			}
	
}
