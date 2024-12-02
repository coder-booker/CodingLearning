# Experience
- RESTful的抓包和破解尝试（包括更改url（path和query string），更改body，更改method等）
- 查看html的hidden项
- 同级和向上的入侵，尝试权限修改
- 除了手动猜测之外，也要利用好网站自己就暴露出来的功能
- 攻击者一般是在没有任何session的情况下尝试攻击的，因此有session的情况下很多防御手段都会无效化
- 浏览器会自动进行URL normalization，也就是把`../`,`%2e%2e/`这类path traversal attack的字符直接删除
    - 但只有一层，用`%%32%65`仍会解码保留成`%2e`
- 学网安可以反向进行一些相当有趣的防护
- openssl就是一个开源的SSL/TLS层，有各种加密功能

### CIA + AAN
- CIA
    - Confidentiality
        - 资源保护，未授权不能获得某些资源
    - Integrity
        - 完整性，也就是数据应该一致，不能随意更改
    - Availability
        - 字面意思，服务器烧了，着火了都算不available
- AAN
    - Authentication
        - identify who you are
    - Authorisation
        - give function based on who you are
    - Non-repudiation
        - 不可否认性：用唯一的数字签名来标识发送方
        - 为了让数据也拥有法律效力

# Broken Access Control
- types:
    - Insecure Direct Object Reference (IDOR)
        - types：
            - Path traversal: url path的直接引用获取
                - 尝试直接访问后端端口
                - 尝试遍历更改query string来获取资料（甚至直接写'../../../sys.ini'）
                - 一般可以找热门wordlists来BF寻找
            - JWT, tickets这类的单一验证
    - Cross-Site Request Forgery (CSRF)
        - elevation of privilege
        - 常见于只使用session和其cookies来验证的网站
        - 成功提升后要记得更新session
- experience
    - 从抓包中找到些资讯，然后尝试用在url上作为param或者query string
# Hash & Cryptographic Failures
- most commonly used algorithm
    - MD5
    - SHA256
- hash是可能被破解的，用些hash的识别网站就有可能
    - URL modifying
- cookie
- Unsalted Hash vs Salted Hash
    - Salted: 引入了随机数的哈希算法
    - Unsalted: 相同输入会输出相同结果的哈希算法
        - 因此可以被BFS出来
- Signature
    - RAW Signature
    - CMS Signature
    - SOAP Signature
    - Email Signature
    - PDF/Word Signature
        - 因此政府机构会用有证书的PDF传输文件
- keystore/truststore
    - keystore用来储存私钥和公钥验证证书（公钥验证证书就是客户端在第二次握手会验证的那块东西）
        - 各种keystore：
            - File based keystore：用一个文件储存
            - Database keystore：用数据库储存
            - Hardware keystore：直接储存在硬件，无法被盗取。但使用场景极少，只有需要高度安全的场景才会使用
    - truststore用来储存各种CA证书，包括根证书和中间证书
    - 有趣的是，大公司的内网访问外网，其实是公司自己作为中转服务器来签发CA给客户端以及和目标服务端建立连接。而由于公司内网肯定会信任这个中转CA，HTTPS的一个例外情况被利用在企业内网安全上
- "Let's Encrypt"是免费的CA网站

# injection
- 有很多种
    - cross-site scripting (XSS)
        - 在受害者网站内运行script/code
        - 有很多种:
            - Self-XSS
                - 没有触发服务器请求的XSS，比如单纯alert一下cookie
            - Reflected XSS (non-persistent XSS attack)
                - 在http请求中嵌入代码，如在query string写&lt;script>
                - non-persistent是因为只有那一种情况会运行恶意代码
                - 简易流程
                    - 攻击者给用户发送一个恶意连接，内部包含一些script，会给攻击者主动发送信息
                    - 用户在其session中点击并向服务器发出了恶意请求
                    - 请求响应只会会返回给用户，然后恶意script被执行，给攻击者发送敏感信息
            - Stored XSS（persistent XSS attack）
                - 把有害代码通过某种方式保存到app里，每当app的这个功能被触发就会触发有害代码
                - e.g. 在comment中插入script，只要有用户加载了这条评论就会运行script
            - DOM-based XSS
                - 和reflected XSS很像，但不使用http来攻击，而是用响应式js的动态DOM来运行恶意代码
                - 因此在服务端没法识别到这种攻击，因为往服务端发的http请求中没有痕迹
    - XML external entity injection (XXE) 
        - 在接收XML的应用服务中，利用XXE语言的特性来获得敏感信息
    - OS injection/Remote Code Execution (RCE)
        - 直接在服务端的os运行代码
        - 例如参数传到linux中并运行某命令，用;或者&&来在那一条行中运行多条命令
- 一些防范的手段：
    - cookie设置HttpOnly（防止DOM-based XSS）
    - CSRF token：动态生成会话唯一的token来标识合法http请求
        - 让攻击者在没有对应session的情况下无法伪造请求

### SQL injections
- 基本上关键在于熟悉SQL语句的语法
- experiences
    - 留心开头和结尾的引号
        - e.g. `"SELECT * FROM user_data WHERE first_name = 'John' AND last_name = '" + lastName + "'";`如果要注入，得处理尾部的`'`（例如注释掉或者用另一个'接上）
- list
    - `--`在SQL中代表注释符
        - injection exmaple：
            https://example.com/search?query=admin'--+  
            `SELECT * FROM users WHERE username = 'admin' --' AND password = 'password';`
    - `OR`
        - injection exmaple：
            https://darklabacademy.com/score?student_id=10002'+OR+1=1--  
            `SELECT * FROM result WHERE student_id = '10002'OR 1=1--' AND released = 1`
- Common attackable query command
    - SELEC, UPDATE, DELETE
- types:
    - In-Band
        - when use the same channel to send sql query and get result
        - 2 types:
            - Error based 
                - utilize error meesage thrown
            - Union based
                - 因为我们输入的参数被sql使用的位置一般在末尾的where之类的，因此用union关键字才能同时select些别的
                - ORDER BY可以用列索引来判断被注入的sql查询的列数
                - union的两个查询结果的列数要一样
                    - 用ORDER BY和常量扩充列数来保证列数相同
            - （LIKE可能也能用？）
    - Out-of Band 
        - 用sql语句叫数据库把信息泄露给外部域名
        - 仅适用于能够发出DNS、HTTP或者SMB请求的数据库
        - SQL原来可以进行DNS请求
        - 用load_file()，把任何敏感信息作为子域名发给SLD的DNS服务器，DNS服务器就可以看到这个敏感信息
        - xp_dirtree
    - Inferential (Blind)
        - 一般用于无法直接获得查询结果的情况下，也就是无法直接知道有没有查询到
        - 本质上就是猜数据库里的数据是什么，如果猜对了就会在各种方面返回和没猜对不一样的值，以此判断得出正确的值
        - Boolean based
            - 直接暴力遍历值等于什么，如果猜对了一般会时网络请求中包长度变长，我们就可以知道这个值是正确的
        - Time based
            - 利用了AND和OR的短路机制
                - 例如把延迟函数放在AND最后一个条件，这样如果前面的条件为false则不会延迟，反之可以说延迟了的条件都是正确的条件
    - Vulnerability test
        - common ways
            - single quotation marks `'`
            - SQL specific syntax such as ASCII characters
            - Boolean conditions (e.g., `' OR 1=1--`)
            - Payloads to trigger time delays (e.g., `'; waitfor delay ('0:0:30')--`)
            - Payloads to trigger out-of-band network interaction (e.g., `exec master..xp_cmdshell 'whoami'`)
        - tools
            - SQLMAP (open-source penetration testing tool)
        - ways to protect
            - input validation
            - parameterised queries (also known as prepared statements)（其实就是把query封装一下，让query可以用指定参数名而不是字符串拼接的方式填入session数据）
            - character-escaping functions
            - web application firewall to monitor requests and block malicious traffic.

# Identification and Authentication Failures
- Credential Stuffing
    - 在拥有一个账号和密码的情况下，自动化尝试用这个账密登入不同的网站
- Brute Force Attack
    - 通过工具生成账密来尝试登入
    - 常用工具：
        - crunch，用以客制化生成规则
        - hydra：用以进行HTTP/SSL/FTP等的authentication
        - 直接找wordlist
- Session Hijacking
    - 用session ID之类的东西登入账号
- Session Fixation
    - 把提前生成/fix好的session id发给别人，让别人以这个session id登入以此把用户绑定此id，这样攻击者就可以用同一个session id伪装用户发送请求
- Multi-factor Authentication (MFA)
    - 比较常用的MFA：One-Time Password (**OTP**)
        - 只能使用一次，下次就重新生成
            - 不然会有replay attack
        - 需要有BF protection和integrity check
            - BF protection不能只是限制次数，否则绕过用以检测限制的部分即可，例如修改headers
            - integrity check是指验证OTP指向的用户，而不会登录到随便某个刚好也在登录的用户
        - 如果OTP重发而之前的OTP仍然有效，那么会有可以bypass rate limit的方法。但有一万种方法可以防止这简单的漏洞
- MFA fatigue or prompt bombing
    - 不停发MFA的验证请求让用户疲劳厌烦，最后同意其中一个MFA请求
    - 需要事先已经知道用户的账密才能有机会触发MFA验证请求

# Vulnerable and Outdated Components
- CVE (Common Vulnerabilities and Exposures)
    - 就是公开一些架构内被发现的漏洞
    - 有意思的是，直到现在仍然有不少CVE指名存在漏洞的框架或者版本被使用
    - ways to evaluate severity of a CVE: CVSS (Common Vulnerability Scoring System)
        - [0.0-10.0]
- Vulnerable and Outdated Components Attack
    - 生产环境使用已经没维护的版本
        - 可能早就被标注会有攻击风险
    - 包括框架、库什么的
    - eg CVE-2021-41773
        - apache 2.4.49/2.4.50这两个版本虽然过滤了一些简单的特殊字符，如遇到`\`,`.`啥的会直接删除，但没有过滤`%2e`这类编码，导致可以用`%2e`访问路径
        - 此外，没有进行访问权限控制也是问题之一

# Insecure Design
- 一些准则：
    - Threat modelling
    - Secure design pattern
    - Secure component libraries
    - Reference architecture
- Unprotected Storage of Credentials
    - Common examples:
        - Storing password in plaintext format in application's properties
        - Hardcoding logon credentials on unencrypted configuration files
        - Saving decryption keys on network drives
    - 其实就是以防有人真的得到了storage的权限
- Trust Boundary Violation
    - 用于把系统的不同部分分隔开
    - 对输入和输出进行过滤和验证可以让数据穿过这些边界

# Security Logging and Monitoring Failures
- OWASP Top 10：Failure - A09
    - Improper Output Neutralization for Logs
    - Omission of Security-relevant Information
    - Insertion of Sensitive Information into Log File (cont’d.)
- Improper Isolation or Compartmentalization
    - 就是用户权限没有做好，导致用户可以访问的资源和功能没有隔离开
    - 所以会导致Broken Access Control
- Unrestricted upload of file with dangerous type
    - 绕过验证文件种类的逻辑，也算在这一部分
    - 常见的文件类型验证方法
        - 后缀检查
        - request的Content-Type检查
        - file header检查（这和http的header没有关系）
- Reverse Shell
    - Netcat
- sql各种现代函数

# Server-Side Request Forgery (SSRF)
- 伪造请求，使用服务器内的功能，比如组织里的内网功能
- 有点类似OS injection/RCE
- Common SSRF
    - Server SSRF: 注入本地ip 127.0.0.1/admin之类的，
    - Back-end SSRF：注入其他内网ip 192.168.10.8之类的，用有缺陷的服务器访问敏感服务器，因为不少情况下内网的各项服务之间的通信不会有权限控制
    - 


# useful vocab
- privilege
- RBAC（Role-Based Access Control，基于角色的访问控制）
- audit 审核
- exploit 恶意利用
- Breach 破坏/违规/突破
- Phishing 网络钓鱼
- tier 层级
- segregation 分隔


# to-do
- XSS, 第九题开始