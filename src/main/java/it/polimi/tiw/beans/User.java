package it.polimi.tiw.beans;

import java.util.ArrayList;
import java.util.List;

public class User {
	private String name;
	private String surname;
	private String password;
	private String email;
	private String address;
	private List<Product> visualizedProducts = new ArrayList<Product>();
	

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
		if(visualizedProducts.size() > 5) {
			visualizedProducts.remove(5);
		}
	}
	
	
}
