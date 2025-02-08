package com.chat.chat.application.Service;

import com.chat.chat.application.Model.User;
import com.chat.chat.application.Repository.UserRepository;
import com.chat.chat.application.config.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceIMPL extends UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User getUserProfile(String jwt) {
        // Extract email from JWT using JwtProvider
        String email = JwtProvider.getEmailFromJwtToken(jwt);

        // Fetch user profile by email
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
