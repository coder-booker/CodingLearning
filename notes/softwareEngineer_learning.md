# 架构
### MVC
- view -> controller -> model
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

# General concept
- 软件不只是程序，还包含文档、配置环境与资源、外围辅助材料
- 软件工程有两个方面：技术+管理；和三个要素：方法+工具+过程 
- 软件工程标准：
    - GB：国家标准（中国） 
    - ISO：国际标准（国际化标准组织） 
    - DIN：国家标准（德国） 
    - IEEE：行业标准（美国电气与电子工程师协会） 

# 生命周期
- RSDIVE
    - Requirement
    - Specification
    - Design
    - Implementation
    - Validation
    - Evolution

# 各种模型
- Waterfall
    - 把生命周期结构化，按照顺序依次开发
- Incremental
- Prototype
- Spiral
- Agile 



# to-do
- 各种模型的具体内容和特点
- 软件需求规格说明书
- 软件工程的标准