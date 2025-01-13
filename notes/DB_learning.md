# DB Learning

### ACID
- Atomicity（原子性）：
    - 事务中的所有操作要么全部完成，要么全部不完成。事务是不可分割的最小操作单元。
    - 示例：在银行转账操作中，扣款和收款必须同时成功或同时失败。
- Consistency（一致性）：
    - 事务开始之前和结束之后，数据库的状态必须是合法的。事务执行前后，数据库必须从一个一致状态转换到另一个一致状态。
    - 示例：在转账操作中，转账前后双方账户总余额应保持不变。
- Isolation（隔离性）：
    - 多个事务同时执行时，一个事务的执行不应影响其他事务的执行。每个事务的中间状态对其他事务是不可见的。
    - 示例：在并发执行的转账操作中，一个事务的中间状态（如扣款但未存款）对其他事务不可见。
- Durability（持久性）：
    - 一旦事务提交，其结果应永久保存在数据库中，即使系统崩溃也不会丢失。
    - 示例：在转账操作完成并提交后，即使系统崩溃，转账结果也应保存在数据库中。
- Disadvantage： 
    - concurrency, latency, and availability

# SQL
- some sql query new to me
    - ORDER BY [col_index|col_name] ASC|DESC;
    - NAME_COSNT('name', value)
        - 等价于`value AS 'name'`
        - NAME_COSNT()的参数位置可以调用别的函数或者任何运算
        - 用于制定别名、计算等
        - e.g.
        `SELECT NAME_CONST('discounted_price', price * 0.9) FROM products;`
        等价于
        `SELECT price * 0.9 AS discounted_price FROM products;`
    - SELECT 纯数字可以用以扩充列数
        - e.g. 这个例子下union不会报错
        ```
        SELECT uid, firstname, lastname FROM tb_userInfo
        UNION
        SELECT 1, username, password FROM tb_login;
        ```
    - version()（函数）/@@version（系统环境变量） 
        - 返回字符串形式的sql引擎版本
    - LOAD_FILE(path)
        - SQL可以读取文件的内容，path为文件绝对路径
        - path会反斜号转义（注意所有sql查询语句中的反斜杠都会转义）
        - LOAD_FILE还可以进行DNS请求，path以`\\\\`(转义了两个反斜)开头就好
    - SLEEP(num)
        - 延迟num*秒*
    - 字符串拼接
        - CONCAT(str1[, str2, str3])
        - +或者||也可以拼接
    - Char(n1[, n2, n3])
        - 用于整形转换成字符串
        - 可以输入多个整形，然后返回拼接在一起的字符串

- Some other thing new to me
    - xp_dirtree
        - *** MSSQL ***的一个储存过程，用来列出指定目录下的子目录和文件名称
        - 因为不是sql查询语句，反斜杠不会转义
    - 注释
        - `--`, `#`都可以作为注释符号，但不同sql有时候不支持`#`
        - `/* */` 多行注释
- Some concept new to me
    - Stored Procedure 储存过程
        - 创建一个类似函数的东西，封装好并预编译在数据库上
        - 用于封装复杂业务、提高性能
- 编译与执行
    - 编译会识别字符，执行不会


# MySQL
- 字符串拼接
    - `CONCAT`，但似乎一般能用CONCAT的场合也都能用`+`和`||`
    - `+`，但SQLite不能用
    - `||` 在MySQL中不默认可用
- 触发器是啥

