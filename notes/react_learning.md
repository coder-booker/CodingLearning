# Basic
- 原来在jsx中直接用数组就能正确渲染所有里面的item
- react本质上就是把JSX的封装DOM为对象语法的操作给封装成了更类似html标签的语法，所以没有子标签的标签本质上就是在声明一个对象返回出去
### Diff与虚拟DOM
- 虚拟DOM
    - 就是一个真实DOM的复制品，充当着中间件的作用减少不必要的重新渲染和排列
    - 虚拟节点
        - 树状结构，所以有各自的parent和children数组（用数组是因为html结构就是有顺序的）
        - 会储存真实节点的类型、className、key等元素
        - 关键的属性就是key和index。key是节点的唯一标识符，index是节点在其父节点的order，用来识别空key的节点
- Diff算法
    - 就是递归比较新旧虚拟DOM，以尽量识别最小DOM改变的算法。
    - 层级比较：
        - 
    - 最后生成出一个操作数组，数组元素标识着对真实DOM的操作和其需要的信息


### project structure
- /src:
    - /components
        - /core
            - 最小的components单位
        - /shared: 
            - 会被整个app使用的components
            - 命名规范：
                - 物件名字
            - 命名规范：
                - UI: 物件名字 + domain
                - Entity: Entity_name + 物件名字
                - utilities: no restriction 
            - /layouts: 定义pages的layouts
        - /features: 
            - 更大一点的section
    - /pages: overall layout and routers
    - /routes
    - /models: 定义数据结构
    - /styles/theme: 
        - /foundations: colors, size, etc
        - /components: components style
    - /assets: 放字体文件的
- other points: 
    - unique components: 如果某个子component have unique sub-component, create a folder named components inside the component's folder
    - messy style declaraion: separate it into a components_name.elements.js file. But do this only when it gets really messy or at the end of development
    - inversion of control
### 事件与处理函数
- DOM中有很多事件，键盘事件，鼠标事件等等。
- vue和react中的生命周期，本质上是事件的合集，一般包括四部分：包括初始，挂载，渲染，卸载。
- 事件处理函数
    1. 钩子函数(事件开始时的函数-监听函数)
        - 钩子概念源于Windows的消息处理机制，实现的效果就是能够拦截消息事件并执行一些逻辑，也就是执行钩子函数
        - vue和react中的生命周期中的钩子函数，本质上是监听了各自事件的开始
        - 钩子函数本质上就是触发时机比较特殊的回调函数：回调函数是之后触发，钩子是之前触发
    2. 回调函数(事件结束时的函数-回报函数)
        - 调用者将回调函数的指针传递给了调用函数，当调用函数执行完毕后，通过函数指针来调用回调函数。
        - 所有的回调，PHP,node,vue,react的回调函数，本质上都是，事件最后，所运行的函数。
    3. 两者的区别
        - 钩子函数在捕获消息的第一时间就执行，而回调函数是捕获结束时，最后一个被执行的。

### philosophy
- 一个组件做一件事
- 组件渲染顺序布可预测，所以组件应该以纯函数的形式设计
### 重新渲染
- 大部分钩子只会对生命周期(如挂载和卸载)有反应，重新渲染不会改变这些钩子的设置和值
- 但反过来说，钩子值的改变也会触发重新渲染
### JSX
- Fragment: empty tags
- 标签属性多为驼峰命名
- 组件渲染顺序难以预测，尽量不要让多个组件共享同一个变量（有点类似多线/进程）常量则无所谓
- display: none和return null有区别
- mutation
    - 内部组件修改了外部变量
- 一些有别于html的tag和attributes
    - label：htmlFor替代了for
    - JSX中，所有标准html标签都可以写为自闭合格式
### key
- component must have a unique key among its sibling for react to identify and midify it.

# 内置函数/功能
- React.memo
    - 用来缓存组件的，注意和useMemo不一样
    - 在触发了重新渲染的场景（比如父组件重新渲染），浅对比props来决定要不要重新渲染这个组件

# Hook 钩子
- useState
    - `setState(n => n+1)`：setState传入函数时，其参数是直接在state更新队列中获取的值，所以获取的一定是最新的值
    - 懒初始化：直接给useState默认值传入一个函数体会自动被调用一次，然后以返回值来当默认值
    - state不变原则，setState是直接创建和替换新的引用
    - 自带浅对比优化
    - setState做的只是把更新加入一个state更新队列，React会等到对应的事件处理函数中的所有代码都运行完毕再处理这个队列
    - 所以react本身会把所有setState合并为一次更新，不太会频繁操作DOM
- useEffect(callBack, [dep1, dep2, ...])
    - 所有useEffect都会在组件第一次挂载时运行一次
    - 小心可能的闭包陷阱（设置好依赖数组就行）
    - 资源清理函数：
        - 在组件卸载前运行
        - 在同一个useEffect第二次触发前运行
    - useEffect和组件的三个生命周期有关
        - DidMount 已挂载：挂载后才运行
        - DidUpdate 已更新：依赖数组更新后运行
        - WillUnmount 将卸载：组件卸载前调用资源回收函数
- useRef
    - 让某个变量的变化在全局都能在不更新自身的情况下被获取
- useParams()
    - 获取以`/path/:param-name`形式访问的路径的`param-name`参数
    - `const { 'param-name': xxx } = useParams();`来指定要哪个参数
    - 其实和query string差不多
- useContext
    - 首先create一个context，然后用.provider关键字生成一个发送器
    - 向这个context provider传入的value可以被发送器的所有子元素捕获
    - e.g.
        ```ts
        const ThemeContext = createContext<{ theme: string, toggleTheme: () => void }>({
            theme: "light",
            toggleTheme: () => {},
        });
        const ThemeContextProvider = ({
            children,
        }: Readonly<{
            children: React.ReactNode;
        }>) => {
            const [theme, setTheme] = useState<string>(getFromLocalStorage);
            const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
            return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
        };
        // example use
        const ThemeContextConsumer = ({ 
            children 
        }: Readonly<{
            children: React.ReactNode;
        }>) => {
            const { theme } = useContext(ThemeContext);
            const [mounted, setMounted] = useState(false);
            useEffect(() => setMounted(true), []);
            return (
                mounted &&
                <div className={theme}>
                    {children}
                </div>
            );
        };
        ```
- useDeferredValue
    - 先显示旧内容，后台进行新内容的更新，更新完再显示新内容
    - 很神奇，明明只是用钩子返回的值，却能够让组件知道自己要延迟渲染
- useReducer
    - 类似局部的redux reducer，详情可以看文档
- useMemo
    - 一个目标函数，一个依赖数组
    - 当依赖数组的值发生改变就会重新计算目标函数的返回值
- useCallback
    - 缓存函数用的
    - 一个目标函数，一个依赖数组
    - 使用场景：
        - useEffect的依赖数组如果有函数，用useCallback的返回值来替代原本的函数能避免useEffect的错误触发（当然也可以直接用useEffect内的护卫语句来达到类似的效果）
        - 子组件使用了React.memo之类的优化方式时，useCallback可以缓存传入子组件的函数。
- React.lazy
    - 接收一个thenable的函数，这个函数需要最终返回一个可以被解析为React组件类型的值，例如函数、memo或forwardRef 组件。lazy会抛出包裹这个值的Promise给Suspense捕获
    - import()
        - import()是个动态导入语法（Dynamic Import），返回`Promise<React组件>`，但解析后会成为组件
        - lazy依赖于import()
        - 用途：
            - 代码分割（Code Splitting）：将应用的代码拆分成多个小块，按需加载，减少初始加载时间。
            - 懒加载组件
            - 条件加载模块：根据某些条件（如用户权限、设备类型）动态加载模块。
            - 加载非模块代码，例如.json：`import("./data.json", { with: { type: "json" } });`
    - eg
    ```tsx
        // lazy在外面以避免被重新加载
        const Component = lazy(()=>import("./Component.tsx"));
        function bruh() {
            return (
                <Suspense fallback={<div>Loading...<div/>}>
                    <Component />
                <Suspense />
            )
        }
    ```
- Suspense
    - 通过捕获children抛出的Promsie对象来判断要不要用fallback
    - thrown一个Promise并不会导致报错，只是简单地运行这个Promise并让Suspense捕获而已
    - 复习下scrollTop
        - 子元素的offsetTop和非static position的父容器的scrollTop对比下就能实现懒加载
        - offsetWidth包含padding不包含滚动条。scroll也只到padding不需要考虑滚动条
## 自定义钩子
- 复用逻辑，复杂状态管理，复杂的副作用逻辑
## 好用的react第三方钩子
- useEventCallback
    - 注意，useCallback的最大作用就是让函数作为props传递时不会重新渲染，因为每次传的都是同一个函数指针
    - 用ref来记录输入的回调函数实现返回值地址固定，但仍然能调用最新的回调函数的返回值
    - 原本的useCallback为了动态定义函数且在生命周期中持续保存，会把依赖闭包保存在内部（注意箭头函数虽然会捕获，但一次定义只会捕获一次，如果有上下文改变但箭头函数没有被重新定义一次的情况，就会出现闭包陷阱），通过判断依赖来决定要不要更新。
    - 而useEventCallback则把更新箭头函数定义的工作和跨生命周期保存的工作用useLayoutEffect和ref解决了，使需要更新函数定义的场景能够被正确检测到以刷新回调函数的上下文。
    - 不能在render中调用useEvent的返回值
        1. 实际上并不是用useLayoutEffect更新的，但是是刚好在其之前更新的。而因为子组件的 useLayoutEffect比父组件的执行更早，如果这样用的话，子组件的 useLayoutEffect中访问到的 ref一定是旧的。
        2. 调用useEvent的返回值时layoutEffect还没触发，所以渲染中调用的useEvent返回值一定是旧的还没更新的



# 一些内置的功能
### 懒加载 
- .lazy：懒加载组件，可以和suspense一起使用
- e.g.
    ```js
    // App.js
    import React, { Suspense, lazy } from 'react';

    const MyComponent = lazy(() => import('./MyComponent'));
    const App = () => {
        return (
            <div>
                <h1>Welcome to my app</h1>
                {/* 使用 Suspense 包裹懒加载组件，并指定加载中的占位内容 */}
                <Suspense fallback={<div>Loading...</div>}>
                    <MyComponent />
                </Suspense>
            </div>
        );
    };

    export default App;
    ```
### React Router
- index属性、`<Outlet />`组件
- `:param`的捕获
- `import { BrowserRouter, Routes, Route } from "react-route-dom"; `
- BrowserRouter和Routes分开是因为有多种和BrowserRouter同层级的组件可以使用
- path定义使用`/:xxxx`，可以把xxx这个位置的值定义为参数，任何同级路由匹配不到的值都会被这个参数捕获。`useParams()`钩子可以捕获这个参数
- `<outlet />`组件可以把子级路由缩放到outlet的位置而不是更新整个页面
### 错误边界
- 只能在类组件使用
- 捕获子组件树绝大部分错误，并显示降级的UI
- 以下四种错误无法被捕获
    - 事件处理函数（因为 Error Boundaries 实现的本质是触发更新，但是事件处理函数不在render或者commit阶段，所以无法进行捕获，如果你需要在事件处理器内部捕获错误，可以使用原生的 try / catch 语句 ）
    - 异步代码（例如 setTimeout 或 requestAnimationFrame 回调函数）
    - 服务端渲染（因为触发更新只能在客户端进行，不能在serve端进行）
    - 它自身抛出来的错误（因为错误抛出要向父节点冒泡寻找 Error Boundaries 处理，无法处理自身产生的错误）

# event
### General
- onScroll之外的所有事件都会被传播到父级组件
- ```(e) => {e.stopPropagation();}```
- ```e.preventDefault();```
### 触摸事件
- onTouchStart
    - ≈ onMouseDown
- onTouchMove
    - ≈ onMouseMove
- onTouchEnd
    - ≈ onMouseUp
- onTouchCancel
    - ≈ onMouseOut
- event.touches
- event.targetTouches


# syntax
- `{}`是代码，`()`是jsx元素

# React 的批处理机制
- 自动批量更新：在 React 事件处理函数或生命周期中，多次 setState 会被合并为一次更新。

# to-do
- 错误边界
- RoutingContext
- 嵌套钩子会使外部重新渲染吗

# 源码
### 基础概念
- react的SDK本质上就是一个控制台，底层是Fiber，最后作用出来的效果就是UI
- Algebraic Effects 代数式效应：
    - 将effect从函数逻辑中分离，使effect能想一个代数/参数一样被随意使用
    - 其实就是把一个复杂的“过程”操作封装成可复用形式
    - 经典的例子就是Hooks
### React Components
- HostRoot：表示根节点。
- HostComponent、HostText：处理原生 DOM 元素和文本节点。
- FunctionComponent、ClassComponent：处理函数组件和类组件。
    - 注意，这俩Component的返回值就是HostComponent，只是会多了各种钩子、状态等额外信息而言。
    - 所以这俩components本质上就是Host的封装
- Fragment、Mode、ContextProvider、ContextConsumer：处理片段、严格模式和上下文。
- ForwardRef、Suspense、MemoComponent、LazyComponent：处理 ref 转发、异步加载和性能优化。
### React核心架构
- 概念
    - React 16前的虚拟DOM更新采用的是Stack架构，也就是循环递归组件树。但组件树过大的话，单次更新递归过深就会导致线程阻塞、交互卡顿。因此出现了Fiber架构。
    - 由于GUI渲染和JS操作对线程的占用是互斥的，所以react会在浏览器每一帧的时间中，仅预留一部分时间给 JS 线程，React利用这部分时间更新组件。在源码中，预留给JS的初始时间是 **5ms**。
    - 当预留的时间不够用时，React将线程控制权交还给浏览器使其有时间渲染 UI，React则等待下一帧时间到来继续被中断的工作。
- 核心架构分为三层：
    - Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler（React16才加入的）
        - 需要一种机制让浏览器有剩余时间时通知react，一些浏览器实现了`requestIdleCallback`API，但react因其不稳定而放弃此API
        - 而Scheduler就是React实现了的功能更完备的requestIdleCallback的polyfill
    - Reconciler（协调器）—— 负责找出变化的组件
        - 把循环+递归解耦出来，变成类似js链式调用思路的单纯的循环，如此每一个循环间都可以打断
        - 核心就是用链表来封装虚拟DOM，然后用Fiber管理这些链表。所以Fiber就是新版虚拟DOM
        - **双缓存技术**：
            - 不先清除现有内容再更新，而是内存更新完后再清除替换
            - 现有内容 - current树：当前页面的虚拟DOM/Fiber树
            - 新内容 - WIP树：workInProgress树，是将要用作更新的Fiber树。WIP-Tree在后台更新，且能打断，以此让react 16拥有了更强的性能
        - Fiber树与真实DOM之间有一次下行、一次上行的差距
            - 下行是构建WIP树的时候，增量构建了stateNode、props、effectTag和sibling、return啥的，从上到下走
            - 构建每一个fiber节点后work都可以被中断，因为上下文是储存在链表中的，等下一个循环恢复上下文就可以继续运行
            - 下行遇到叶子节点就会开始上行：用sibling、return啥的从下往上走并根据effectTag构建任务链表
            - 【todo】上行时，同级之间可以打断，父子的切换不行，反正只剩指针操作了也很快
        - 增量构建：
            - 生成了WIPRoot后就开始用WIP Fiber储存的子元素的信息，和current协调并继续生成下一个/层WIP Fiber
        - 一些关键的工具函数或结构：
            - `useFiber`函数复用current的子节点但用新的props生成WIP Fiber，同时接好alternate
            - `createFiberFromElement`函数从JSXElement/ReactElement构建Fiber
            - `effectList`任务链表：用beginWork标记的effectTag生成的任务链表，用于最后对真实DOM的操作
            - `workInProgress.pendingPorps.children`JSX.Element的子组件数组
            - `flags`、`subtreeFlags`标记当前和子树有无副作用，以此决定要往下递归还是直接复用
    - Renderer（渲染器）—— 负责将变化的组件渲染到页面上
        - 执行Reconsiler标记好的变化。
        - 负责和真实DOM交互
- JSX
    - DOM节点本身不带有什么额外信息，props啥的都是JSX或者React Fiber处理的
    - JSX在编译时会被Babel编译为React.createElement方法，并返回一个`React.Element`。
    - JSX是一种描述当前组件内容的数据结构，但他不包含组件schedule、reconcile、render所需的相关信息。
        - 比如如下信息就不包括在JSX中：
            - 组件在更新中的优先级
            - 组件的state
            - 组件被打上的用于Renderer的标记
        - 这些内容都包含在Fiber节点中。
        - 所以，在组件mount时（初次运行，current为空），Reconciler根据JSX描述的组件内容生成组件对应的Fiber节点。
        - 在update时（current不为空，需要协调），Reconciler将JSX与Fiber节点保存的数据对比，生成组件对应的Fiber节点，并根据对比结果为Fiber节点打上标记。
### Fiber
- Fiber并不是计算机术语中的新名词，他的中文翻译叫做纤程，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。
- 在很多文章中将纤程理解为协程的一种实现。在JS中，协程的实现便是Generator。
- 所以，我们可以将纤程(Fiber)、协程(Generator)理解为代数效应思想在JS中的体现。
- React Fiber可以理解为：
    - React内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。
    - 其中每个任务更新单元为React Element对应的Fiber节点。
- Fiber节点结构简化版：
    ```ts
    // 简易版 Fiber 对象
    function FiberNode(
        this: $FlowFixMe,
        tag: WorkTag,
        pendingProps: mixed,
        key: null | string,
        mode: TypeOfMode,
    ) {
        // 作为静态数据结构的属性
        this.tag = tag; // Fiber对应组件的类型 Function/Class/Host...
        this.key = key; // React key
        this.elementType = null; // 描述React元素的类型。例如，对于JSX<App />，elementType是App。和type大多情况下是一样的
        this.type = null; // 组件类型；对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
        this.stateNode = null; // 对于类组件，这是类的实例；对于DOM元素，它是对应的DOM节点。
        
        // 用于连接其他Fiber节点形成Fiber树
        this.return = null; // 指向父Fiber
        this.child = null; // 指向第一个子Fiber
        this.sibling = null; // 指向其兄弟Fiber
        this.index = 0; // 子Fiber中的索引位置
        
        this.ref = null; // 如果组件上有ref属性，则该属性指向它
        this.refCleanup = null; // 如果组件上的ref属性在更新中被删除或更改，此字段会用于追踪需要清理的旧ref
        
        // 作为动态的工作单元的属性
        // Props & State
        this.pendingProps = pendingProps; // 正在等待处理的新props，也就是react组件更新传入的props
        this.memoizedProps = null; // 上一次渲染时的props
        this.updateQueue = null; // 一个队列，包含了该Fiber上的状态更新和副作用
        this.memoizedState = null; // 上一次渲染时的state
        this.dependencies = null; // 该Fiber订阅的上下文或其他资源的描述
        // 工作模式
        this.mode = mode; // 描述Fiber工作模式的标志（例如Concurrent模式、Blocking模式等）。
        // Effects
        this.flags = NoFlags; // 描述该Fiber发生的副作用的标志（十六进制的标识）
        this.subtreeFlags = NoFlags; // 描述该Fiber子树中发生的副作用的标志（十六进制的标识）
        this.deletions = null; // 在commit阶段要删除的子Fiber数组
        
        // 调度优先级相关
        this.lanes = NoLanes; // 与React的并发模式有关的调度概念。
        this.childLanes = NoLanes; // 与React的并发模式有关的调度概念。
        
        // 指向该fiber在另一次更新时对应的fiber
        this.alternate = null; // Current Tree和Work-in-progress (WIP) Tree的互相指向对方tree里的对应单元
        
        // 如果启用了性能分析
        if (enableProfilerTimer) {
            // ……
        }
        
        // 开发模式中
        if (__DEV__) {
            // ……
        }
    }
    ```
- 核心工作流程
    - 构建WIP-Tree：WIP树包含了当前更新受影响的最高节点直至其所有子孙节点。Current Tree是当前显示在页面上的视图，WIP-Tree则是在后台进行更新，WIP-Tree更新完成后会复制其它节点，并最终替换掉Current Tree，成为新的Current Tree。
    - renderRoot阶段
        - 生成一个根WIP Fiber，把开发者写的JSX变为WIPRoot的`pendingProps.children`传入beginWork开始增量构建
    - render/reconciliation 阶段：
        - 主要功能：
            - 根据组件返回的JSX在内存中依次协调构建 workInProgress Fiber树（包括Diff，设置effectTag等）
            - 创建最小化的任务链表
        - 大致流程
            - `workLoop`开始：对每个fiber进行commit前的处理，同时判断是否需要中断（`!shouldYield()`）
                - `performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`：前者没有`!shouldYield()`
            - `beginWork`增量构建WIP树
            - `completeWork`收集副作用和构建effectList
            - 结束render阶段
        - 此阶段的任务一般都可以被中断
            - 可中断的能力是React并发模式（Concurrent Mode）的核心
        - 大致代码
            ```ts
            // performConcurrentWorkOnRoot

            // packages/react-reconciler/src/ReactFiberScheduler.js
            function workLoop() {
                while (workInProgress !== null && !shouldYield()) {
                    workInProgress = performUnitOfWork(workInProgress);
                }
            }
            // packages/react-reconciler/src/ReactFiberScheduler.js
            function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
                let next;
                next = beginWork(current, unitOfWork, renderExpirationTime);
                if (next === null) {
                    next = completeUnitOfWork(unitOfWork);
                }
                return next;
            }
            ```
        - `beginWork`函数：
            - 定义：
                ```ts
                function beginWork(
                    current: Fiber | null, // 当前组件对应的Fiber节点在上一次更新时的Fiber节点，即workInProgress.alternate
                    workInProgress: Fiber, // 当前组件对应的Fiber节点
                    renderLanes: Lanes     // 优先级相关
                ): Fiber | null
                ```
            - “从上往下遍历直到到一个叶节点”这个过程中的一次步进
            - 大致流程：
                - 判断是mount还是update（current是否null）
                - 判断要不要更新（props、type、key）
                - 【todo】判断优先级
                - 根据tag进行不同的 协调并构建子Fiber 的逻辑
                - reconcileChildren，Diff，标记effectTag
                - 返回子节点供下次performUnitOfWork
            - mount
                - 如果是首次渲染，对每个DOM都打上effectTag效率十分低，因此react只会给从上往下第一个需要mount的Fiber打上Placement effectTag，然后在completeUnitOfWork里把所有子fiber的在`completeWork`时mount的真实DOM节点都一步一步合并返回到这个Fiber的`children`属性中。
            - update
                - 尝试复用
            - 所以其实每一个beginWork的工作就是生成子WIP Fiber
            - 【todo】判断要不要更新的核心逻辑：怎么对比的pendingProps和memorizedProps？
        - `completeUnitOfWork`函数：
            - 从叶子节点往上遍历直到到一个有sibling的节点
            - `performUnitOfWork`里只有到了叶子节点，也就是`beginWork`返回了空值才会调用`completeUnitOfWork`
            - 这里主要记录HostComponent的行为，实际上会根据tag有各种不同的行为
            - 每到一个fiber就：
                - 判断是mount还是update（current和stateNode是否null）
                - 生成节点对应的stateNode（创建or更新
                - 生成当前Fiber的effectList链表
                - 合并到父Fiber的effectList
                - 用return属性while loop往上bubble
                - 返回遇到的第一个有sibling的fiber的下一个sibling
            - update
                - 主要行为：
                    - 准备新的更新props
                    - 更新updateQueue
                    - markUpdate
                - `stateNode`
                    - stateNode是fiber对应的真实DOM的封装
                    - stateNode的props有：
                        - onClick、onChange等回调函数的注册
                        - 处理style prop
                        - 处理DANGEROUSLY_SET_INNER_HTML prop
                        - 处理children prop
                - `updateQueue`
                    - 在update时，新的stateNode的更新用数据，例如props，是被封装在updateQueue中的
                    - 【todo，为什么要用updateQueue？】stateNode更新的内容会被赋值到updateQueue中，以在commit阶段被渲染
                    - 【todo，updateQueue不是tuple吗为什么还会有动态索引？】`updatePayload`：被赋值到updateQueue的处理完的stateNode，是数组形式，他的偶数索引的值为变化的prop key，奇数索引的值为变化的prop value。
                - `updateComponent`：
                    - 用来update stateNode的函数，`updateQueue`也是在其中被赋值的
            - mount
                - 只要没有current和stateNode就会进入这个阶段
                - 主要行为：
                    - 为Fiber节点生成对应的DOM节点
                    - 将子孙DOM节点插入刚生成的DOM节点中
                        - 因为completeWork是从下往上的，子孙DOM一定是已经生成好的
                        - 因为当前fiber要mount，代表其所有子fiber都要mount（Diff的第二假设），所以无需额外判断直接插入当前节点即可
                    - 与update逻辑中的updateHostComponent类似的处理props的过程
                - `createInstance`：生成真实DOM节点的重要函数，用来mount时生成正确的真实DOM节点
                - `appendAllChildren`：将子孙DOM节点插入当前Fiber的`children`中
            - Fiber维护了`firstEffect`、`nextEffect`、`lastEffect`这三个指针以方便子节点的effectList接上父节点的effectList
            - 有意思的点：DELETION的effectTag，由于遍历是在WIP上进行的，实际上没法在最后收集的时候被遍历到，所以DELETION的effect是在标识时就注册的
    - 【todo】lane是什么

    - commit 阶段：
        - commit的代码是完全同步的，因此不可中断
        - 主要作用是应用副作用和调用生命周期方法
        - 入口是`commitRoot`和`commitRootImpl`
        - `before mutation`之前 阶段
            - commitRootImpl方法中直到第一句`if (firstEffect !== null)` 之前属于before mutation之前。
            - 主要作用：
                - 【todo】一些useEffect、变量赋值，状态重置的工作。
        - `BeforeMutation`阶段
            - 操作DOM前
            - 主要作用：遍历effectList并调用`commitBeforeMutationEffects`函数处理。
            - `commitBeforeMutationEffects`
                - 主要作用
                    - 【todo。这是什么，为什么要在这里处理】处理DOM节点渲染/删除后的 autoFocus、blur 逻辑。
                    - 调用`getSnapshotBeforeUpdate`生命周期钩子。
                        - 从Reactv16开始，componentWillXXX钩子前增加了UNSAFE_前缀。因为Stack Reconciler重构为Fiber Reconciler后，render阶段的任务可能中断/重新开始，对应的组件在render阶段的生命周期钩子（即componentWillXXX）可能触发多次。
                        - 【todo，这个钩子有啥用，Snapshot是什么】为此，React提供了替代的生命周期钩子getSnapshotBeforeUpdate。由于commit阶段是同步的，所以不会遇到多次调用的问题。
                    - 异步注册useEffect。
                        - 标记有passiveEffect，并注册`scheduleCallback(<priority>, <callbackFunc>)`
                            - scheduleCallback由Scheduler模块提供，用于以proirity注册callbackFunc进调度器中。这个callback有`flushPassiveEffects();`在内，用于调用useEffect的callback
                                - 在`flushPassiveEffects`方法内部会从全局变量`rootWithPendingPassiveEffects`获取`effectList`。
                        - 总体分为三步：
                            - before mutation阶段注册scheduleCallback（flushPassiveEffects）
                            - layout阶段之后将effectList赋值给rootWithPendingPassiveEffects
                            - scheduleCallback触发flushPassiveEffects，flushPassiveEffects内部遍历rootWithPendingPassiveEffects
                        - 为什么要异步调度
                            - 因为副作用的本质就是一些背景的、非主要任务的任务，不应该阻塞浏览器渲染。如设置订阅和时间监听之类的不需要渲染。

        - `Mutation`阶段
            - 操作中
            - 正式提交
        - `Layout`阶段
            - 操作后
            - 处理layout effects
        - `layout`之后 阶段：
            - 【todo】主要作用：
                - useEffect相关的处理。
                - 性能追踪相关：源码里有很多和interaction相关的变量。他们都和追踪React渲染时间、性能相关，在Profiler API 和DevTools中使用。
                - 在commit阶段会触发一些生命周期钩子（如 componentDidXXX）和hook（如useLayoutEffect、useEffect），这些回调方法中可能触发新的更新，新的更新会开启新的`render-commit`流程
        - 【todo】useLayoutEffect
        - commitRoot函数：遍历任务链表，执行 DOM 操作和生命周期方法。
        - commitMutationEffects函数：处理具体的 DOM 操作（插入、更新、删除）。

- Diff算法
    - 【todo】diff进行前似乎就已经为可复用的新旧子节点建立好alternate关联了？
        - 应该是增量构建子节点时就会生成好alternate，但构建新子节点时自然不会有alternate
    - 【todo】似乎diff开始前就已经构建好一个新的fiber树了，然后才开始diff。但为什么diff又是在performUnitOfWork中进行的呢？
        - 增量构建
    - 【todo】Fiber树本身是哪来的？为什么看起来WIP树是已经生成好了再跟current树对比的？
        - 增量构建
    - react里的reconcile协调函数就是Diff的核心实现，主要作用就是协调current和WIP的子节点做 Diffing，并生成下一次workLoop的WIP
    - Diff算法用一系列假设来权衡递归和复用的成本：
        - 假设一：不同类型的节点元素会有不同的形态
            - 当节点为不同类型的元素时，React 会拆卸原有节点并且建立起新的节点。
            - 该算法不会尝试匹配不同组件类型的子树。如果你发现你在两种不同类型的组件中切换，但输出非常相似的内容，建议把它们改成同一类型。
        - 假设二：节点不会进行跨父节点移动
            - 只会对比两个关联父节点的子节点，多了就加少了就减。没有提供任何方式追踪他们是否被移动到别的地方。
        - 假设三：用户会给每个子节点提供一个 key，标记它们“是同一个”
            - 方便复用。比如两个兄弟节点调换了位置，有 key 的情况下能保证二者都复用仅做移动，但无 key 就会造成两个不必要的卸载重建。
        - 所以两个fiber是否相同，由其type和key共同决定
    - 大致流程是嵌合在performUnitOfWrok中的：
        - beginWork函数
            - `reconcileChildren`函数：协调的核心函数
                - WIP同层fiber单一的情况：
                    - 这一个element遍历对比current这一层的所有element
                    - 如果key和type都相同就useFiber复用并更新props，删掉剩余的current兄弟
                        - `useFiber`用复用的current和可能是新的props创建一个workInProgress Fiber，然后alternate关联两者，然后返回。
                    - 如果type不同就删掉current的并挂一个新的在workInProgress下，删掉剩余的current兄弟
                    - 如果key和type都不同，创建新的挂在workInProgress下
                - 多element的情况：
                    - 对新旧对比预估了两种情况，并分别有不同的逻辑
                    - 情况一：新旧节点仅仅只改变了type或者兄弟的数量，且没有改变顺序
                        - 这样只会有尾部新增/删除节点 和 type改变 需要处理
                        - 具体处理逻辑：
                            - 同时步进children、current的sibling、workInProgress的sibling，然后逐一对比
                            - 然后根据指针的index是否为null来决定创建新的还是删除旧的
                    - 情况二：非情况一就是情况二
                        - 也就是有中间的节点增/删/换位置了
                        - 具体处理逻辑：
                            - 构建一个map，用来找可复用（key和type都相同）的节点先
                            - 然后对于位置不对的节点有以下两种情况
                                - 新节点相比旧的偏左了，这个时候不动
                                - 新节点相比旧的偏右了，创建"PLACEMENT" effectTag给workInProgress
                                - 因为增删或者插入都会修改顺序，所以只让偏右的插入是正确的行为
- 调度
    - 工作单元 work
        - 就是从构建fiber节点到实际commit到真实DOM前的一切操作
        - 可以理解为一次beginWork或者一次completeUnitOfWork
    - 时间切片
    - 调度更新：
        - react标记要更新的fiber节点，根据优先级插入任务调度队列中
    - 优先级等级
        ```ts
        const PriorityLevels = {
            Immediate: 1,       // 用户输入、动画
            UserBlocking: 2,    // 用户交互结果（如点击）
            Normal: 3,          // 数据更新
            Low: 4,             // 后台任务
            Idle: 5,            // 空闲任务
        };
        ```
- Host Component
    - 宿主组件，其实就是UI层和react对接的中间层，负责具体渲染
    - 【todo】在这类 fiber 节点上，有一个 stateNode 属性，关联具体的宿主实例，比如 react-dom 下的原生 DOM 对象，它们是通过 ReactFiberHostConfig 连接到宿主环境的诸如 document.createElement 这样的 API 返回的。如果需要的话，react 会在节点 effect 收集前完成对 stateNode 的创建、更新，以及对应 effect 的标记。
- Hooks
    - 在Fiber节点创建时就会存有一系列给Hooks使用的属性
    - Hook节点，memoizedState属性，Hook队列
    - updateQueue属性储存着副作用

- `requestIdleCallback(<callback>)`
    - `<callback>`callback使接收一个`deadline`，表示其能够运行到什么时候/还剩多少运行实际，deadline过后就让出主线程
