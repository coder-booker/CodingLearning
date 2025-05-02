# 要学什么
- 各种技术栈和组件库大概能做到什么以及怎么做
    - import.meta.env.
    - ts的各种操作
    - antd
    - vitest、react testing
    - scss
- 整体代码的设计思路
    - .d.ts和一般的ts对比有什么优劣？为什么都可以用来定义type和declare type？enum算type吗？
    - ts的神奇操作：
        - ts的类型有点像一个独立的js模块，其中有只有type能用的很多操作（比如type层面的继承和多态）
    - 有哪些比较有亮点的组件库，把能做到什么、怎么做到的、代码的设计思路都大致了解一下
        - TSWJsonForm
            - form、fields、layout、footer、config
        - TSWTable
        - TSWButton
    - hook的设计思路
        - useTable返回了些什么
        - 



# general
- 框架思维
- 想和业务强相关的问题：
    - 整个业务的流程？整个应用的框架？


# 前端：
- 工程化：yarn、jenkins、vite
- 测试：vitest、React Testing Library
- css：ant-design、scss、bootstrap
- third party lib：classnames、hookform、redux、i18next、axios、lodash
# 架构
- 工程化：maven、Nexus（by Sonatype）
# 软件
- openLens、Termius
# 概念
k8s、容器化、VM
# VPN/Host 流程
- 代理服务器：
    - 所有从这个应用出去的连接都会经过proxy修改包头和转发，伪装成是这个proxy发出去的而不是我们自己
    - 我们要访问的目标地址仍然是那个域名/IP，只是源IP/MAC不同了而已
- 有三种IP转换过程：
    - 目标是一个外部域名：
        - 这种情况只会出现在必须使用域名访问且没有内置的proxy的情况，比如后端访问的maven、MQ、DB和openlens的cluster访问
        - 请求访问目标域名 -> 本地DNS解析为本地IP并发出 -> (代理)本地vpn监听本地IP端口请求并赋权转发至对应域名 -> 目标域名收到请求
    - 目标是本地IP，但有内置代理：
        - OpenLens
        - 请求访问本地端口 -> OpenLens捕获转发给至对应服务endpoint -> 目标服务收到请求
    - 目标是外部域名，但是有内置代理
        - git
        - 不需要dns，仍然可以被转发到本地赋权代理端口
        - 访问外部域名 -> 内置代理转发到本地赋权代理端口 -> 本地赋权代理端口赋权转发至对应服务endpoint -> 目标服务收到请求
- Git：
    - 有内置代理(git config)
    - 流程
        1. 声明全局声明git代理地址。所有git请求都会通过本地代理发出去和返回
        2. 开启本地端口转发给这个代理服务器发出的访问添加用户授权信息并发出到实际的IP与端口
        3. 所以只要把git代理地址+DNS+本地端口转发搞定就能更换IP和端口
- OpenLens：
    - 本质上就是一个转发到K8s服务的vpn
    - 初始访问cluster需要DNS+Termius来赋权，之后的访问都是openlens代理的termius赋权代理的本地端口
    - 有内置代理(only for connected cluster service)
    - 流程
        1. 访问本地端口
        2. openlens捕获，修改目标IP，转发给termius代理赋权
        3. Termius发出请求


# library repo的架构
- 组件的设计思路
    - 其实就是把组件想要能够被控制的特征，变成组件的参数来决定，至于细节全部封装起来
        - 不只是一些样式和控制，还可以控制是否要有子组件以及如何生成子组件（也就是Groups类组件）
    - 当然一般也会直接使用或者封装之后再使用现有的组件库或者css库，看需求而已
    - 一些细节
        - 封装组件库时，拓展本身有的props就行
        - 可以对组件库传入style来自定义部分样式
            - 不过得仔细看文档对组件底层的描述对应地设置style
        - 组件最好不要设置margin，除非是那种比较需要复用组件的较大的组件可以对内部元素设置margin
        - 参数可以用'逻辑参数'而非实际的'数字参数'
- 有哪些组件：
    - 功能类：
        - Form/Json2Form:
            - 用json来设定表格的每个field和整个表格的布局
                - 动态设置的重渲染时机和重渲染内容（比如传入一个rerenderTrigger函数，会自动按照适当的规则进行刷新）
                - 动态设置的field类型、是否required、placeholder是什么、options是什么等等
            - 因此每种field都得有自己的layout，工作量会比较大
        - 各种表单输入的种类，例如文字输入、选择、选日期/范围、确认框等
    - 布局/互动类：
        - 特殊互动类：浮动在页面顶层的框、从侧面划出的框、弹出的气泡、进度条、加载的圈圈、水印、页面骨架、导航栏的各种互动等
        - 常用容器类：列表、二维码、下拉框、卡片、日期、旋转木马、timeline、按钮等
            - Container：能够设置
        - 骨架布局类：Table、Row/Col、splitter、空位、flex等

### 主要的库
- Ant Design用过的组件
    - Grid
        - Col, Row
        - col被分为最多24份
        - 可以设置间隔/offset
    - Button
        - 设定type可以使用几种预设样式按钮
            - 比如 primary，dashed，link之类的
        - color、variant、size、loading等多种设置
            - 不是用直接的参数，而是用逻辑参数，比如color设置"danger"意味着文字、bg、边框都变成红色
    - Space
        - 给子组件设置统一的间距的容器
    - Form
        - 对antD的数据录入组件都封装好了
    - Table
        - dataSource和columns
            - dataSource是个对象数组，其中每个元素对象都是一行record，会按照设定好的columns名字/index/render函数等规则填充表格
        - render函数
            - columns配置中用来override默认渲染组件的东西
            - `(<value-of-the-column-in-the-record>, <an-record>): JSX.Element`
- Bootstrap
    - 一般是用于项目自己需要的客制化css组件，或者说AntD似乎无法实现的css效果
### 迷你些的库
- className
    - 封装 “需要根据boolean设置的类名” 这个功能
- zod

# other？
- css
    - 变量设置：颜色、长度等
    - font的配置
    - 第三方库导入与客制化
- ts
    - index.ts和组件.tsx原来可以共存，实现通过指定文件夹名就能导入其下所有暴露的模块的功能。可以把导出配置和具体组件独立分开，也能让其他组件导入时的路径被封装为逻辑路径
# 规范
- git信息的规范
- 用额外的文件后缀类型来表示不同文件：.module.scss、.test.tsx

# 测试
- 其实只是用另一种测试专用的语法来对前端进行一些预计的操作，最后测试库会对比前端的反应和我预计的是不是一样


