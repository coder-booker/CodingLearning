### package.json, package-lock.json
- 前者是metadata限制和简述，后者是实际安装的详细metadata
- 学习：https://juejin.cn/post/7205007227559673913
- devDependence实际上不太会被使用，因为部署的时候无论dev不dev都会把库编码成静态代码，加什么dependence都无所谓

## General
- `Polyfill`: 意思是"一段用于在旧版本环境模拟新版本特性的兼容用代码"

## CommonJS规范 vs ES6 Modules 规范
### general
- .js, .json, .node可以不用加后缀名
- ES6的规范基本上是比commonjs多了个default和抛弃了包裹所有模块的export对象
### CommonJS
- 导入：`const xxx = require('./yyy'); xxx.a; xxx.b;` or `const { aaa } = require('./yyy'); aaa;`
- 导出：`module.exports = { a: a, b: b };` or `module.exports = { a, b };`
- 对于`export a;`的导出，想象有个大对象包住了所有export，因此行为一致。但`export default b`的导出需要使用`xxx.default;` or `xxx.default();`
### ES6
- 导入：`import xxx from './yyy';` or `import { aaa } from './yyy';`;
- 导出：`export xxx;` or `export default xxx;`
- 对于.json文件，需要`import xxx from './yyy' assert { type: 'json' };xxx.a;xxx.b`

## Express
- req.query.key_name 可以自动解析和获得query string key_name的值

## Sequelize
- 在第一次对数据库进行操作时才会建立连接
- exmaple: 
```js
const sequelize = new Sequelize([db_name], [account], [password], { 
    dialect: "mysql", 
    host: [host], 
    port: [port]
});
sequelize.define([table_name], {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true
    }, 
    bruh: {
        type: DataTypes.STRING, 
        allowNull: false
    }, 
}, {
    timestamps: false,      // seq会自动加，因此要禁止
    freezeTableName: true   // seq会把表名自动加s，因此冻结表名
})
async function validate(account, password) {
    try {
        await seq.authenticate();   // 会select点默认值来测试
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
},
```

## CORS
- http-proxy-middleware
- 用绝对路径无法代理

## concurrently
- 同时启动多个服务


## react-Spring
- 主要是用来控制动画的，画图还是原生元素
- 常用配置：
- reset: boolean (default false)
- reverse: boolean (default false)
- mass (default 1)
- tension(default 170)
- friction, velocity, delay, duration(如果超过就立刻结束动画)


## redux
- dispatch
    - 用于分发广播action
    - 根据action的type属性分发到指定路径/name
    - `dispatch(action-object)`
- reducer
    - reducer就是把action换成state更新行为的模块
    - 接受广播的action，并根据写好的应对action的代码对应地更新state。
    - reducer会隐性返回state，不需要显性返回
- action
    - 被dispatch给reducer的DTO
    - 内部结构：
        - `type: /[slice-name]/[reducer-name]`，表示action的路径/name
        - `payload: {some_data}`，表示action想发出去的数据，一般用于在reducer中更新state的数据
    - action creator就是创建一个action的函数，也就是创建一个有type和payload的对象的函数而已
        - action creator一般需要type和payload才能创建action，但redux有些语法糖能隐性设置好type，只需要传入payload就行，比如slice隐性定义的action creator
        - 注意，slice里的和reducer同名的action creator是沟槽的隐性定义的，***和slice里的reducer没有半点关系***
- selector
    - 就是读取目前最新state
    - 背后逻辑是通过Reselect库浅对比selector的输入来判断要不要更新useSelector的返回值。这个库内置在redux toolkit中无需再导入
    - eg
    ```js
    const mySelector = state => state.data
    const defaultSelector = useSelect(mySelector) // 会自动传入state, 如果不指定mySelector则直接返回state

    const mySelector2 = createSelector(
        [...input_func_list], 
        output_func
    );
    // 第一个参数是n个 取state为第一个参数，剩下参数动态取的 函数。因为state内置自动传入，剩余的参数就看input_func有没有接收了
    // 第二个参数是接收第一个参数中所有input_func的返回值为参数的函数，而这个函数的返回值就是selector的值了
    // 因此整个createSelector就是为了state本身需要被预处理才能被使用的情况
    // 此外，createSelector还可以进行参数层面的浅对比来决定是否更新state，以此避免默认的计算出和直接浅对比state本身的资源浪费（尤其在预处理/计算比较复杂的时候）
    ```
- Slice
    - action creator + 对应reducer的语法糖
    - name没有用，只是一个标识符
    - 内部设置好的reducer会自动被生成一个同路径的action creator
        - 导出这个reducer实际上是导出其action creator，这个action creator隐性定义了type，只要接收一个object成为payload就能创建好一个action
        - eg slice设置了个setUser的reducer，对应的action creator要则这么调用：`setUser({userName: 'mike'})`
    - extraReducer里设置的reducer则不会自动创建action creator，一般是外包给Thunk来定义
- createAsyncThunk
    - action creator语法糖
    - Thunk其实就是一个由异步代码提供payload的action creator
        - 异步操作有三个常用action：pending、fulfilled、rejected。Thunk会在其内部撰写的代码运行过程中，按照其运行情况自动在定义的name下发布对应action
        - 内部撰写的代码返回rejectWithValue(xxx)的返回值就是rejected action的payload，返回其他值就是fulfilled的action payload。pending action没有payload
        - 在对应slice中，需要用extraReducers来设定其reducer。
- createSelector 创建 memoized selector，用于提取复杂的 state和优化性能。
- Store
    - 最终把redux状态树配置起来。
    - combineReducer
    - 如果store中定义的状态路径和slice中定义的不一样，
- Redux设计理念：
    - 统一状态管理
    - 把复杂的状态管理逻辑组合封装为一个个行为，提高可读性（也就是用文字的action来封装复杂的setState）
- redux手动实现
    - listener队列：包含着所有订阅者的通知用回调函数（也就是selector）
    - subcribe函数：把订阅者的通知用回调函数传入listener队列。这个回调函数需要与组件声明周期挂钩，如useState的setter，useEffect的依赖数组值改变等等
    - reducer函数：传入action和state，并对action做出对应修改
    - dispatch函数：更改state，通知listener队列里对应的selector
    - useSelector钩子：封装subscribe和getState的钩子
        - 嵌套钩子原来也会重新渲染组件
    - getState函数：获得state
    - store：包含了state、reducer、listener的对应关系
    - 通过action的type和订阅时的type分片，只让指定的

## react-quill
- 用于自定义文本模块

## Prisma
- `npx prisma init --datasource-provider mongodb`

## useSWR
- 来自swr库
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
