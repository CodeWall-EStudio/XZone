package com.example.SWall.model;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 下午7:42
 */
public class AccountInfo {


    // 不必搞那么多setter getter...
    public String userId;
    public String userName;
    public String userPassword;

    public AccountInfo(String userId,String userName,String userPassword){
        this.userId = userId;
        this.userName = userName;
        this.userPassword = userPassword;

    }
}
