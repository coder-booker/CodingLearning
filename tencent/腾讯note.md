
# 逻辑行为架构
- Behavior
# sheet整体架构
- 数据层
    - Request
        - 用户的操作会对应request
        - 一个request可以有一个或多个mutation
    - Mutation
        - 已经有完善冲突处理机制和已经被切割为完善原子操作的数据更新行为的抽象
        - mutation修改的就是Model数据
        - 【？】与中台交互
    - Model
        - 保存在内存里的图表原数据（后续业务层还会再抽象一次来让图表数据更通用）
        - 基于ooxml的
    - 【？】负责把UserChange序列化给中台
    - 【？】change-diff
- 业务层
    - 把数据层传入的数据抽象成通用格式，以方便标准化和跨平台使用
    - 有些平台会在通用格式之上再客制化一层数据抽象
- 渲染层
    - 样式/数据呈现，部分UI交互逻辑
    - 不同浮动元素有自己的渲染处理器（其实就是一个渲染挂载器，调用了就会渲染对应的浮动元素
    - 业务开发
        - 渲染引擎
        - 插件
- 浮动元素
    - 数据层：FloatObject -> CanvasObject/DomObject
    - Manager：数据层与渲染层的中间层，负责两者的交互逻辑
    - 渲染层：ObjectBoard -> ObjectCanvas/ObjectViewBoard
        - object canvas就是canvasObject的画布，object view board就是DOM的容器
        - 还有一个adapter，用来处理多画布的切换issue
    - 交互相关：
        - Container和selectContainer
            - 【？】每个浮动元素都有一个container，而dom浮动元素还有个selectContainer
            - canvas用container绑定事件，dom用selectContainer绑定事件
        - 事件链
            - 原生事件 -> operate-board代理事件
            - 【得多看看】operate-board就是adapter的事件绑定器，画布pointerEvent为auto之后就不会再被访问到，反之理论上为none的话浮动元素本身的事件就不会被检测到
        - 【这个问题和上一条算同一个，得仔细看看adapter和原生事件的触发时机】为什么不stopPropagation现在也能正常运行了？原本是因为pointerDown没stop所以事件投到了后面，现在怎么不会了？

- 一些概念：
    - 思考的时候可以从两个方向想：一个是从数据解析成图表，一个是从图表恢复成数据，在架构上方向相反
- 一些词
    - 解析、落盘
        - 把model数据解析成图表，把图表写回成数据
    - Drawing
        - =浮动元素，不同名字而已
- 代码思考方法
    - 出现需求时，应该从一开始的逻辑/架构设计层面开始思考，而非过于执着于代码
        - 例如：当某交互逻辑变更时，对应的架构实际上也可以大概，不需要维持原本的样子

# other
- 规范：
    - 类型转换使用 no-new-wrapper规则
    - 缩进统一用两个空格，这也是最主流的
    - parseInt一定要加上底数
    - 对象尽量不要增加减少键，在声明时都set好
    - 布尔转换用Boolean或!!
    - 关于this：
        - 8.1, 9.3, 9.7, 23.5
    - 修改数组内容尽量用immutable，也就是map或者Array.from，for of啥的很多restriction
    - 闭包函数用箭头函数，其他函数都会有this绑定错误的情况
    - 箭头函数
        - 函数体为表达式时，需要用圆括号括起来
        - 函数体为一个表达式时，无需使用花括号
        - 参数只有一个就无需用圆括号包起来
    - 类
        - private是ts的语法，js用不了
        - 方法名不要有下划线
        - 构造函数有需要才写
        - 不用this的方法建议用静态声明
        - 方法可以返回this来链式调用
    - 导入导出
        - 10.2, 10.3, 10.4, 10.7
    - 函数
        - 有默认值的参数往前写
        - 不要更改参数值和内容
    - 写法规范
        - 分号：
            - 每一行都要分号
            - 花括号后一般不需要分号
            - 函数如果没有赋值给谁，不需要分号
    - 存取器：
        - 24.x都是


# to learn
- 什么叫每次图表刷新都会加载mutation？mutation不是操作吗？操作完写入modal后，mutation应该消失了？
- 浮动元素container和stopPropagation的知识
- selectContainer和container有啥区别
    - container是元素对象的容器，可以理解为那个元素本身
    - selectContainer是选中态的元素对象容器


# temp