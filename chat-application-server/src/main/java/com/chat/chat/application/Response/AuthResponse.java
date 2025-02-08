package com.chat.chat.application.Response;

public class AuthResponse {
    private String jwt;
    private String message;
    private boolean status;

    // Default Constructor
    public AuthResponse() {
    }

    // Parameterized Constructor
    public AuthResponse(String jwt, String message, boolean status) {
        this.jwt = jwt;
        this.message = message;
        this.status = status;
    }

    // Getter and Setter for jwt
    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    // Getter and Setter for message
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Getter and Setter for status
    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
