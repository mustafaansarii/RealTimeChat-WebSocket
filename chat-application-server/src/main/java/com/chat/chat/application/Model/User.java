package com.chat.chat.application.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Using IDENTITY for PostgreSQL
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String password;

    // Default constructor
    public User() {
    }

    // Parameterized constructor
    public User(Long id, String email, String role, String fullName, String password) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // toString() method for debugging/logging
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", fullName='" + fullName + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
