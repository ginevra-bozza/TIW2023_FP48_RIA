package it.polimi.tiw.utils;

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
