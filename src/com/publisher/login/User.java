package com.publisher.login;

public class User {

	private int userId;
	private String userName;
	private String password;
	private String authority;

	
	
	public int getUserId() {
		return userId;
	}
	
	public User(String userName, String password){
		super();
		this.userName = userName;
		this.password = password;
	}
	
	public User(int userId, String userName, String password, String authority) {
		super();
		this.userId = userId;
		this.userName = userName;
		this.password = password;
		this.authority = authority;
	}
	
	public User(String userName, String password,String authority){
		super();
		this.userName=userName;
		this.password=password;
		this.authority=authority;
	}
	
	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getAuthority() {
		return authority;
	}
	public void setAuthority(String authority) {
		this.authority = authority;
	}
	
	
	
}
