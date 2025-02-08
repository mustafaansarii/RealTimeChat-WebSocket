package com.chat.chat.application.Service;

import com.chat.chat.application.Model.User;
import com.chat.chat.application.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserServiceIMPL implements UserDetailsService {
    @Autowired
    private UserRepository  UserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user= UserRepository.findByEmail(username);
        if(user==null){
            throw new UsernameNotFoundException("User not found");
        }
        else{
            List<GrantedAuthority> authorities= new ArrayList<>();
            return new org.springframework.security.core.userdetails.User(user.getEmail(),user.getPassword(),authorities);
        }
    }
}
