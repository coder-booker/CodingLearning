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