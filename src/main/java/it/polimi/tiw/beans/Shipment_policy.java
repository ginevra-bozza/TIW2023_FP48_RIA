package it.polimi.tiw.beans;
/**
 * This class represent the database implementation of the shipmentPolicy
 * @author emanuele
 *
 */
public class Shipment_policy {
	private int supplier_id;
	private int minimum;
	private int maximum;
	private int shipment_price;
	
	public int getSupplier_id() {
		return supplier_id;
	}
	public void setSupplier_id(int supplier_id) {
		this.supplier_id = supplier_id;
	}
	public int getMinimum() {
		return minimum;
	}
	public void setMinimum(int minimum) {
		this.minimum = minimum;
	}
	public int getMaximum() {
		return maximum;
	}
	public void setMaximum(int maximum) {
		this.maximum = maximum;
	}
	public int getShipment_price() {
		return shipment_price;
	}
	public void setShipment_price(int shipment_price) {
		this.shipment_price = shipment_price;
	}
	
	
}
