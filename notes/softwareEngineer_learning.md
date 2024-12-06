
# 软件工程
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


# 设计架构时的思路
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
### 抽象类和实际类
- 抽象类主要是用来继承和组织接口的。如果只是不需要被实例化但有自己的一些静态资源，用实际类就好
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