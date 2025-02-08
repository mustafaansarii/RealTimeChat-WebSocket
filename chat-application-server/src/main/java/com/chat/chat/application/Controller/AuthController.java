package com.chat.chat.application.Controller;

import com.chat.chat.application.Model.User;
import com.chat.chat.application.Repository.UserRepository;
import com.chat.chat.application.Request.LoginRequest;
import com.chat.chat.application.Response.AuthResponse;
import com.chat.chat.application.Service.CustomUserServiceIMPL;
import com.chat.chat.application.config.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserServiceIMPL customUserDetails;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUser(@RequestBody User user) throws Exception {
        String email = user.getEmail();
        String password = user.getPassword();
        String fullName = user.getFullName();
        String role = user.getRole();

        User isExistEmail = userRepository.findByEmail(email);
        if (isExistEmail != null) {
            return ResponseEntity.ok(new AuthResponse(null, "Email is already used with another account", false));
        } else {
            User user1 = new User();
            user1.setEmail(email);
            user1.setFullName(fullName);
            user1.setRole(role);
            user1.setPassword(passwordEncoder.encode(password));
            User savedUser = userRepository.save(user1);
            Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = JwtProvider.generateToken(authentication);

            AuthResponse authResponse = new AuthResponse();
            authResponse.setJwt(token);
            authResponse.setMessage("Signup success");
            authResponse.setStatus(true);
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = JwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Signin success");
        authResponse.setStatus(true);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);
        if (userDetails == null) {
            throw new RuntimeException("User not found");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
