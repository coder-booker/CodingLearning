
# concept
- General concept
    - 软件不只是程序，还包含文档、配置环境与资源、外围辅助材料
    - 软件工程有两个方面：技术+管理；和三个要素：方法+工具+过程 
    - 软件工程标准：
        - GB：国家标准（中国） 
        - ISO：国际标准（国际化标准组织） 
        - DIN：国家标准（德国） 
        - IEEE：行业标准（美国电气与电子工程师协会） 
- 生命周期
    - RSDIVE
        - Requirement
        - Specification
        - Design
        - Implementation
        - Validation
        - Evolution
- 各种模型
    - Waterfall
        - 把生命周期结构化，按照顺序依次开发
    - Incremental
    - Prototype
    - Spiral
    - Agile
- CI/CD
    - 持续交付/部署
    - 自动且频繁地合并分支和release到部署的一套流程
    - 把合并分支和部署的行为拆分且自动化，这样一切微小的更改都能快速经过测试和部署
    - 本质上就是把手动处理的内容自动化了，因此需要非常完善的自动测试流程，否则自动部署会爆炸
- Trouble-shooting
    - There are common steps: 
        1. identify the situation/context
        2. identify the problem
        3. brainstorm some solutions
        4. evaluate them and pick the best one
        5. implement
        6. evaluate the result
- A/B 测试
    - 是一种通过比较两个或多个版本（A和B）来确定哪个表现更好的实验方法。通常用于优化网页、应用或营销策略。具体步骤包括：
        - 确定目标：如提高点击率或转化率。
        - 创建版本：设计两个或多个不同版本。
        - 随机分配流量：将用户随机分配到不同版本。
        - 收集数据：记录用户行为数据。
        - 分析结果：通过统计方法确定哪个版本更优。
        - 实施最佳版本：选择表现最好的版本进行推广。
- A端B端C端啥的
    - A端（Admin端）：管理员使用的界面或系统，用于管理后台、用户权限等。
    - B端（Business端）：企业或商家使用的系统，如电商平台的后台管理系统。
    - C端（Consumer端）：普通消费者使用的界面或系统，如电商网站或移动应用。
    - D端（Developer端）：开发者使用的工具或平台，用于开发、测试和部署应用程序。
        - 例子：IDE（集成开发环境）、API管理工具、版本控制系统（如Git）。
    - E端（Employee端）：企业内部员工使用的系统或应用，用于日常工作和内部管理。
        - 例子：企业内部的人力资源管理系统（HRMS）、内部通讯工具（如Slack、Microsoft Teams）。
    - G端（Government端）：政府机构使用的系统或平台，用于公共服务和管理。
        - 例子：电子政务系统、税务申报系统、公共安全管理系统。
    - S端（Supplier端）：供应商使用的系统或平台，用于与采购方进行业务交互。
        - 例子：供应链管理系统（SCM）、供应商门户。
    - P端（Partner端）：合作伙伴使用的系统或平台，用于协作和资源共享。
        - 例子：合作伙伴关系管理（PRM）系统、联合营销平台。

# 库管理
- MonoLith
    - 石山
- MultiRepo
    - 代码分不同repo
    - 权限、版本、配置、开发、测试都隔离，简化管理内容
    - 但会增加跨repo开发的成本，比如依赖管理、重复依赖占空间等
- MonoRepo
    - 优化的MonoLith
    - MonoLith的项目拆分、复用依赖版本
        - 每个子项目都有自己的package.json，同时根项目有同一个package.json
    - 保留模块拆分的管理优势的同时，能够让版本依赖和模块很好地复用
    - 使用场景：
        - 关系紧密的多个项目
        - 复用工具库
        - CI/CD，但得增量构建

# 架构设计/设计模式
### 大致架构
- MVC：view -> controller -> model
    - view: only frontend design detail, no logic or only simple responsive logic
    - controller: controller -> service -> (manager ->) dao
        - controller 就是view和model的中间件，为了让view更加专注于自己的显示而非后台逻辑
        - service就是服务器主要逻辑
        - manager可用于定制化第三方接口的逻辑
        - manager可用于把service的通用逻辑或者嵌套逻辑下沉分离出来，如缓存方案、大型业务等；
        - manager可以与 DAO 层交互，对多个 DAO 的组合复用。
        - dao封装model
    - model: sql or nosql
### DTO, DAO, etc
- 订好前后端不同服务交互时的类定义
### 封装性和耦合性
- 互斥
- 把数据复制过来就会增加封装性，直接调用数据本身则会增加耦合性
### 类与接口
- 抽象类和实际类
    - 抽象类主要是用来继承和组织接口的。如果只是不需要被实例化但有自己的一些静态资源，用实际类就好
### 依赖注入
- 把类所需的依赖解耦至其创建者/使用者，可以用构造函数或者setter实现
- 策略模式 (行为型模式)
    - 把行为给抽象成一个上下文类中的成员，并用策略类向这个成员赋值
    - 和继承的区别在于
        1. 可以动态切换策略
        2. 策略可以用在各种上下文中，而非继承只能用在一个父类下
        3. 符合开闭原则（对扩展开放，对修改关闭）
    - 其实就是不使用override或者更多抽象子类的新增子类方法
        - override无法对多个子类统一进行，如果要统一进行又得加一层抽象子类，与其这样造树，不如用策略
    - 在实现时，有三个关键要素
        - 策略类中的operation (那个等子类赋值的成员)
        - 上下文类中的setOperation (用一个setter来动态改变operation)
        - 上下文类中的performOperation (理论上应该可以直接调用那个变量，但可以用performOperation来封装一下)
- 状态模式
    - 对于状态机，不同状态对不同行为都有不同反应，用if就是地狱，因此我们把状态的变换托管到状态本身，也就是在状态接受行为时，会同时切换状态机的状态。而状态机只需要对着自己的状态perform行为，状态自己会改变状态机的状态
    - 因此状态需要拥有整个状态机的上下文，否则无法改变父的任何成员
    - 关键要素：
        - 每个状态的行为名字要一样
        - 每个状态都要有状态机的上下文
        - 每个状态都得仔细思考下一个状态是什么
### 工厂模式
- 把对象的创建托管给一个工厂函数，返回值就是创建好的实例
- 例子：
    - 单例模式：对象的创建封装了一层判断有没有存在的实例，有就返回实例
    - 多态：一个工厂可以用于创建多个子类实例，通过传入的参数决定创建哪个
### 奇奇怪怪不知道怎么分类的模式
- 模块的初始化时机
    - 懒加载(lazy init)
        - 用getInstance和if exist判断来初始化
    - 预加载(Eager init)
        - 在类中声明一个static属性instance并把类的实例赋值给他，这样应用启动的时候就会初始化这个模块
- interface和abstract
    - interface是“能够做什么”，abstract是“是什么”
    - 类能够实现多个interface，但只能继承一个abstract。所以一个类可以组合多个interface
    - abstract可以让类有公共方法、强制要求必须各自实现的方法（把方法声明为abstarct）、可供覆盖的方法
    - ts和C#其实支持interface实现方法
### Config和.env的优劣
- 最好的做法应该是结合config和.env，把不变的敏感信息写在.env，把易变或者不重要的其他配置放在config文件内



# IDK
- 应用离线下发
    - 流程
        - 打包/生成文件
        - 上传到服务器供用户下载
        - 用户下载
        - 用户打开使用
    - 要考虑的问题(感觉这几点并不属于“流程”的问题)
        - 兼容性
        - 安全性
        - 可维护性(更新方不方便)
        - 用户体验



# to-do
- 各种模型的具体内容和特点
- 软件需求规格说明书
- 软件工程的标准