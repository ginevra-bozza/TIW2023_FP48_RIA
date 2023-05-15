package it.polimi.tiw.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import it.polimi.tiw.beans.User;

public class UserDAO {
	private Connection con;

	public UserDAO(Connection connection) {
		this.con = connection;
	}
	
	/**
	 * This method gets the data of the user from the user table in databse
	 * @param email is the email of the user, sent by the login form
	 * @param pwd is the password of the user, sent by the login form
	 * @return a User object 
	 * @throws SQLException
	 */
	public User checkCredentials(String email, String pwd) throws SQLException {
		String query = "SELECT  email, password, name, surname, address FROM user  WHERE email = ? AND password =?";
		try (PreparedStatement pstatement = con.prepareStatement(query);) {
			pstatement.setString(1, email);
			pstatement.setString(2, pwd);
			try (ResultSet result = pstatement.executeQuery();) {
				if (!result.isBeforeFirst()) // no results, credential check failed
					return null;
				else {
					result.next();
					User user = new User();
					user.setEmail(result.getString("email"));
					user.setPassword(result.getString("password"));
					user.setName(result.getString("name"));
					user.setSurname(result.getString("surname"));
					user.setAddress(result.getString("address"));
					
					return user;
				}
			}
		}
	}
	
}
