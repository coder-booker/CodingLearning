# 同源策略 Same-Origin Policy (SOP)
- 协议|域名|端口 不同的请求地址不能交叉请求
- 为了防止源读取另一个源中的用户得到的响应信息所建立的策略

# 出站入站ip
- 出站就是本地访问外部时本地发出的source ip
- 入站就是外部访问本地地目标ip
# CORS
- 浏览器会检测某response有没有`Access-Allow-Control-Origin`，有的话允许什么路径
- 所以其实request不会被拦截，是response会。

# Cookie & localStorage
### cookie
- pros:
    - 每次请求都会自动把当前域名下的cookie发送出去
    - 可以用`Expires` 或 `Max-Age`设置生命周期
        - `Set-Cookie: userid=123; Expires=Wed, 21 Oct 2025 07:28:00 GMT; Path=/`
        - 设置了过期时间的cookie在浏览器关闭时不会删除，否则自动清除
    - 所有浏览器都支持 Cookie，包括非常旧的浏览器，兼容性好。
    - cookie可以通过设置一些额外的参数来防止XSS和CSRF
        - `HttpOnly`: 禁止 JavaScript 访问
        - `Secure`: 仅允许 Cookie 通过 HTTPS 传输。
        - `SameSite`: 仅允许同domain下的script访问，防止跨站请求伪造（CSRF）攻击。
            - `Strict`(完全不允许其他domain), `Lax`(允许a标签跳转和GET请求)(默认值), `None`(无限制)
    - 可以设置 `Domain` 和 `Path` 属性，限制 Cookie 的作用范围。
        - Domain只能缩小或相等，不能扩大。所以Domain的能跨域的就只有当前连接的域名的子域名
- cons:
    - 存储容量小，每个 Cookie 最大 4KB
    - 每个域名下的 Cookie 总数有限（通常为 20-50 个）。
    - 每次 HTTP 请求都会携带 Cookie，如果 Cookie 过多或过大，会增加请求头的大小，影响性能。
    - 如果未设置 HttpOnly 和 Secure，容易被 XSS（跨站脚本攻击）或中间人攻击窃取。
    - 需要手动解析和设置 Cookie，操作相对繁琐。
- 使用场景
    - 高安全性要求
    - 服务器与客户端需要共享数据
### localStorage
- pros: 
    - 存储容量大，通常可以存储 5MB 或更多的数据（取决于浏览器），适合存储较大的数据。
    - 数据不会随页面关闭或浏览器重启而消失，除非手动清除或通过代码删除。
    - 数据不会自动发送到服务器，适合存储纯客户端的数据，如用户界面状态、缓存数据等。
    - 提供了原生的 API（如 setItem、getItem、removeItem），易于使用。
    - 数据存储在本地，不会随 HTTP 请求发送，减少网络开销。
- cons: 
    - 不支持跨域，数据仅限于当前域名，无法在不同域名之间共享。
    - 数据没有原生的访问限制，容易受到 XSS 攻击。
    - 需要手动管理数据的生命周期。
    - 不支持 IE7 及更早版本的浏览器（但现代开发中通常不需要考虑这些浏览器）。
- 使用场景
    - 数据量较大
    - 无需服务器交互的数据（如用户界面设置、缓存数据）
    - 邪道：把储存压力给到用户

# CSR, SSR, SSG, ISR
- CSR: Client Side Rendering 
    - 仅接受html文档，然后自己渲染
- SSR: Server Side Rendering 
    - 服务器帮你把html文档渲染好，返回一个类似数据流的渲染完成的html
- SSG: Static Site Generation
    - 用户磁盘保存
- ISR: Incremental Site Rendering
    - SSG，但是根据使用情况（例如热度）异步更新到CDN服务器
- others: 
    - CDN: Content Delivery Network或Content Distribution Network, 就是当地服务器在主服务器前的缓存用服务器
    - html文档和渲染是分开的。

# stateless
- 服务器无状态，也就是所有请求之间都没有关系，没有session资料会保存在服务器
    - 如果是前后端分离的话，restful本身就是stateless的，状态都在前端
# serverless
- 云服务部署就是serverless

# session & cookie
### session
- 一个用户一个session，用来作为管理资源和状态的最小单位
- 一般对于session的管理都在服务端，以session_id的形式储存在cookie并每次都发给服务端
### cookie
- 一坨在客户端的键值对，用来进行状态管理的
- HTTPOnly属性：只有http请求能够获得这个cookie，js无法获得（XSS无法获得）
- SameSite属性：用以限制跨站请求
    - Strict：所有跨站请求都不会发送该cookie
    - Lax：部分跨站请求才会发送该cookie
    - None：所有跨站请求都会发送该cookie

# JWT (JSON Web Token)
- 把json格式的用户信息转换为token的某个方法，并不是用来传输json的安全方法
- 一种跨域认证方法，本质上就是把所有用户信息都映射(加密)成一份乱码字符串(加密的东西一般都类似乱码)，保存在用户本地
- 访问服务器时把JWT发给服务器就可以让服务器决定对应行为，例如没过期的话就不用重新登陆、允许跨域等
- 创建用参数，创建好之后命名为payload：
    - sub=uuid: 唯一标识符，用来表明主题的
    - exp=int(timestamp): 过期时间, timestamp
    - nbf=int(timestamp): not before. 生效时间, timestamp
    - iat=int(timestamp): issue at, 签发时间, timestamp
    - iss=ISSUER: issuer, 签发者, string/URI
    - aud=audience: audience, 预期接收者, string/URI
- 加密用参数，创建好之后命名为token并发送给客户端: 
    - payload=Dict: payload一般就是创建好的jwt对象，这里要转成dict或者json
    - key=SECRET_KEY: 密钥
    - algorithm='HS256': 加密算法
- 解密用参数，创建好之后变回payload: 
    - jwt=token: jwt token
    - key=SECRET_KEY: 密钥
    - algorithm='HS256': 加密算法
    - issuer=ISSUER
    - audience=audience,  # 令牌的预期接收者

# 分层模型
### OSI模型
- 应用层 application layer
    - http
- 表示层 presentation layer
    - 数据加密解密、格式转换等
- 会话层 session layer
    - 控制会话
- 传输层 transport layer
    - TCP(面向连接)/UDP(无连接)
- 网络层 network layer
    - IP/DNS(无连接服务)/NAT
- 数据链路层 data link layer
    - MAC
- 物理层 physical layer
    - 物理介质
### TCP/IP模型
- 应用层 application layer
    - 应用+表示+会话
- 传输层 transport layer
    - TCP(面向连接)/UDP(无连接)
- 互联网层 internet layer
    - IP/DNS(无连接服务)/NAT
- 网络接口层 network interface layer
    - 数据链路+物理


# Duplex, Simplex Communication
- Full-Duplex：双方同时发送和接受
- Half-Duplex：单向通信
- Simplex：双向不同时


# RESTful
- body, query string, params
- body: 
    - 一般是比较复杂或者庞大的数据，例如多条字段，大文件等
- query string: 
    - url后用`?`标识
    - `+`代表空格
    - 一般给GET或者DELETE用
    - 一般用于查询某个资源
- params:
    - url后以params为子路径
- 幂等
    - 同一条http请求，每次执行的结果对资源来说都和第一次一样
- POST VS PUT
    - POST：
        - 创建或提交(表单/数据)
        - 一般用于生成数据，因此不一定指向一个目标，，因此不幂等
    - PUT：
        - 创建或更新资源
        - 是幂等的，因为每次使用都必须指定一个目标

# 本机ip

# 面向连接服务，无连接服务
- 面向连接服务就是TCP这一类得连接才能传输的协议
- 无连接服务则是直接发送数据（“尽最大努力交付”(Best-Effort-Delivery)）

# Client/Server (C/S) & Browser/Server (B/S)
- client其实是一个很专的概念，指application
- 早期的互联网的通信模型就是这样的，因此才会用RPC
- 但后来出现了Browser这种特殊但很泛用的client，因此才慢慢转向HTTP
- 现在这两者已经没那么分得开了，因为现在的产品都是***多端***的

# 序列化协议
- JSON
- Protobuf (Protocol Buffers)
- XML

# 应用层
- DNS的查询是一个DNS请求
- 域名结构
    - 根域为隐含的一个点`.`
    - TLD
        - 如.com, .net, .xyz
    - SLD
        - 就是常规网站的主要域名，比如我的就是domain-booker
    - Subdomain
        - SLD 下的子域，一般拥有这个域名就可以自己配置
- 共享缓存
    - 多个用户或者客户端可以一起使用的缓存
    - 最常见的例子就是代理服务器或者Content Delivery Network (CDN)，CDN的常见例子则是网络供应商缓存网站并把缓存发给客户端
## HTTP 协议
- 单向，服务端没法主动发出请求，客户端也没法做出响应
- 用换行符、回车符作为header每个项的边界
    - 一般是两个都用`\r\n`为项的结尾
    - `\r\n\r\n`标识所有header的结尾，下面就是body了
- 用Content-Legnth作为body的边界
- 常用header
    - HTTP request/response e.g. 
        ``` http 
        POST /getflag.php HTTP/1.1
        Host: 10.0.0.102
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8
        Accept-Language: en-US,en;q=0.5
        Accept-Encoding: gzip, deflate, br  <!-- body的压缩算法 -->
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 75
        Origin: http://10.0.0.102
        Connection: keep-alive
        Date: Mon, 02 Jan 2023 14:30:00 GMT
        Referer: http://10.0.0.102/message.php   <!-- 给服务器跨域参考的 -->
        DNT: 1  <!-- Do Not Track flag，其实就是遮羞布说不要收集我的信息 -->
        X-Forwarded-For: 203.0.113.195, 198.51.100.17   <!-- 用于标识客户端的原始 IP 地址,  client1, proxy1, proxy2  -->
        Cookie: PHPSESSID=a561bae723e2bf896352a27c9ee81917; Admin=admin
        <!-- 这里用两个换行符区分headers和body，然后Centent-Length控制body边界 -->
        csrf_token=d63e274d90a8cd33b1fac086669be5706f868a8b8bfc1b498e6bf449b774f2b9
        ```
    - `HTTP/1.1 200 OK`，包含了协议名+版本、响应码+相应文本
    - `Content-Length`: [length]
    - `Content-Type`: 
        - json body: application/json
        - query string: application/x-www-form-urlencoded
    - 可以在分号加一个空格后append内容的编码格式
    - q因子/q值 (Quality value)
        - 在多个选择中标识优先级，常用于Accept相关字段
        - 取值[0.0, 1.0]，越大越先，不指名默认为1.0
        - 相同优先级下，对选择越具体的指名，优先度越高，如`text/*;q=0.9`比`text/html;q=0.9`低
        - 用法：有选择的header一般用`, `分割不同选择。在选择后加`;q=x.x`就可以设置优先级
            - eg `Accept-Encoding: gzip;q=0.9, br, deflate;q=0.8`
    - `referer`
        - 有意思的是其实应该拼写为referrer，但html的规范也是referer
        - 虽然`origin`字段也能做跨域判断的参考，但referer是更细吗？
        请求头中referer与origin功能相似，但有如下几点不同：
        - 和origin的区别：
            1. 只有跨域请求，或者同域时发送post请求，才会携带origin请求头，而referer不论何种情况下，只要浏览器能获取到请求源都会携带，除了上面提到的几种情况。
            2. 如果浏览器不能获取请求源，那么origin满足上面情况也会携带，不过其值为null。referer则不同，浏览器如果不能获取请求源，那么请求头中不会携带referer。
            3. origin的值只包括协议、域名和端口，而referer还包括路径和参数。
    - 缓存：有两种，但第二种一般配合第一种使用；
        - 强制缓存
            - 有两种
                - `Cache-Control`（由Response设置）
                    - 优先级比expire高，且选择更精细
                    - 包含了过期时间
                    - 可用的值：
                        - public/private：允许/不允许共享缓存
                        - no-cache：缓存，但每次用缓存都得revalidate
                        - no-store：不缓存
                        - max-age=[xxx，秒]：指定缓存时间，只有有缓存的设定下才生效
                        - s-maxage=[xxx，秒]：但仅适用于共享缓存的max-age（共享缓存是啥往上看）
                        - must-revalidate：严格模式revalidate，在缓存过期时绝不会“先用着”
                        - proxy-revalidate：但仅适用于共享缓存的must-revalidate
                        - no-transform：禁止缓存代理对资源进行任何转换或修改。
                        - immutable：表示资源是不可变的，客户端可以认为资源永远不会改变。
                        - stale-while-revalidate/stale-if-error=[xxx，秒]：在过期/过期且响应错误的xxx秒内先用着过期的内容
                - `Expires`
                    - 一坨指名过期时间的日期，优先级最低
        - 协商缓存
            - 协商缓存什么时候刷新缓存是由应用+浏览器+强制缓存的缓存策略决定的
                - 例如浏览器页面刷新或者应用要validate数据，就会重新请求资源而非读取缓存
            - 有两种
                - If-Modified-Since（Request设置）+ Last-Modified（Response设置）
                    - 第一次后的所有请求都会把最近一次响应体的Last-Modified的值以If-Modified-Since字段发出
                    - 服务器根据If-Modified-Since判断是否过期
                        - 没过期就304，过期了就发送新资源
                    - Last-Modifed的时间精度无法小于秒级
                - If-None-Match（Request设置）+ ETag（Response设置）
                    - 第一次后的所有请求都会把最近一次响应体的ETag的值以If-None-Match字段发出
                        - 服务器根据If-None-Match判断是否过期
                            - 没过期就304，过期了就发送新资源
                    - ETag的时间精度在秒级以下
                    - ETag的生成与文件内容、大小、版本号、修改时间有关，因此可以识别没有更新修改时间的修改
        - 缓存行为优先级：s-maxage > max-age > ETag > Last-Modified > Expires
        - 有时候缓存可能即使过期了也被使用
            - 例如断网了、客户端的优化策略时在服务器验证响应前先用着过期的缓存、stale-while-revalidate被设置了等
- status
    - 3xx：资源时效性相关
        - 301 Moved Permanently 永久重定向
        - 302 Found 临时重定向
        - 303 See Other 常用于POST/PUT的重定向？？？
        - 304 Not Modified 缓存未过期
        - 307 Temporary Redirect ≈302，但请求方法也要改变
        - 308 Permanent Redirect ≈301，但请求方法也要改变
## /1.0, /1.1, /2.0, /3.0
- 现代常用的是1.1和2.0
- /1.0
    - 特点
        - 短连接
        - stateless
- /1.1
    <!-- - 高度灵活，可以自定义和随意扩充
    - stateless-->
    - 特点
        - 支持HTTPS
        - 纯文本报文
    - 优
        - 长连接
        - pipeline
            - 异步发送请求
            - 注意1.1时pipeline不是默认开启的
        - 能压缩body（其实就是通过Content-Encode来发送gzip之类的数据）
        - 支持更多http方法和header
        - 支持分块传输
    - 劣
        - header不会压缩
        - 队头阻塞(Head-of-Line Blocking)：哪怕有pipeline，服务端仍然是顺序依次逐个发送响应
        - 请求优先级是什么？
        - 只能客户端单向请求，服务端只能响应
- /2.0
    - 兼容HTTP/1.1，因为协议url前缀并未改变
    - Frame 二进制分帧
        - 1.1用纯文本还多了一层文本和二进制互相转换的步骤，2.0直接用二进制表示各种状态和数据，使用更少空间
        - 帧结构
            - Frame Header
                - frame一些metadata
                - 包括帧长度、帧类型(数据or控制帧中的哪一项)、标识位(用来携带简单的控制信息，也可以设置stream优先级)、流标识符(Stream ID)
            - Frame Payload
                - 就是实际的frame数据，或者说是HTTP请求或响应的header和body，被HPACK压缩过
        - 帧的种类根据功能大致分为两种：
            - 数据帧
                - Header Frame、Data Frame，分别储存header和body
                - Priority Frame，表示Stream优先级
            - 控制帧
                - 太多了我的老天
    - 支持服务端主动发送信息给客户端
    - Stream
        - 应用层的multiplexing，是并发concurrent，可以同一时间内发送和接受多个stream
        - 并发可以乱序，因为最后会根据stream_id配对每一个response和request
        - stream内通信
            - 每个stream里有且只会有一次request和response，传输完就会结束stream
            - 同一stream内的通信遵守请求-响应模型，虽然只会有一次请求和响应
            - stream中传输的帧必须有序，但可以在stream的并发中分批次发出和接收
        - stream支持服务端主动通信
            - 这样可以在客户端访问某路径时，把其他必须的数据也主动push给客户端
                - 服务端会先把对应的HTTP header帧发给客户端告知即将主动发出数据，然后并发剩余的body
                - 这个通知用的帧称为PUSH_PROMISE帧，其中的流标识符被称为Promised Stream ID，供客户端识别后续分批并发的帧是哪个
        - stream id
            - 就是Frame Header的流标识符
            - 客户端主动的stream的stream id只会是奇数，服务端主动的只会是偶数
            - stream id不能复用，只会递增
            - stream id耗尽后，会发出一个GOAWAY控制帧来关闭TCP连接
        - stream有优先级，通过Frame Header的标识位设置
    - message
        - 一个抽象容器，用来把同一请求或者响应分帧的东西都抽象地装起来而已
    - 除了原本1.1的body，还能压缩header
        - HPACK算法：
            - 客户端和服务端都维护一张静态和一张动态header表，其中每个header都会被赋予一个索引，这样只传送索引就行
            - 静态表
                - HTTP/2.0框架内，静态表有1-61一共61个项
                - 注意静态表内存有常见header+常见值以及常见header两种内容，因此有时候索引可知直接代表header和其值，有时候则只代表header，值要用Huffman编码再送出去
                - 已有的静态表项的二进制表达：
                    - 第一位标识是否已存在于静态表
                    - 剩下7位表示index（7位是为了刚好占用俩字节）
                - 无值的静态表项的二进制表达：
                    - 01开头表示无值的静态表项
                    - 后6位标识具体index
                    - 1位标识是否经过huffman编码
                    - 7位标识value的长度
                    - 剩下的位是动态的，代表value，但尾部不满一字节的会用1补位
            - 动态表
                - index从62开始
                - 动态添加其他header键值对，不会只保存header键。因此如果value一直有细微变化，动态表的作用就被限制了
                - 动态表的内容也会被huffman编码
                - 采用FIFO来移除过多的键值对
                - web服务器一般都可以配置类似 http2_max_request 的东西来限制http2的请求数量，以此间接限制动态表占用的内存
    - HTTP/2.0也有队头堵塞，但因为体现在TCP的连续seq_num缓存上，有点脱离应用层的范畴了
- /3.0（暂时省略些）
    - 基于UDP
    - QUIC协议
        - 使用QUIC就可以在使用UDP的同时确保传输可靠性
        - QUIC也有stream的概念，但某stream丢失并不会导致堵塞（因为也不用TCP了嘛）
        - 内置TLS 3.0加密，因此在自己握手的时候就完成了TLS握手，省却了握手步骤
        - QUIC两次握手
            - 在握手时就把TLS也搞定了
            - 只需要1 RTT
            - 握手时还会交换一个重要信息：连接ID
        - 连接ID
            - TCP使用双方地址和端口来区分连接，因此移动数据换成wifi就会导致连接失效，要重新TCP+TLS握手建立连接
            - 因此使用连接ID来区分连接。在连接迁移时，直接通过连接ID重建连接省却了额外的握手成本。
    - 但3.0普及很慢
## SSL/TLS加密通信与HTTPS协议
- HTTP的缺陷
    - 会被窃听（抓包）
    - 会被篡改（修改请求和响应）
    - 会被冒充（假网站）
- 因此出现了使用SSL/TLS的加密传输协议，具体的看SSL/TLS的那部分
- 公钥，私钥
    - HTTPS的交流中存在公钥和私钥两个密钥
    - 一端加密，一段解密，因此可以用于验证客户端或者服务端身份
    - 是非对称加密，因此很消耗计算资源，因此只在SSL/TLS握手阶段才做
- 数字签名：
    - 用以让接收方验证发送方的身份
    - 具体流程
        - 对一段数据进行哈希运算（CA中是服务端的身份验证信息）
        - 用私钥加密
        - 把这段数据本身和上一步加密完的东西发出去
        - 接收方接收到数据和加密内容
        - 接收方公钥解密发过来的加密内容
        - 接收方用和发送方相同的哈希运算计算这段数据
        - 对比接收方解密出来的东西和哈希出来的东西
    - 所以本质上就是接受一段数据并哈希，然后对比和服务端的哈希是否一样。因为过程中用了私钥和公钥加密解密，如果私钥公钥不匹配，对比的东西必然有一段是不一样的。
    - 常见算法
        - ECDSA，RSA
- 数字证书
    - 记录在案（数字证书认证机构 CA）的证书，用来给客户端验证服务器身份用的。
    - 之所以记录在案是为了保证HTTPS的Non-repudiation
    - CA也有自己的私钥和公钥，目的是为了证明CA是CA。公钥一般都被各大浏览器内置
    - 服务器证书的加密方式也有很多种，如RSA、ECDSA等
    - 具体内容：
        - 个人信息
        - 服务器的数字签名
        - 服务器私钥对应的公钥
        - CA对服务器公钥的数字签名
    - os和浏览器都会内置一些信任的证书来源
    - 证书信任链
        - 证书有根证书(root CA)的概念
        - 证书可以由不同的组织签发，但大部分都是嵌套的，目的是为了让一个根证书的失效不会影响所有证书
        - 服务端一般会把所有中间证书都发出来，如果没有则得从url中下载
        - 具体流程
            - 在收到一个证书之后，如果内置的根证书来源无法匹配最近的证书，就会去找该证书的签发者，其被称为中间证书，再次匹配
            - 不停往上溯源，直到找到匹配的根证书，就一层层往回验证中间证书，直到最近的那层也被验证成功
- 数据完整性验证（每次请求都会对内容进行完整性验证以防止篡改）
    - 重点在于消息认证码（MAC）
        - 用会话密钥哈希加密要发送的数据得到MAC
- 在TCP/IP层（网络传输层）和应用层之间加入一层
- HTTP和HTTPS的默认端口号不一样，一个80一个443
- 注意如果使用SSL/TLS，会多一层握手的流程
- SSL 1.0, 2.0, 3.0都因为漏洞问题被弃用，随后才出现了TLS
- record 指一个“计算元”
- TLS overview
    - TLS 1.0
        - 就是基于SSL 3.0的，改进了安全性
        - 四次握手，2RTT
    - TLS 1.1
        - 引入了更强的加密算法
        - 改进了CBC
    - TLS 1.2
        - 引入了更强的加密算法
    - TLS 1.3
        - 简化了握手过程，1 RTT(两次握手)就能握手完成
        - 引入了更强的加密算法
- 加密通信有三个地方需要算法：
    - 密钥协商
        - 这个词不止代表加密算法最核心的计算部分的原理本身，还会间接让通信双方都知道握手时交换哪些和怎么交换信息，以及影响签名算法怎么使用、使用在哪
        - RSA：
            - 不支持前向安全，已经被ECDHE大规模替代了
            - 指定了RSA，就会用RSA加密pre-master key并交换
        - DH：
            - 基于离散对数：X = g^x mod p。x为X的基于g和p的离散对数
            - X称为真数，x称为真数X基于g(底数)和p(模)的离散对数
            - 具体来说，X和x就是此算法的关键：在有X的情况下现代计算机无法得出x，但有x则能直接得出X
            - 简单流程(具体的使用看下面的握手流程)：
                - 客户端和服务端都有自己的离散对数
                - 客户端生成g和p，计算出自己的真数，把gp和真数都发给服务端
                - 服务端使用gp生成自己的真数，并发回给客户端
                - 使用同样的gp、对方的真数、自己的离散对数，客户端和服务端可以分别独立生成出相同的对称密钥(这是离散对数神奇的交换律)
                - 如此便完成了密钥协商交换
            - 根据上述流程，可以看出双方的私钥可以完全随机生成，因为不管它们是多少都不会影响交换律
            - DH算法有两种实现
                - static DH
                    - 有一方的私钥/离散对数是静态的(一般是服务端)，因此在足够多的公开信息(双方真数和gp)被截获后其实还是可以破解静态的那个私钥的
                    - 而且也不具备前向安全性
                    - 已经被弃用了
                - DHE
                    - DH+Ephemeral(Ephemeral：临时的)
                    - 双方的私钥/离散对数每次都随机生成，因此具备前向安全性
        - ECDHE:
            - DHE的计算性能不够好，因此改善
            - ECDHE利用了ECC椭圆曲线特性，能减少计算量
                - 有一个公开的椭圆曲线，和一个基点G。
                - 任意两个数d1、d2分别和基点G相乘得到两个参数Q1、Q2
                - d1xQ2等于d2xQ1
            - 简单流程(具体的使用看下面的握手流程)：
                - 第二次握手时，双方已经确定了使用ECDHE
                - 服务端选择了椭圆和基点(一般一个参数就选好了)，并把自己生成的私钥d1和椭圆基点相乘得到公钥Q1。椭圆配置和Q1都发给客户端。签名算法会签名Q1
                - 客户端用椭圆参数和自己的私钥d2得到Q2（Q2=d2x基点），发给服务端
                - 对称公钥交换完成
        - PSK Pre-Shared Key
            - 通信之前就通过某种方式交换了的密钥
    - 数字签名
        - 在同一次通信中，如果有被签名的数据发出，一定也会有签名前的数据被发出，以供接收方验证
        - 注意签名算法用在哪和密钥协商算法的选择有关系
        - RSA为协商算法时
            - 用在握手摘要的签名
            - 注意，pre-master key的加密和签名算法的选择没关系，是只要协商算法用了RSA，就会有这么一步RSA加密pre-master key的步骤
        - ECDHE为协商算法时
            - 用在服务端发送Q1时用私钥签名
            - 用在握手摘要的签名
    - 对称加密
        - AES
    - 消息认证码(MAC)算法
        - 和签名算法有些相似，都是把目标数据和加密后的副本一起发给接收端供验证

- 握手流程/密钥协商流程（非TLS 1.3）
    - 第一次握手：客户端向服务器发送一个握手请求(ClientHello)
        - 包含支持的 SSL/TLS 版本、加密算法套件列表、生成的一个随机数(Clinet Random)。
    - 第二次握手：服务器响应握手请求(ServerHello)
        - 使用RSA：
            - 确认SSL/TLS版本，选择一个加密算法套件，生成一个随机数(Server Random)，向客户端发送数字证书
            - `Server Hello（随机数S，选择的tls版本，选择的密码套件）+ Certificate + Server Hello Done`
        - 使用ECDHE：
            - 确认SSL/TLS版本，选择一个加密算法套件，生成一个随机数(Server Random)，向客户端发送数字证书，发送服务端的椭圆曲线
            - 椭圆曲线和其基点的配置由一个神秘的椭圆名字来指定。指定之后服务端就按照算法定义(d1xG=Q1)用私钥算出公钥Q1(Server Key)给客户端
            - 会签名Q1，随着Q1本身一起发出
            - `Server Hello（随机数S，选择的tls版本，选择的密码套件）+ Certificate + Server Key Exchange（发出Q1）+ Server Hello Done`
    - 第三次握手：客户端行动
        - 验证服务器的数字证书
            - 客户端用内置的CA公钥解密出CA数字签名的服务器公钥
            - 对比服务器发来的公钥，如果相同就代表CA认证通过
            - 服务端一般会把所有中间证书都发出来
        - 客户端ACK
            - 使用RSA：
                - 再生成一个随机数(pre-master key)。然后用服务器的公钥加密发给服务端。此时客户端可以生成会话密钥了
                - `Client Key Exchange（公钥加密pre-master key）+ Change Cipher Spec（通知换成会话密钥）+ Encrypted Handshake Message（握手摘要）`
            - 使用ECDHE：
                - 用自己的私钥d2和接到的椭圆配置计算出第二个公钥Q2，发给服务端
                - 注意此时客户端已经可以生成对称会话密钥了(d2xQ1)，但前两次握手的随机数也会参与其中，最后的会话密钥 = Client Random + Server Random + d2xQ1
                - `Client Key Exchange（公钥加密pre-master key）+ Change Cipher Spec（通知换成会话密钥）+ Client Key Exchange（发出Q2）+ Encrypted Handshake Message（握手摘要）`
            - 通知服务端开始使用会话密钥
            - 生成之前所有握手数据的摘要供服务端校验
            - 通知服务端握手结束
    - 第四次握手：服务器行动
        - 使用RSA：
            - 用私钥解密收到的用公钥加密的请求
            - 用目前为止生成的三个随机数(Client Random, Server Random, pre-master key)和协商好的算法生成会话密钥
            - 通知客户端开始使用会话密钥
            - 生成之前所有握手数据的摘要供客户端校验
            - 通知客户端握手结束
            - `Change Cipher Spec（通知换成会话密钥）+ Encrypted Handshake Messgae（握手摘要）`
        - 使用ECDHE：
            - 得到客户端公钥Q2，至此密钥交换完成，服务端计算出最后的会话密钥 = Client Random + Server Random + d1xQ2
            - 通知客户端开始使用会话密钥
            - 生成之前所有握手数据的摘要供客户端校验
            - 通知客户端握手结束
            - `Change Cipher Spec（通知换成会话密钥）+ Encrypted Handshake Messgae（握手摘要）`
    - TLS False Start：使用ECDHE的话可以在第四次握手前就开始发送数据
- 密码套件
    - 在第一次握手时服务端提供一列可用套件，在第二次握手时服务端选择一个套件
    - 套件格式：`TLS_[密钥交换算法]_[签名算法]_[对称加密算法]_[MAC算法]`
    - eg `TLS_RSA_WITH_AES_128_GCM_SHA256(0x009c)`
        - WITH前只有一个算法名称，所以密钥交换和签名都用RSA
        - 对称加密算法则用AES，128位密钥，分组模式为GCM
        - 用SHA256进行Handshake Message摘要
    - eg `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA256(0x009c)`
        - 密钥交换算法用ECDHE
        - 签名用RSA
        - 对称加密算法则用AES，256位密钥，分组模式为GCM
        - 用SHA256进行Handshake Message摘要
- 对称加密通信
    - 每次通信都会验证数据完整性
    - 具体流程
        - 发送方用协商好的哈希和生成好的会话密钥对数据生成MAC
        - 把MAC集合在请求中正常会话加密发送给接收端
        - 接收端解密后得到MAC和数据
        - 以相同的哈希和会话密钥对数据生成对应MAC，如果和请求中的不用一样就代表数据可能被篡改过。相同则代表数据安全
- TLS 1.3
    - 一次RTT就能握手（具体发送了什么自己想）
    - 废除了不支持前向安全的RSA和Dh，只使用ECDHE，而签名算法、对称加密算法啥的选择也减少了
    - 可以把密钥和Hello一起发出去，达到1RTT握手
- 重放攻击与前向安全
    - 不具备前向安全的通信协议/方法都会导致重放攻击的可行性
    - 重放攻击就是重复利用监听到的用户请求

- 有趣的是，大公司的内网访问外网，其实是公司自己作为中转服务器来签发CA给客户端以及和目标服务端建立连接。而由于公司内网肯定会信任这个中转CA，HTTPS的一个例外情况被利用在企业内网安全上
- TLS证书就是https验证用的数字证书
- Cloudflare 向所有用户提供免费的 TLS/SSL 证书
- 由于历史遗留原因（人们已经用ssl很久了），tls配置很多时候仍会使用ssl作命名，但实际上命名为ssl的东西基本上都同时支持tls了

## HTTP请求性能优化与压缩
### General 优化
- 减少重定向
    - 代理服务器(类似中间件的服务器)一般只负责把迁移后的url发给用户(3xx status)，然后用户再对代理服务器访问新url
    - 但实际上如果代理服务器自己就能转发请求，自然就可以节省一次请求
- 合并请求，减少请求次数
    - 把多个小文件合并成一个大文件 (对pipeline用处有限)
        - 例如用CSS Image Sprites把小图片合并为一个大图片，得到响应后切割
        - 例如webpack把js、css啥的打包成一个大文件
    - 把图片编码成base64，跟随html一起发送
- 延迟发送/懒加载
    - 按需发送请求，例如滚动才能看到的数据延迟发送
- 压缩
    - General方法：去掉对机器没用的符号，如换行符制表符
    - 无损压缩
        - 霍夫曼编码
            - 统计原始数据，生成代表数据的二进制比特序列
            - 频繁出现的数据用较短的序列，不常出现的用长一些的（以此让短的序列储存较frequent的数据）（这也是HTTP/2.0的一个主要优化）
            - ACSII码的字符都被按照频率编码过了
        - 常见的算法：gzip, deflate, br(br是Google开发的Brotli算法的缩写，压缩效率最高)
    - 有损压缩
        - 牺牲次要数据来减少数据量，
        - 一般是音频图片视频用的比较多
        - 图片
            - 相同质量的webp的图片大小比png低
            - 图片把相同/近的颜色合并为同一个数据来集体表示
        - 视频
            - H264、H265
            - 用增量数据表达两个帧之间改变了的那些区块
        音频
            - AAC、AC3
    - 具体使用
        - 使用`Accept-Encoding: `header来标识接受的压缩算法
        - 响应式声明`Content-Encoding: `来标识选择的压缩算法
- 连接池
    - 很多网络库都会内置连接池
### HTTPS优化
- 硬件优化
    - 用更快，甚至特化过加密计算的CPU，如支持AES-NI特性的CPU优化了AES算法
- 软件优化
    - 对称加密算法使用ChaCha20，对CPU更友好一些，但有AES-NI的则该用AES
    - 短一些的密钥长度也能快些，如使用AES_128_GCM比AES_256_GCM快一些
    - 升级软件，如更新OpenSSL，一般都会有优化
- 协议优化
    - ECDHE支持False Start，变相让TLS握手减少到1RTT
    - ECDHE选择x25519曲线，这个曲线是最快的
    - 使用TLS 1.3，实现真正的1RTT
- 证书优化
    - 证书传输优化
        - 使用ECDSA证书，因为相比RSA证书密钥短得多，能减少带宽
    - 证书验证优化
        - 证书链逐级验证或会需要访问CA，这样便增加了大量网络成本
        - 有几种解决方法
            - Certificate Revocation List CRL 证书吊销列表
                - CA定期更新。
                - 但CRL庞大，实时性也较差
            - Online Certificate Status Protocol OCSP 在线证书状态协议
                - 只查询和返回某证书是否有效
                - 解决了实时性
            - OCSP Stapling
                - 服务器不止发送证书，还会周期性地把自己的证书的OCSP响应保存并发出，包含其时间戳
                - 因为CA的签名，服务器无法篡改
- 会话复用
    - 直接复用会话就能减少TLS握手的开销，1 RTT就能恢复对话
    - 有几种方式
        - Session ID
            - 客户端和服务器在第一次握手后会保存一个唯一的session ID，在一段时间内再次尝试握手就会带上这个ID，如果ID还没过期就能直接重新建立TLS通信而无需再次计算密钥和握手
            - 但服务器这样要储存所有session ID和对应对称密钥，压力比较大
            - 而且由于负载均衡，命中的服务器未必存有对应的密钥和session ID
        - Session Ticket
            - 服务端会把会话密钥加密发给客户端让客户端缓存。之后一段时间的TLS请求服务端就会解密和验证Ticket有效期，并直接用这个密钥来开始和客户端对话
            - 只要确保每台服务器用来加密Ticket的密钥是一致的，每一台服务器都能响应会话复用
    - TLS 1.3甚至能0 RTT回复对话
        - 具体来说就是把复用请求的ClientHello和HTTP请求一起发过去，HTTP请求会被对称密钥加密
        - 因为session ID并不是敏感信息，session ticket又会被服务端加密，明文的ClientHello并不会泄露密钥信息
        - 但仍受重放攻击威胁
    - 但会话复用不具备前向安全性，且受重放攻击威胁
        - 客户端申请会话复用的请求可以被监听
        - 这样攻击者在会话复用有效期内伪造一份监听到的请求，就能重复发出这份请求
        - 只能通过设置过期时间，或者只针对安全幂等的HTTP请求允许会话复用来避免重放攻击

## RPC (Remote Procedure Call)
- 顾名思义，其思路就是想调用本地函数一样调用远程服务器提供的接口，因此能够屏蔽一些网络上的细节。
- 本质上RPC只是一种设计理念，具体实现有很多种，例如gRPC和Thrift
    - gRPC底层其实就是套HTTP/2.0
- 大部分RPC都基于TCP，但也可以用UDP甚至套HTTP
- HTTP vs RPC的实现
    - RPC更多使用C/S架构，可定制性更高；HTTP则更多是B/S
    - HTTP用DNS服务发现，RPC则有专门的中间服务去保存服务发现资料
    - RPC内置连接池，不需要网络库的额外实现。HTTP则不内置连接池
- 实际上，HTTP/2.0的性能已经在很多场合都比RPC高了。而由于历史遗留原因，很多RPC哪怕可以被优化也不会这么做
- RPC优势
    - 因为可定制性更高，可以协商好一种最简洁的协议，把一切可省略的重复的header、body啥的都省略，达到更好的性能
        - 例如Accept、Content-Type啥的
    - 使用体积更小的Protobuf来保存数据

## WebSocket协议
- 本质上就是应用层的一个功能，可以视为HTTP的升级双向版，因此也有其大部分现代特性
- 特点
    - 允许全双工通信
- 使用：
    - ws://或者wss://
    - 在HTTP/HTTPS的握手阶段就声明以下headers：
        - `Connection: Upgrade`：表示要升级协议
        - `Upgrade: websocket`：表示要升级到websocket协议。
        - `Sec-WebSocket-Version: 13`：表示websocket的版本。如果服务端不支持该版本，需要服务端返回一个`Sec-WebSocket-Version` header，里面包含服务端支持的版本号
        - `Sec-WebSocket-Key`：与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接
        - e.g.
            ```
            GET / HTTP/1.1
            Host: localhost:8080
            Origin: http://127.0.0.1:3000
            Connection: Upgrade
            Upgrade: websocket
            Sec-WebSocket-Version: 13
            Sec-WebSocket-Key: w4v7O6xFTi36lq3RNcgctw==
            ```
    - 服务端响应
        - 101代表协议切换
        - e.g.
            ```
            HTTP/1.1 101 Switching Protocols
            Connection:Upgrade
            Upgrade: websocket
            Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
            ```
    - 数据帧结构
        - 4位 opcode：标志数据帧类型。如1等于text类型，2等于字节流类型，8等于关闭连接
        - dynamic的payload长度
            - 7, 16, 32, 16
## 文件协议
- file://
## DNS协议 Domain Name System
- 默认用UDP，适合快速查询
- 大量传输时用TCP，但较少见
## FTP协议 File Transfer Protocol
- 基于TCP
- ftp://
## SMTP/POP3/IMAP协议
- 都是email用的协议
- SMTP(Simple Mail Transfer Protocol): 用于发送email
- POP3(Post Office Protocol 3): 用于下载email
- IMAP(Internet Message Access Protocol): 用于访问email
- 基于TCP
## SSH协议 Secure Shell
- 用于在不安全的网络上安全地访问计算机
- 基于TCP
## Telnet协议
- 用于远程使用命令行接口
- 基于TCP
## NTP Network Time Protocol
- 用于同步时间
- 基于UDP
## DHCP协议 Dynamic Host Configuration Protocol
- 基于UDP
## SNMP协议 Simple Network Management Protocol
- 用于网络管理和监控
- 基于UDP

# 传输层
- seq_num
    - 其实会不停循环分配，不然会overflow
    - 值得一提的是window size和seq_num有关联，具体在于类似哈希的避免同一个window中出现了相同的seq_num，因此seq_num要大于window size*2
## TCP
- 三大特点
    - 面向连接
    - 可靠
    - 基于字节流
        - 也就是粘包问题的根源：TCP不负责parse字节，只负责传（这也是传输协议出现的原因）
- 使用四个元素识别一条链接：
    - 源IP、目标IP、源端口、目标端口
- 三次握手
    - 流程
        - 发送方SYN请求
        - 接收方收到SYN，发送SYNACK
        - 发送方接收到SYNACK，发送ACK
    - 如果任何包丢失了，都会触发超时重传
    - 任何原因接收到了重复的包，都会重新发送对应的回复包
        - 如发送方syn丢失，发送方一定时间没接收到synack就会再发syn
        - 如接收方synack丢失or发送方ack丢失，接收方一定时间没接收到ack就会再发synack
- 发送数据（重传、流量控制）
    - seq_num来标识不同数据包
    - 发送方和接收方会有缓存，因此只需要重发/重复ACK特定的那个序列号就行
    - 接收方哪怕接到了重复的包，也会照样发ACK，只发一两次也不会触发快速重传
    - 注意ACK的确认序列是发送方的序列+1单位
    - 缓存不能过小到倒计时重传/快速重传都还没触发就溢出了
    - 接收方发送ACK
        - 默认使用累计ACK，也就是不会轻易ACK，而ACK了就只会ACK最后一位顺序的seq_num
        - 延迟ACK机制
            - 接收到包之后不立刻ACK，而是开始倒计时。如果这段时间内如果没有接收到下一个包或者收到了**两**个包（标准建议），就ACK
        - 立刻ACK的时机：
            - 接收窗口满了，立刻ACK。（和累计ACK的数据包数量没啥关系）
            - 接收方收到乱序数据包，就会立刻ACK最后一个按顺序的包
            - 发送方的数据段包含PUSH标志（发送方手动要求直接ACK）
            - 发送方的数据段包含FIN标志（发送方请求终止连接） 
            - Nagle算法（？）
    - 发送方快速重传
        - 出现三次重复ACK的时候，重传。而在三次之前发送方都仍然会继续发送
            - 一般是乱序了导致接收方立刻ACK，但因为实际上是丢包了导致的不停立刻ACK
            - 一方面是为了触发接收方的乱序立刻ACK，一方面是为了包容一到两个单位的包并没有丢只是乱序的情况
    - 发送方超时重传
        - 和累计ACK的触发条件有关系（如果延迟ACK时间导致超时或者触发一次累计ACK的数据包数量太多导 致超时）
        - 倒计时时的行为：
            - 发送方丢包：在倒计时时仍然会继续传，但因为接收方乱序，会缓存和立刻ACK。要么三次后快速重传，要么倒计时结束重传
            - 接收方丢包：后续的数据包在接收方看来是正确的，因此必然倒计时重传，而接收方只会发多一次ACK而已
    - 窗口更新（流量控制）
        - 为了应付buffer已满的情况而设置的特性
        - 窗口大小就是缓存空间可用的剩余大小，和包的大小没啥关系
        - 接收方的每次ACK都会包含窗口大小
        - 具体流程：
            - 接收方buffer(也就是窗口)满了时，忽略所有新包并发送窗口最后一个包的ACK，这个ACK的窗口大小为0
            - 发送方收到ACK并停止
            - 接收方在处理得差不多之后（看os的设置），发送新的窗口大小不为0的ACK
            - 发送方接收到该ACK，并按照其序列号继续发送
- 四次握手连接终止
    - 由发送方起头，然后各自都发一次FIN和接受一次ACK
    - 具体流程：
        - 发送方：FIN（发送方再也无法主动发送，只能回复）
        - 接收方：ACK
        - 接收方：FIN（接收方再也无法主动发送，只能回复）（但也不需要回复了）
        - 发送方：ACK（接收方closed）
        - 等待2*segment_lifetime（发送方closed）
- segment_lifetime
    - 约等于重传计时器时长
    - TTL(Time to Live)好像也会影响
## UDP
    - checksum具体的原理？

# 互联网层/网络层
## 服务发现
- 就是要通过什么手段在互联网上发现某个endpoint
- DNS就是很经典的服务发现组件
- 其他例子：
    - Consul、Etcd、Redis



- to-do:
    - UDP（跳过
    - QUIC（跳过
    - TLS 1.3（跳过
    - HTTP/3.0（跳过