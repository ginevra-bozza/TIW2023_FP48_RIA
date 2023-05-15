package it.polimi.tiw.beans;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
/**
 * This class represent the database implementation of an order
 * @author emanuele
 *
 */
public class Order {
	private int order_id ;
	private  int total;
	private  Date shipment_date;
	private  String email;
	private  int supplier_id;
	private String supplier_name;
	private String shipment_address;
	private List<Product> products = new ArrayList<Product>();	
	
	public String getShipment_address() {
		return shipment_address;
	}
	public void setShipment_address(String shipment_address) {
		this.shipment_address = shipment_address;
	}
	public String getSupplier_name() {
		return supplier_name;
	}
	public void setSupplier_name(String supplier_name) {
		this.supplier_name = supplier_name;
	}
	
	public List<Product> getProducts() {
		return products;
	}
	public void setProducts(List<Product> products) {
		this.products = products;
	}
	public int getOrder_id() {
		return order_id;
	}
	public void setOrder_id(int order_id) {
		this.order_id = order_id;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public Date getShipment_date() {
		return shipment_date;
	}
	public void setShipment_date(Date shipment_date) {
		this.shipment_date = shipment_date;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getSupplier_id() {
		return supplier_id;
	}
	public void setSupplier_id(int supplier_id) {
		this.supplier_id = supplier_id;
	}

}
