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
### 常用指令
- 定义：
    - NOT
        - eg 'NOT IN'
    - DISTINCT 
    - ORDER BY
        - ORDER BY xxx ASC/DESC
        - 可以用多于一个键来排序，用 ',' 分开就行
            - ORDER BY xxx ASC, yyy DESC.
    - LIKE
        - 经验：'%xxx%'
    - IN
        - 嵌套查询
        - eg
          ```sql
          SELECT xxx FROM XXX
          WHERE xxx IN (
            SELECT xxx FROM YYY
          )
          ```
    - SELECT
        - 经验：
            - 可以在列名写数学表达式，直接进行计算
    - FROM
        - 经验：
            - FROM 多个表会直接把其 Cartesian product 列出来，也就是两个表每一行之间的排列组合，前者在前
    - 聚合相关
        - 定义：
            - 具体操作：
                - AVG/SUM
                - MIN/MAX
                - COUNT
            - HAVING
                - 对 group 整体的数据进行 where 条件筛选，比如 AVG 的值大于某个数的 group 才保留
        - 经验：
            - 注意，FUNC(*) 也是对group内的 * 进行的，不是对全部记录进行的
            - 没有 GROUP BY 的话就会将所有东西视为一个组进行聚合操作
            - eg
                ```sql
                SELECT 
                    customer_id,
                    COUNT(order_id) AS order_count,
                    SUM(amount) AS total_amount
                FROM Orders
                GROUP BY customer_id;
                ```
    - JOIN 相关
        - JOIN:
            - 定义：
                - JOIN 其实都是把两个表接起来，但 JOIN 不会输出 NULL， OUTER JOIN 会
                - 单独的 JOIN 就是 INNER JOIN 的缩写
            - 经验：
                - LEFT/RIGHT/FULL INNER JOIN 会报错
                - 其实直接 FROM 两个表就是 JOIN
                - 不 ON 的话和 FROM 多个表一样，产生 Cartesian product
        - OUTER JOIN:
            - 定义：
                - 在 JOIN 的基础上保留一个/多个指定的表的所有行，哪怕没通过 ON 筛选
                    - 没通过的对应行的列会为 NULL（注意是不被保留的那一边才会）
                - 必须跟着 LEFT/RIGHT/FULL ，以此决定保留哪个表
                - LEFT JOIN 是 LEFT OUTER JOIN 的缩写，不是 LEFT INNER JOIN 的缩写，不要搞混了
                - eg
                    ```sql
                    LEFT OUTER JOIN XXX 
                    ON xxx = yyy
                    ```
            - 经验：
                - LEFT JOIN 是 LEFT OUTER JOIN 的缩写，不是 LEFT INNER JOIN 的缩写，不要搞混了
                    - 为了让 JOIN 这个缩写可以给 INNER 和 OUTER 通用，其实还挺多态的
        - CROSS JOIN：
            - 一种额外的语法，用来表示‘我要产生 Cartesian Product’。这个语法也因此不接受 ON，会报错
            - 其实就是没有 ON 和 WHERE 的 JOIN，但这算是主动表示 ‘我就要这么干’ 的做法
        - 经验
            - 可以用以下思路来理解不同 JOIN
                - JOIN/INNER JOIN：交集
                - LEFT OUTER JOIN：交集 union (左侧 EXCEPT 交集)
                - RIGHT OUTER JOIN：交集 union (右侧 EXCEPT 交集)
            - 注意， ON 和 WHERE 虽然都可以用与筛选，但本质不同
                - ON 是给 JOIN 特化的筛选，因此可以适应 LEFT 和 RIGHT 的保留记录
                - WHERE 是通用的筛选，不管你 LEFT 不 LEFT，因此也不会保留记录
    - 嵌套相关
        - 定义：
        - 嵌套用的命令：
            - SOME/ANY
                - 将值与子查询结果集的任意一个值进行比较，满足其一即返回 true
                - 注意：空子集返回 false（预设为 false 比较好中断）
                - eg
                    ```SQL
                    SELECT name FROM Employees 
                    WHERE salary > SOME(SELECT salary FROM Employees WHERE title = 'Manager');
                    ```
            - ALL
                - 将值与子查询结果集的每一个值进行比较，满足所有子查询即返回 true
                - 注意：空子集返回 true（预设为 true 比较好中断）
                - eg
                    ```SQL
                    SELECT name FROM Employees 
                    WHERE salary > ALL(SELECT salary FROM Employees WHERE title = 'Manager');
                    ```
            - EXISTS
                - 检查子查询是否返回至少一行结果，因此可以理解为 exist
                - eg
                    ```SQL
                    SELECT name FROM Employees e1
                    WHERE EXISTS (SELECT 1 FROM Employees e2 WHERE e2.salary > e1.salary);
                    ```
        - 经验：
            - 注意，嵌套也会类似 Cartesian Product 的对比出现，也就是每一行的父级记录都会跑一遍子级的命令
    - NULL
        - 定义：
            - IS NULL 用于判断 NULL
            - 运算包含 NULL 则返回 NULL
            - 对比包含 NULL 则返回 UNKNOWN，即便是 NULL 之间对比
            - WHERE 和 HAVING 认为 UNKNOWN 是 false 
                - NOT UNKNOWN 也是 UNKNOWN
            - NULL 对 group 操作会被忽略
    - 集合相关
        - 定义：
            - 集合操作不是左右拼接，而是上下拼接，因此需要列数对应
        - UNION
            - 会自己去重
            - 可以写 UNION ALL 来不去重
            - 经验：
                - 性能较低（因为需要排序和去重）
                - 可以用 NULL 填充没有的列
        - INTERSECT
            - 注意，MySQL 没有，但可以用 JOIN 
        - EXCEPT
- 经验：
    - 去重
        - SELECT DISTINCT 可以去重
### B 树与索引
- 索引：
    - 算是一个额外的标识，用于更快的搜索（o(logn)）而不用 o(n) 全量搜索
    - 可以被创建
        - 一般主键会自动创建索引（Clustered Index）
        - 自己也可以创建（Non-clustered Index）
            - 单列：
                ```sql
                CREATE INDEX idx_users_email ON users(email);
                ```
            - 复合索引（多列）
                ```sql
                CREATE INDEX idx_employees_name_dept ON employees(last_name, department_id);
                ```
    - 索引不是免费的！
        - 占用存储空间
        - 降低 INSERT/UPDATE/DELETE 速度（需要维护索引）
        - 过多索引会让查询优化器困惑
    - "什么情况下应该创建索引？"
        - "应该在查询频繁但更新较少的列上创建索引，比如：
            - 主键和外键列
            - WHERE 子句中经常使用的列
            - 经常用于 JOIN 的列
            - 经常用于 ORDER BY 和 GROUP BY 的列
        - 复合索引遵循最左前缀原则，如果某次查询不符合索引的左侧，哪怕其实是在找右边的某个列，也会找不到
    - "索引一定能提高性能吗？"
        - "不一定。在以下情况下索引可能无效甚至有害：
            - 小表（全表扫描可能更快）
            - 数据频繁更新的表
            - 查询返回大部分数据时（索引+回表可能比全表扫描更慢）
            - 索引列参与了函数或计算：WHERE UPPER(name) = 'JOHN'"
- B+ 树

-- 唯一索引
CREATE UNIQUE INDEX idx_employees_email ON employees(email);
    - 使用 B+/* 树 implement
- 

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
    - `||` 在MySQL中不默认可用，SQLite中默认可用
- 触发器是啥

