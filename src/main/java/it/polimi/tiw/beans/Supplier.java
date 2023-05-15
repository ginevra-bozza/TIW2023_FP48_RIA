package it.polimi.tiw.beans;

import java.util.ArrayList;
import java.util.List;
/**
 * This class represent the database implementation of a Supplier
 * @author emanuele
 *
 */
public class Supplier {

	private int supplier_id;
	private String supplier_name;
	private int evaluation;
	private int free_shipment_price;
	private List<Shipment_policy> shipment_policy = new ArrayList<Shipment_policy>();
	
	public List<Shipment_policy> getShipment_policy() {
		return shipment_policy;
	}
	public void setShipment_policy(List<Shipment_policy> shipment_policy) {
		this.shipment_policy = shipment_policy;
	}
	public int getSupplier_id() {
		return supplier_id;
	}
	public void setSupplier_id(int supplier_id) {
		this.supplier_id = supplier_id;
	}
	public String getSupplier_name() {
		return supplier_name;
	}
	public void setSupplier_name(String supplier_name) {
		this.supplier_name = supplier_name;
	}
	public int getEvaluation() {
		return evaluation;
	}
	public void setEvaluation(int evaluation) {
		this.evaluation = evaluation;
	}
	public int getFree_shipment_price() {
		return free_shipment_price;
	}
	public void setFree_shipment_price(int free_shipment_price) {
		this.free_shipment_price = free_shipment_price;
	}
	
	
}
