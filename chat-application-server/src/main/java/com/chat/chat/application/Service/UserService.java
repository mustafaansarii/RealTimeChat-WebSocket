package com.chat.chat.application.Service;

import com.chat.chat.application.Model.User;

import java.util.List;

public abstract class UserService {
    public abstract User getUserProfile(String jwt);

    public abstract List<User> getAllUsers();
}
