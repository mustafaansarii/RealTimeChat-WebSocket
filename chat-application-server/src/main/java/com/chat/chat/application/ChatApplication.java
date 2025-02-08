package com.chat.chat.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.chat.chat.application")  // Ensure the base package is scanned
public class ChatApplication {
	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
	}
}
