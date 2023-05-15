package it.polimi.tiw.utils;

/**
 * This exception is thrown if, after sending an order, the parameters sent from the client don't match the data in the database
 * @author Ginny
 *
 */
public class ParametersNotMatchingException extends Exception
{
	private static final long serialVersionUID = 1L;

	// Parameterless Constructor
      public ParametersNotMatchingException() {}

      // Constructor that accepts a message
      public ParametersNotMatchingException(String message)
      {
         super(message);
      }
 }
