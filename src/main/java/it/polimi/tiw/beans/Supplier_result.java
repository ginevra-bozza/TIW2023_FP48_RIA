package it.polimi.tiw.beans;

import java.util.HashMap;
import java.util.Map;

public class Supplier_result {

	Map<Integer,Supplier> supplier_info = new HashMap<>();

	public Map<Integer, Supplier> getSupplier_info() {
		return supplier_info;
	}

	public void setSupplier_info(Map<Integer, Supplier> supplier_info) {
		this.supplier_info = supplier_info;
	}
	
	
	
}
