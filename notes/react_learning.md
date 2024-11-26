# React learning note

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
- 不能在return后写，得写在return前
### useRef
- 让某个变量的变化在全局都能在不更新自身的情况下被获取
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
### useSWR
- 可以用来替代fetch，这玩意就是一个封装好的带有缓存和去重功能的fetch
- 但在next中，client不能使用async和await，因此fetcher要用.then
- 最为重要的功能是缓存（还没彻底搞明白）和去重
- 缓存：
    - 在触发特定条件前都会把上一次相同请求的结果保存下来，直到触发了，就会后台重新请求并对比新旧数据来决定要不要重新渲染
    - https://swr.vercel.app/zh-CN
    - 特定条件为（以下为默认值）：
        - `revalidateOnFocus: true`：当浏览器窗口重新获得焦点时，重新验证数据。
        - `revalidateOnReconnect: true`：当网络重新连接时，重新验证数据。
        - `refreshInterval: 0`：定期验证缓存，0表示不会定期重新验证数据。单位为ms
        - revalidateOnMount - 如果设置为 true，每次组件挂载时都会自动重新验证数据。
        - refreshWhenHidden - 如果设置为 true，在文档不可见时还是会自动重新验证数据。
        - refreshWhenOffline - 如果设置为 true，即使 offline，也会自动重新验证数据。
        - suspense - 如果设置为 true，在重新验证数据之前将显示占位符内容来保持组件渲染的持续性。
        - errorRetryCount - 它是重试次数，默认值为 3，当数据验证失败时，它将尝试重新验证数据的次数。
        - errorRetryInterval - 毫秒数，当数据验证失败后重试的间隔时间。默认值为 5 秒。
        - dedupingInterval - 重复验证响应的缓存时间，以毫秒为单位。
        - focusThrottleInterval - 切换页面焦点之后，重试时间的等待时间。
        - loadingTimeout - 最长等待请求的毫秒数，超时会显示加载错误消息。
    - 这些条件可以全局部署，有个叫SWRConfig的东西
- 去重：
    - 背后有一个请求队列，每个请求结束前都会被加入其中
    - 具体行为如下：
        - 请求触发时：
            1. 检查当前请求队列有无相同url的请求，如有则自己不添加进请求队列而是等该请求的结果
            2. 检查有无相同url的缓存，如有则缓存优先，然后后台仍然重新验证。这个后台验证算是一个新的请求
        - 请求进行时(等待响应)：被添加到请求队列中等待完成
        - 请求完成：把结果分发给第一步被拦下来的相同请求。此时新的相同url请求才会看情况能否重新被允许加入请求队列
- eg
    ```ts
    import useSWR, { SWRConfig } from "swr";

    const fetcher = (url: string) => fetch(url).then(res => res.json());

    const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, options);

    return (
        <SWRConfig
            value={{
                // ...缓存配置
            }}
        >
            {children that use the config}
        </SWRConfig>
    );
    ```

### philosophy
- 一个组件做一件事
- 组件渲染顺序布可预测，所以组件应该以纯函数的形式设计
### 重新渲染
- 大部分钩子只会对生命周期(如挂载和卸载)有反应，重新渲染不会改变这些钩子的设置和值
- 但反过来说，钩子值的改变也会触发重新渲染

## 自定义钩子
- 复用逻辑，复杂状态管理，复杂的副作用逻辑


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

### event
- onScroll之外的所有事件都会被传播到父级组件
- ```(e) => {e.stopPropagation();}```
- ```e.preventDefault();```

### Route
- `import { BrowserRouter, Routes, Route } from "react-route-dom"; `
- BrowserRouter和Routes分开是因为有多种和BrowserRouter同层级的组件可以使用
- path定义使用`/:xxxx`，可以把xxx这个位置的值定义为参数，任何同级路由匹配不到的值都会被这个参数捕获。`useParams()`钩子可以捕获这个参数
- `<outlet />`组件可以把子级路由缩放到outlet的位置而不是更新整个页面


### syntax
- `{}`是代码，`()`是jsx元素