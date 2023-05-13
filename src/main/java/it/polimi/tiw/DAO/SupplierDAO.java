package it.polimi.tiw.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import it.polimi.tiw.beans.Product;
import it.polimi.tiw.beans.Shipment_policy;
import it.polimi.tiw.beans.Supplier;

public class SupplierDAO {
	private Connection con;
	private ResultSet result = null;
	private ResultSet shipmentResult = null;
	private ResultSet priceResult = null;
	private ResultSet nameResult = null;
	private ResultSet supplierResult = null;
	
	
	public SupplierDAO(Connection con) {
		super();
		this.con = con;
	}
	

	private List<Shipment_policy>  setShipment_Info(Supplier supplier) {
		//join supplier e shipment_policy per avere la lista di min e max price
		// TODO Auto-generated method stub
		
		String query = "SELECT minimum, maximum, shipment_price, supplier_id from shipment_policy where supplier_id = ?";
		List<Shipment_policy> shipment_policies = new ArrayList<Shipment_policy>();
		shipment_policies.clear();
		
		PreparedStatement pstatement;
		try {
			
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, supplier.getSupplier_id());
			shipmentResult = pstatement.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while(shipmentResult.next()) {
				Shipment_policy shipment_policy = new Shipment_policy();
				
				shipment_policy.setSupplier_id(shipmentResult.getInt("supplier_id"));
				shipment_policy.setMaximum(shipmentResult.getInt("maximum"));
				shipment_policy.setMinimum(shipmentResult.getInt("minimum"));
				shipment_policy.setShipment_price(shipmentResult.getInt("shipment_price"));
				shipment_policies.add(shipment_policy);
			}
			
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return shipment_policies;
	}
	
	public int getShipmentPrice(int supplier_id, ArrayList<Product> productBySupplier, int total){
		int Shipment_price = 0;
		int free_shipment_price = 0;
		int numberOfProduct = 0;
		
		for(Product p: productBySupplier) {
			numberOfProduct += p.getQuantity();
		}
		
		String query = "SELECT shipment_price from shipment_policy where supplier_id = ? and maximum >= ? and minimum <= ?";
		String free_shipment_query ="SELECT free_shipment_price from supplier where supplier_id = ?"; 
		PreparedStatement free_pstatement;
		try {
			
			free_pstatement = con.prepareStatement(free_shipment_query);
			free_pstatement.setInt(1, supplier_id);
			priceResult = free_pstatement.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while(priceResult.next()) {
				free_shipment_price = priceResult.getInt("free_shipment_price");
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(free_shipment_price < total)
			return Shipment_price;
		PreparedStatement pstatement;
		try {
			
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, supplier_id);
			pstatement.setInt(2, numberOfProduct);
			pstatement.setInt(3, numberOfProduct);
			priceResult = pstatement.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while(priceResult.next()) {
				Shipment_price = priceResult.getInt("shipment_price");
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return Shipment_price;
		
	}
	
	public Supplier findSupplierById(int supplier_id) {
		Supplier supplier = null;
		String query = "SELECT  supplier_id, supplier_name, evaluation, free_shipment_price FROM supplier where supplier_id = ?";
		PreparedStatement pstatement;
		try {

			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, supplier_id);
			supplierResult = pstatement.executeQuery();
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			while(supplierResult.next()) {
				supplier = new Supplier();
				
				supplier.setFree_shipment_price(supplierResult.getInt("free_shipment_price"));
				supplier.setSupplier_id(supplierResult.getInt("supplier_id"));
				supplier.setSupplier_name(supplierResult.getString("supplier_name"));
				supplier.setShipment_policy(setShipment_Info(supplier));
				supplier.setEvaluation(supplierResult.getString("evaluation").length());
				
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("This supplier does not exists");
		}
		
		
		return supplier;
	}
	

}
