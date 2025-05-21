
- 那个bug至少commit出去，问问jacky

# XML editor (tobedecided)
- 思考一下架构
- 有什么外部库，有什么自家的库要导入（both script or copy）
    - 先把环境配好
        - 用脚手架还是自己一个一个配？
        - react-mini
        - ant-Design
        - vite的热加载
- 要怎么import和export

# new admin function
- 需求
    - bundling/aci search page
        - 在admin portal搞出一个bundling/aci search page，支持通过ubr/ccrn搜索bundling detail/aci detail
        - 能够展示detail
- progress
    - 【完成】前端
        - 【完成】bundling： JsonForm+JsonForm
        - 【完成】aci：JsonForm+Table（因为已经有现成的aci review table了）
    - 【完成】后端
        - 【完成】自制api
            - 【本来接好了，现在得改】controller、service、dto、repository还没接好（主要是repository的submissionType要搞一搞，以及后续的criteria的搜索也得接）
                - 【完成】where to find Submission Channel
                    - 要改local svc
                - 【完成】后端接口？：VITE_ROAD_BUNDLING_API_ENDPOINT
                    - 要改local svc
        - 【完成】前端通过report访问aci和bundling服务以越过session checking
            - 【完成】接report和Feign client
                - 【解决了，禁用tls就行了】可能是session token的問題，可能是因爲别的什么原因，总之现在Feign client访问的接好的aci admin enquiry api会报错，说需要TLS
    - 【解决】form要怎么修改value
        - form.setFieldValue
    - 【直接不管】Custom的神秘remark能不能commit解决下
    - 【不到】TRdBundleMast和EnquireBundlingRecordDetailDto的区别是什么
    - 【解决】有些bug
- bruh



要问raymond的：
1. XML？edit？
2. Bundling的CCRN list的Submitted By






- to be learnt later
    - redux middleware
    - tableControl和TSWJson的区别
    - 通用前端组件