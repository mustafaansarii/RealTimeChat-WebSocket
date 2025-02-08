package com.chat.chat.application.Controller;

import com.chat.chat.application.Model.User;
import com.chat.chat.application.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.getUserProfile(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String jwt) throws Exception {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }


}
