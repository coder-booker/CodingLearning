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


### experience
- state + useEffect空依赖可以实现监控组件挂载并在之后进行某些操作
- 

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
## 自定义钩子
- 复用逻辑，复杂状态管理，复杂的副作用逻辑


# 内置函数
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

# 内置组件
### Route
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


# syntax
- `{}`是代码，`()`是jsx元素



# to-do
- 错误边界
- RoutingContext