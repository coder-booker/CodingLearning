# Basic
- 原来在jsx中直接用数组就能正确渲染所有里面的item
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

### experience
- state + useEffect空依赖可以实现监控组件挂载并在之后进行某些操作

### key
- component must have a unique key among its sibling for react to identify and midify it.

### props
- 类似state，浅对比有没有更新并重新渲染组件


# Hook 钩子
### useState
- state不变原则，setState是直接创建和替换新的引用
- setState会触发重新渲染，但包含setState的函数运行完了才会真正更新state和重新渲染，在此之前对state的更新会被保存在某队列中。
- 嵌套组件因为是递归的，在所有组件都渲染完了(队列全都排好了)才会更新替换state
- 更新函数: setState(n => n+1)
    - 更新函数的n是直接在state更新队列中获取的值，而非当前state的值
    - n不一定要叫n，惯例是按照state变量名的单词首字母来命名
- 懒初始化：直接给useState默认值传入一个函数体会自动被调用一次，然后以返回值来当当默认值
### useEffect
- 检测state和prop变化（引用变化）
- 一般使用事件处理程序来执行操作。useEffect是最后手段
- 闭包陷阱：如果useEffect没有重新更新，useEffect外部的任何值改变都不会被useEffect内察觉到，因为useEffect只会获取更新时的值。（没有依赖数组的话就是初值）
- useEffect内可以return一个函数，这个函数是回收/卸载函数，可以在useEffect结束时清理资源
- useEffect和组件的三个生命周期有关
    - DidMount 已挂载：挂载后才运行
    - DidUpdate 已更新：依赖数组更新后运行
    - WillUnmount 将卸载：组件卸载前调用资源回收函数
### useRef
- 让某个变量的变化在全局都能在不更新自身的情况下被获取
### useMemo
- 缓存某个函数的值
- 参数是一个函数
- 生命周期：
### useParams()
- 获取以`/path/:param-name`形式访问的路径的`param-name`参数
- `const { 'param-name': xxx } = useParams();`来指定要哪个参数
- 其实和query string差不多
### useContext
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
### useDeferredValue
- 先显示旧内容，后台进行新内容的更新，更新完再显示新内容
- 很神奇，明明只是用钩子返回的值，却能够让组件知道自己要延迟渲染
### useReducer
- 类似局部的redux reducer，详情可以看文档
### useMemo、useCallback、React.lazy、Suspense
- useMemo 和 useCallback, React.lazy 和 Suspense 的动态路由加载
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



# to-do
- 错误边界
- RoutingContext
- 嵌套钩子会使外部重新渲染吗

1. Diff 算法
    - 用来比较新旧虚拟 DOM 树，找出需要更新的部分的算法。它的目标是尽可能高效地更新真实 DOM，避免不必要的操作。
    - 核心思想
        - 相同类型的组件生成相似的树结构：
        - 如果两个组件的类型相同（例如都是 div），React 会假设它们的子树结构也相似。
        - 通过 key 属性标识元素的稳定性：
            - 开发者可以通过 key 属性来标识列表中的元素，帮助 React 识别哪些元素是新增的、删除的或移动的。
            - 基于这些假设，React 的 Diff 算法采用了一种 层级比较 的策略，而不是传统的深度优先遍历。
        - 具体步骤
            1. 比较根节点
                - 如果根节点的类型不同，React 会直接销毁旧树，创建新树。
                - 如果根节点的类型相同，React 会递归比较它们的属性和子节点。
            2. 比较属性
                - React 会比较新旧节点的属性（例如 className、style 等），并更新变化的属性。
            3. 比较子节点
                - 对于子节点的比较，React 使用了一种 双指针算法：
                - 从左到右遍历：
                    React 会同时遍历新旧子节点列表，比较相同位置的节点。
                    如果节点类型相同，React 会递归比较它们的子树。
                    如果节点类型不同，React 会停止遍历。（然后呢？
                - 处理新增和删除的节点：
                    如果新子节点列表比旧子节点列表长，React 会创建新增的节点。
                    如果新子节点列表比旧子节点列表短，React 会删除多余的节点。
                - 处理移动的节点：
                    如果节点的位置发生变化（例如通过 key 标识），React 会移动节点到正确的位置。
            4. Diff 算法的优化
                - Key 的作用：
                    - 在列表渲染中，key 属性可以帮助 React 识别哪些元素是新增的、删除的或移动的。
                    - 如果没有 key，React 会默认使用索引（index）作为标识，这可能导致性能问题。
                - 减少 DOM 操作：
                    - Diff 算法会尽量减少对真实 DOM 的操作，例如合并多个属性更新。

- Fiber 架构的源码级别工作流程
    - React 16前的虚拟DOM更新采用的是Stack架构，也就是循环递归组件树。但组件树过大的话，单次更新递归过深就会导致线程阻塞、交互卡顿。因此出现了Fiber架构
    - 核心概念: 
        - 把循环+递归解耦出来，变成类似js链式调用思路的单纯的循环，如此每一个循环间都可以
        - 核心就是用链表来封装虚拟DOM。把一次更新切分成多个子任务，完成一个任务之后可以暂停对比优先级决定要不要继续，用callback来返回这里继续运行
            - 一个比较有意思的说法：浏览器是一帧一帧渲染的，如果任务完成后一帧还没过完，空闲时间就可以用来运行其他任务。
            - 具体来说就是空闲时调用`requestIdleCallback`注册callback，然后就可以让出主线程了
    - `requestIdleCallback(<callback>)`
        - `<callback>`callback使接收一个`deadline`，表示其能够运行到什么时候/还剩多少运行实际，deadline过后就让出主线程
    
    - Fiber节点结构简化版：
        ```ts
        // 简易版 Fiber 对象
        type Fiber = {
            // 组件类型 div、span、组件构造函数
            type: any,
            // 真实 DOM 对象
            stateNode: any,  
            // 指向自己的父级 Fiber 对象
            return: Fiber | null,
            // 指向自己的第一个子级 Fiber 对象
            child: Fiber | null,
            // 指向自己的下一个兄弟 iber 对象
            sibling: Fiber | null,
            // 给任务链表用的标记
            effectTag: "PLACEMENT",
        }
        ```
    - 源码核心概念
        - Fiber其实就是新式虚拟DOM
        - Fiber链表与真实DOM之间有两次遍历的差距
            - render
                - 第一次是初次构建fiber链表的时候，处理了stateNode、props、effectTag和sibling、return啥的，从上到下走
                - 构建每一个fiber节点后work都可以被中断，因为上下文是储存在链表中的，等下一个循环恢复上下文就可以继续运行
                - 第一次遍历完之后，指针到了链表末尾，于是开始第二次遍历：用sibling、return啥的从下往上遍历并根据effectTag构建任务链表
                - 从下往上就可以实现从最底下的组件开始操作真实DOM，相当于把递归扁平化成了链表，表头是最最底下最最后的fiber，尾巴就回到root。
                - 第二次遍历时，同级之间可以打断，父子的切换不行，反正只剩指针操作了也很快
    - 大致工作阶段
        - render/Reconciliation 阶段：构建 Fiber 对象，构建链表，设置effectTag，可中断。对一个fiber做这些所有操作被成为一个workUnit
            - beginWork函数：
                - 从上往下遍历
                - 对当前fiber的操作：
                    - 创建fiber的DOM，把属性塞进去，储存在stateNode中
                - 对子元素的操作：
                    - 把其所有子元素都初始化为Fiber
                        ```ts
                        let childFiber = {
                            type: child.type,
                            props: child.props,
                            effectTag: "PLACEMENT", // 首次渲染的默认effectTag
                            return: workInProgressFiber
                        }
                        ```
                    - 接上链表，等后续的循环处理
            - performUnitOfWork函数
                - 从下往上遍历
                - 对当前fiber的操作：
                    - 识别effectTag并储存到任务链表中
                - 对子/父元素的操作
                    - 构建一个和元素顺序相反的任务链表，以符合DOM递归到最深处（或者说离DOM操作最近的元素）才开始渲染的逻辑
        - commit 阶段：根据构建好的链表进行 DOM 操作，不可中断。
            - commitRoot函数：遍历任务链表，执行 DOM 操作和生命周期方法。
            - commitMutationEffects函数：处理具体的 DOM 操作（插入、更新、删除）。
    - 任务/副作用链表
        - 在render阶段构建好的，最小化的对真实DOM的操作的任务链表
        - 对 effectTag非空的fiber或者说需要操作DOM的fiber 的额外封装
            ```ts
            {
                firstEffect; // 其实就是多叉树的结构：这一层第一个子节点
                nextEffect;  // 这一层的子节点用链表连起来的兄弟节点
                lastEffect;  // 这一层最后一个子节点
            }
            ```
        - firstEffect、nextEffect、lastEffect其实就是任务版本的链表头、sibling、return
        - firstEffect在一整层和其return会指向同一个节点，也就是这一层的第一个节点
        - lastEffect在一整层和其return会指向同一个节点，也就是这一层的最后一个节点，或者说最新的那个节点
        - lastEffect的nextEffect会指向其return，以此来实现无需全局记录就可以循环处理fiber的功能
    - 任务与调度
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
    - Hooks
        - 在Fiber节点创建时就会存有一系列给Hooks使用的属性
        - Hook节点，memoizedState属性，Hook队列
        - updateQueue属性储存着副作用
    - 协调子节点
        - todo
    
    - 核心功能：
        任务拆分：
            将整个渲染任务拆分成多个小任务（例如处理一个组件、一个 DOM 节点）。
            每个小任务对应一个 Fiber 节点。
        任务调度：
            根据任务的优先级（例如用户交互、动画、数据更新）来决定任务的执行顺序。
            高优先级的任务会优先执行，低优先级的任务可以推迟执行。
            调度方法：
                - 优先级调度：根据任务的优先级来决定任务的执行顺序。
                - 时间切片：将任务拆分成多个小任务，在每一帧中只执行一部分任务。这样可以避免长时间占用主线程，保证页面的流畅性。
                - 任务队列：使用任务队列来管理待执行的任务。高优先级的任务会被插入到队列的前面，优先执行。
        增量渲染：
            在每一帧中只执行一部分任务，避免长时间占用主线程，保证页面的流畅性。
        可中断和恢复：
            任务可以被中断（例如用户交互触发更高优先级的任务），并在稍后恢复执行。
    - Fiber 是对虚拟 DOM 的扩展和优化。
        每个 Fiber 节点对应一个虚拟 DOM 节点，但 Fiber 节点包含了更多的信息（例如优先级、副作用等）。
        Fiber 树是一个链表结构，支持增量渲染和任务调度。



    - 一个 Fiber 节点包含以下关键属性：
        type：组件的类型（例如函数组件、类组件、DOM 元素类型）。
        key：用于标识节点的唯一性。
        stateNode：对应的真实 DOM 节点或组件实例。
        child：第一个子节点。
        sibling：下一个兄弟节点。
        return：父节点。
        alternate：指向旧 Fiber 节点的引用（用于 Diff 比较）。
        effectTag：标记节点的更新类型（例如插入、更新、删除）。
        expirationTime：任务的优先级和过期时间。
    - Fiber 树的结构
        - Fiber 树是一个链表树结构，每个节点通过 child、sibling 和 return 指针连接起来。
        - 这样在执行fiber，可以直接访问下一个fiber继续执行
    - Fiber 的工作流程分为两个阶段：
        - Render 阶段：生成新的 Fiber 树，标记需要更新的节点。
            Render 阶段是异步的，可以被中断和恢复。它的主要任务是：
                遍历 Fiber 树：
                    从根节点开始，深度优先遍历 Fiber 树。
                    对每个 Fiber 节点执行 beginWork 方法，生成新的子节点。
                标记副作用：
                    在遍历过程中，React 会标记需要更新的节点（例如插入、更新、删除）。
                    这些副作用会被记录在 effectTag 属性中。
                完成工作：
                    当遍历完成后，React 会执行 completeWork 方法，生成完整的 Fiber 树。
        - Commit 阶段：将更新应用到真实 DOM。
            Commit 阶段是同步的，不能被中断。它的主要任务是：
                应用副作用：
                    React 会遍历 Fiber 树，根据 effectTag 执行相应的 DOM 操作（例如插入、更新、删除）。
                调用生命周期方法：
                    在 Commit 阶段，React 会调用组件的生命周期方法（例如 componentDidMount、componentDidUpdate）。

以下是 Fiber 架构中一些关键函数的源码级别解析：
    beginWork
        作用：处理当前 Fiber 节点，生成新的子节点。
        根据 Fiber 节点的类型（例如函数组件、类组件、DOM 元素），调用相应的更新逻辑。
        生成新的子节点，并返回第一个子节点。
    completeWork
        作用：完成当前 Fiber 节点的工作，生成完整的 Fiber 树。
        处理当前 Fiber 节点的副作用（例如 DOM 更新）。
        将当前节点的子节点链表连接到父节点。
    performUnitOfWork
        作用：执行一个工作单元（即一个 Fiber 节点）。
        调用 beginWork 处理当前节点。
        如果有子节点，则继续处理子节点。
        如果没有子节点，则调用 completeWork 完成当前节点。
    workLoop
        作用：循环执行工作单元，直到所有任务完成或时间片用完。
        在每一帧中执行 performUnitOfWork，直到任务完成或时间片用完。
        如果任务未完成，则将剩余任务推迟到下一帧执行。

3. 总结
Diff 算法：React 通过层级比较和双指针算法高效地比较新旧虚拟 DOM 树，减少 DOM 操作。

Fiber 架构：Fiber 是 React 的核心算法，通过链表结构和任务调度实现增量渲染和可中断更新。

Render 阶段：生成新的 Fiber 树，标记需要更新的节点。

Commit 阶段：将更新应用到真实 DOM，调用生命周期方法。

希望这个详细的解释能帮助你更好地理解 React 的 Diff 算法和 Fiber 架构！如果还有其他问题，欢迎继续提问！