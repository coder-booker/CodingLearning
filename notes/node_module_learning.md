package.json, package-lock.json
    前者是metadata限制和简述，后者是实际安装的详细metadata
    学习：https://juejin.cn/post/7205007227559673913
    devDependence实际上不太会被使用，因为部署的时候无论dev不dev都会把库编码成静态代码，加什么dependence都无所谓

npm install 安装未安装的库

### CommonJS规范 vs ES6 Modules 规范
#### general
- .js, .json, .node可以不用加后缀名
- ES6的规范基本上是比commonjs多了个default和抛弃了"包裹所有模块"的对象
#### CommonJS
- 导入：`const xxx = require('./yyy'); xxx.a; xxx.b;` or `const { aaa } = require('./yyy'); aaa;`
- 导出：`module.exports = { a: a, b: b };` or `module.exports = { a, b };`
- 对于`export a;`的导出，想象有个大对象包住了所有export，因此行为一致。但`export default b`的导出需要使用`xxx.default;` or `xxx.default();`
#### ES6
- 导入：`import xxx from './yyy';` or `import { aaa } from './yyy';`;
- 导出：`export xxx;` or `export default xxx;`
- 对于.json文件，需要`import xxx from './yyy' assert { type: 'json' };xxx.a;xxx.b`

### Express
- req.query.key_name 可以自动解析和获得query string key_name的值

### Sequelize
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

### CORS
- http-proxy-middleware
- 用绝对路径无法代理

### concurrently
- 同时启动多个服务


### react-Spring
- 主要是用来控制动画的，画图还是原生元素
- 常用配置：
  - reset: boolean (default false)
  - reverse: boolean (default false)
  - mass (default 1)
  - tension(default 170)
  - friction, velocity, delay, duration(如果超过就立刻结束动画)


### redux
- dispatch 用于分发 action。
  - 更新state：`dispatch(action-object)`
- reducer 处理 action 并更新 state。
- action creator 创建 action。
- selector 从 Redux store 中提取特定的数据。
- createSlice 合并简化了 reducer 和 action creator 的定义。
  - 内部设置好的reducer会自动被生成一个同名的action creator
  - action的type：`/[slice-name]/[reducer-name]`
  - action的payload: `payload: {...[给action creater传入的参数对象]}`
  - reducer会自动返回state，不需要显性返回
  - 同步action使用reducer，异步action使用extraReducer（因为异步更新要额外逻辑）
- createAsyncThunk 合并简化了固定action和复杂的异步reducer逻辑。
  - 内置pending、fulfilled、rejected三个action
  - 因此在对应slice中，需要处理这三个action。
  - redux有规范的处理thunk action的功能
    - 在slice中除reducer外，额外定义一个extraReducer来处理thunk aciton
- createSelector 创建 memoized selector，用于提取复杂的 state和优化性能。

- selector和createSelector
```js
const mySelector = state => state.data
const defaultSelector = useSelect(mySelector) // 会自动传入state, 如果不指定mySelector则直接返回state

const mySelector2 = createSelector(
  [...input_func_list], 
  output_func
);
// 第一个参数是n个取state为第一个参数，剩下参数动态取的函数。因为state内置自动传入，剩余的参数就看input_func有没有接收了
// 第二个参数是接收第一个参数中所有input_func的返回值为参数的函数，而这个函数的返回值就是selector的值了
// 因此整个createSelector就是为了state本身需要被预处理才能被使用的情况
// 此外，createSelector还可以进行参数层面的浅对比来决定是否更新state，以此避免默认的计算出和直接浅对比state本身的资源浪费（尤其在预处理/计算比较复杂的时候）
```

### react-quill
- 用于自定义文本模块

### Prisma
- `npx prisma init --datasource-provider mongodb`
