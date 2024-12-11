
# 基础
## Basic
- 六大基本类型/原始值
    - undefined、null、boolean、number、string、symbol
- 变量二进制的低三位代表其类型：000: 对象，001：整数，100：字符串等
- === 不做类型转换
    类型对比 -> 如一样则对比值，如果是对比数字就得额外判断NaN，如果是对比对象或函数则对比引用
- typeof xxx查询, instanceof XxxYyy判断
- false：
    - 0（数字零）
    - -0（负零）
    - 0n（BigInt 零）
    - ""（空字符串）
    - null 
    - undefined 
    - NaN（Not-a-Number）
- true: 
    - true
    - 非零数字（例如 1, -1, 3.14）
    - 非空字符串（例如 "hello", "false", "0"）
    - 对象（例如 {}, []）
    - 函数（例如 function() {}, () => {}）
    - 非零 BigInt（例如 1n, -1n）
## 赋值
- 数组解构
- 对象解构
    - eg: `const {a, b, c} = { a: 10, b: 10, c: 10};`
- 解构默认值
    - 数组: `const [ a, b = 20, c = 50 ] = [ 10 ];` -> `a=10, b=20, c=50` (必须按顺序)
    - 对象: `const { a = 10, b = 20, c = 30 } = {a: 20, b, c: 20}` -> `a=20, b=20, c=20` (以键来标识)
- 储存基本类型/原始值的变量被赋值给别的变量时，是复制了一份副本给这个新变量。而储存对象的变量则会赋值其引用给别的变量。
## 类型自动转换/宽松比较 loose type comparison
- js是动态类型语言，所以变量的类型是运行时确定的，因此会有类型的自动转换
- 转换可以手动也可以自动，但大多数情况下用自动
- 场景
    - 对比运算
        - 字符串与数字混合：转成数字
        - 对象与对象：对比地址
        - eg `'1'<2`返回true，`'5'==5`返回true
        - 注意`===`是严格相等，不会进行类型转换
    - 数学运算
        - 全都尝试变成数字
        - `+`例外：如果`+`一个字符串，会变成字符串拼接
    - 字符串拼接
        - 啥都尝试转成字符串
    - 逻辑运算(比如条件判断和`!`的场景)转换成true和false
        - 骚操作：因此`!!`可以转换成对应的boolean
    - 对象参与运算时，如果需要转换类型，会尝试用`toString()`或者`valueOf()`方法将运算元转换成原始值primitive再运算，如果两个方法都没有返回原始值则报错
## 对象
- 万物皆对象
- `this`指向调用者的上下文
- 全局对象
    - 非严格模式下为window，全局变量和独立函数、匿名函数都为其属性与方法，它们的this也会指向widnow
    - 严格模式下this返回的是undefined
    - `var`声明的不在函数内的变量会属于全局对象，而`let`不会
- 字面量对象
    - 直接用花括号初始化的变量就是字面量对象
- 原型链
    - 每个对象都有一个private属性，指向自己的prototype(也可以理解为继承的类)，而prototype也有自己的prototype
    - 可以一直往上追溯，直到某个prototype的prototype属性为null
- 对象除非特殊处理过，否则布可迭代（数组就是特殊的可迭代对象）
- `delete`操作符
    - delete 操作符用于删除对象的某个属性；如果没有指向这个属性的引用，那它最终会被释放。
    - 如果你试图删除的属性不存在，那么delete将不会起任何作用，但仍会返回true
    - 如果对象的原型链上有一个与待删除属性同名的属性，那么删除属性之后，对象会使用原型链上的那个属性（也就是说，delete操作只会在自身的属性上起作用）
    - 任何使用 var 声明的属性不能从全局作用域或函数的作用域中删除。
        - 但在对象中的函数是能够用delete操作删除的。
    - 任何用let或const声明的属性不能够从它被声明的作用域中删除。
    - configurable为false属性不能被移除。这意味着像Math, Array, Object内置对象的属性以及使用Object.defineProperty()方法设置为不可设置的属性不能被删除。
    - 参数是神秘的字面量（例如数字啥的）也不能delete，只会返回true
- `Object.defineProperty([obj], [prop], [descriptor])`
    - 用来给某个对象详细设置属性的内置函数
    - 具体可以设置什么通过descriptor来定义
    - `obj`：要被定义属性的对象
    - `prop`：要定义的属性名
    - `descriptor`：属性描述符对象
        - `value`：属性的值。默认为 undefined。
        - `writable`：属性是否可写。默认为 false。
            - 如果是false，所有的修改对此属性的修改都会不起作用
        - `enumerable`：属性是否可枚举。默认为 false。
            - 用`for in`或者`Object.keys`枚举的时候会不会显示这个属性
        - `configurable`：属性是否可配置。默认为 false。
            - 能否被`Object.defineProperty`再次定义
        - `get`：属性的 getter 函数。默认为 undefined。
            - 也就是该属性被调用时会使用这个get()的返回值
        - `set`：属性的 setter 函数。默认为 undefined。
            - 也就是该属性被修改时会把修改值当成参数输入set()中
- 内置对象的所有属性都是不可配置的(configurable=false)

## 数组
- 数组本质上就是经过特殊处理的可迭代对象
- .push() 追加
- .length 长度
- .shift() 删除并返回index为0的元素
- .pop() 删除并返回最后一位元素
- .toString() 用,拼接所有元素成字符串
- .splice()
    - 高度集成的数组方法，可以同时添加删除和替换元素
    - arr.splice(a, b, c, d);
        - 以索引a为起始，删除b个元素。b可以 = 0 或 > arr.length
        - 在索引a的位置插入c, d，甚至efgh，没有限制数量
- .include() 判断有无包含某元素
- .indexOf() 获得某元素在数组中的第一个匹配项的idx，如无则返回-1
- .find() 获得某元素在数组中的第一个匹配项本身，如无返回undefined
- 一般用const修饰，因为const的是引用而非数组内的值，所以数组const仍可修改
- 复制可以用[...target]
- new Array(len).fill(0);
- const a = Array.from(iterator/str); 从迭代器/字符串建立数组

## 迭代器
- for of 可以用，一个元素多个值用for let [a, b] of
- ...扩展运算符可以全部解出来

## 字符串
- let a = "asdasd";
- for of 或 a.split('').forEach/.map 可以遍历
- a.charCodeAt(i); 打印a[i]处字符的ascii code
- a.length 获得长度
- a.substring([start], [end?]) 不接受负数，如果start > end会自动交换这两个数
- a.slice([start], [end?]) 接受负数为从末尾倒数的index，如果start > end会返回空字符串

## json
- 把已声明变量的名字用{}包起来，可以快捷建立拥有以变量名为键，变量值为值的键值对的字面量对象
- `JSON.stringify()`把对象转变为json字符串样式
- `.json()`不只是解析json内容，同时还会转化为js的对象
- 无论用那种语法传输，背后都是json字符串形式的？？？？

## 循环 
- 传统循环：
    - `for ( const i = 0; i < n; i++ ) {};`
- for in：
    - `for ( let x in a_object ) {};`
    - x代表对象属性
    - 虽然父类属性会被跳过，但可能有部分父类的属性被设置为可遍历了。可以用`a_object.hasOwnProperty(x)`来判断避免
    - 数组的属性是其索引
- for of：
    - `for ( let x of a_iterable ) {};`
    - x代表可迭代对象a_iterable的迭代值
    - 数组可迭代，迭代值是元素；常见json对象不可迭代
- .map()：
    - `arr.map((element, index, arr) => { return sth; }, a_object);`
    - 第一个参数是函数，接收 元素，索引，被map的对象本身三个参数；可以只声明一个来只接收元素
    - 第二个参数是供在第一个参数的函数内调用`this`的指向。可以因此 达成用a的元素索引b 的操作
- .forEach()：
    - 类似map，但不返回值
- .filter()：
    - 类似map，但只返回内部函数返回了true的索引位置的元素


# js运行环境
## General concept
- v8和Nodejs的区别
    - 两者完全不在一个层级
    - v8引擎是浏览器内核中的运行js用的一部分，在浏览器运行js文件时就会用到。而Node.js是在浏览器外运行js代码的一个环境。所以说两者完全不在一个层级
    - 然而Node.js的底层有利用v8引擎，这点和这部分要讨论的内容不太相关
    - 所以当我们讨论运行环境时，应该说"在浏览器运行"或者"在Node.js"运行
## ECMAScript
- js的来源，js只是其拓展罢了
- 各版本的更新
    - ES5（ECMAScript 5，2009）：
        - 引入了严格模式（strict mode）。
        - 增加了数组方法（如 forEach、map、filter 等）。
        - 增加了 JSON 支持。
        - 增加了 Object.defineProperty 等方法。
    - ES2015（ES6，ECMAScript 2015）：
        - 引入了 let 和 const 关键字。
        - 引入了箭头函数（arrow functions）。
        - 引入了类（class）和模块（module）。
        - 增加了模板字符串（template strings）。
        - 增加了解构赋值（destructuring assignment）。
        - 增加了 Promise 对象。
        - 增加了import export的ECMAScript Module(ESM)规范
    - ES2016（ES7，ECMAScript 2016）：
        - 增加了 Array.prototype.includes 方法。
        - 增加了指数运算符（**）。
    - ES2017（ES8，ECMAScript 2017）：
        - 引入了 async/await 语法。
        - 增加了 Object.entries 和 Object.values 方法。
        - 增加了字符串填充方法（padStart 和 padEnd）。
    - ES2018（ES9，ECMAScript 2018）：
        - 增加了异步迭代器（async iterators）。
        - 增加了对象展开运算符（object spread operator）。
    - ES2019（ES10，ECMAScript 2019）：
        - 增加了 Array.prototype.flat 和 Array.prototype.flatMap 方法。
        - 增加了 Object.fromEntries 方法。
        - 增加了字符串的 trimStart 和 trimEnd 方法。
    - ES2020（ECMAScript 2020）：
        - 引入了可选链操作符（optional chaining operator，?.）。
        - 引入了空值合并操作符（nullish coalescing operator，??）。
        - 增加了 BigInt 数据类型。
- CommonJS和ESM规范
    - 就是两种js用的模块化声明规范。
    - CommonJS
        - 是早期的Node.js用的规范，只能在服务端运行。
        - 不支持命名导出，只能通过导出一个对象来实现类似的功能
    - ESM
        - 新的模块标准，服务端和浏览器都能运行
        - 支持命名导出
    - ESM已经在快速替代CommonJS成为标准模块系统，但CommonJS仍然是很多旧js库的规范
    - 有两种方法可以告知nodejs使用ESM或者CommonJS
        - 在package.json声明`"type":"module"`代表项目全局使用ESM，不写或写`"type":"commonjs"`代表用CommonJS
        - 把想使用ESM的文件用.mjs后缀命名，想使用CommonJS的用.cjs后缀命名
    - nodejs可以自动兼容互用ESM和CommonJS
## 线程
- js的运行环境大多是单线程，但只限于js代码和事件循环在一个线程中运行，对于一些其他的耗时任务例如IO操作和GC，其实有很多后台线程在并发或并行运行
- 运行js代码和事件循环的主线程也可以通过Nodejs的一个多线程/进程库来并发并行（和用户线程的关系是什么？）
## 内存管理
- general concept
    - 对于内存管理而言，我们关注对象多于变量常量，因为后者一般离开作用域就会被回收，而前者会有各种嵌套引用，更需要被处理
- 对象图
    - 用于管理对象引用关系的graph数据结构
    - 边是引用，节点是对象
- 引用：
    - 一般的数据结构都是强引用（就是常规意义下的引用。弱引用就是创造副本）
- 内存分配
    - js会为以下东西分配内存
        - 数值
        - 字符串
        - 对象/数组**的值**
        - 可调用对象（函数）
        - 函数调用结果
            - 如DOM、有返回值的方法
            - 构造函数也是，为一个对象分配内存
- 内存回收 GC
    - 这个问题是无法完全解决的，但有一些普遍的方法来涵盖大部分情况：
        - 引用计数回收
            - 判断某内存有无被引用，没有就回收
            - 这个方法面对循环引用会失效
        - 标记清除算法 Mark-Sweep
            - 从全局根对象开始往下找引用，最后把没法被遍历到的对象删除
            - 现代引擎使用的核心思路都是这个算法，剩下的改进都基于这个算法
            - 弱引用不被认为是可被遍历到的
        - 标记整理算法 Mark-Compact
            - Mark-Sweep加一步整理，但也因此会多一些开销
            - 把标记的对象移动到内存一段，整理空间并清除碎片
    - 早期的垃圾回收多会直接在主线程进行，但现代一般都会并发或并行
- V8引擎的GC机制
    - 把内存分为以下两个空间
        - 新生代
            - 用来储存生命周期较短的对象
            - 进一步分为两个空间
                - From 空间：当前正在使用的空间
                - To 空间：空闲的空间
            - 使用Scavenge算法回收垃圾。流程如下：
                - 用Mark-Sweep把From里的存活对象复制到To
                - 把所有对From内对象的引用更新到To中
                - 把To标记成From，把From标记成To
        - 老生代
            - 用来储存生命周期较长的对象
            - 使用标记整理算法回收垃圾
    - 增量标记 Incremental Marking
        - 把回收时的标记阶段拆分，让单次回收的暂停时间减少，更灵活
    - 并发垃圾回收
        - 让后台线程执行GC
- 内存抖动
    - Thrashing：VM频繁进行swap
    - Memory Churn：内存系统频繁分配和回收内存
- 内存泄露
    - 意思就是有没用的内存被保留或者创建了，或者说内存出现在了其不该出现的生命周期中
    - 常见的原因：
        - 闭包引用的变量
        - 全局变量
        - 事件未清除
        - 删除根节点时，子元素存在引用而没被删除
## 构建工具
- 对前端项目进行以下操作
    - 编译
        - 把类似Typescript和Sass的高级语言编译成最基础的js
    - 打包
    - 优化
    - 资源管理
    - 提供开发服务器(Optional)
- Tree-shaking
    - 一种减少代码体积的技术，通过静态分析代码依赖关系来移除代码中其实不会被使用的部分
    - 在ES2015/ES6中引入
- 现代常用的构建工具
    - Babel：用来把ES6+的代码编译为ES5的代码
    - Webpack：把js模块合并打包为一个bundle文件，还能做Tree-shaking

# Event
### DragEvent
- dataTransfer
    - `event.dataTransfer.setData("text/plain", "a msg");`
    - `event.dataTransfer.getData("text/plain");`


# 函数
- 默认隐性返回undefined，除非显性返回了某些值
- 上下文
    - 函数的上下文在9成情况下是由其调用决定的
        - 哪怕调用的函数体是一个有非全局对象的this的写法，只要调用的方法不传递this，函数内部的this就是全局对象
        - 除了箭头函数，箭头函数会自己捕获上下文
        - eg obj.func()中func的this就会变成obj，因为这种方法传递了一个obj的this
        - eg new func()中的this就会变成一个func实例对象，因为这种方法传递了一个func实例的this
        - eg func(anotherFunc) { anotherFunc(); }; func(obj.aaaa); 这里的anotherFunc调用后的this是全局对象，因为没有传递obj的this给func。
    - 只有箭头函数会捕获上下文
- 独立函数
    - 在全局对象下声明的函数
- 匿名函数
    - 定义时没有名称的函数
    - 箭头函数就是一种简洁的匿名函数
        - 注意箭头函数会捕获上下文
        - () => xxxx; 隐性返回xxxx
        - () => {return xxxx;}; 显性返回xxxx
    - 立刻执行函数(IIFE)
        - 只会是匿名函数
        - 给匿名函数的定义套上一层括号，然后调用就是立刻执行函数
        - 上下文是全局对象
- 构造函数
    - 函数定义之后用new来调用
    - 这样调用之后内部的this就会是这个函数的实例对象
- `.call(this, ...args)` vs `.apply(this, args)` vs `func()`
    - 调用函数的不同方法
    - 所有函数都默认有这仨方法
    - `.call(this, ...args)`
        - 显性传入一个this为第一个参数
        - 直接传递剩余参数
    - `.apply(this, args)`
        - 显性传入一个this为第一个参数
        - 剩余的参数使用数组化的参数传递
    - `func()`
        - 隐性传入上下文中的this
        - 任何地方、任何形式，只要用这种普通函数调用方式，this都会是全局对象
- 剩余参数 rest parameters
    - 在参数的定义那里写...[name]就可以接受任意长度的参数并构建为一个数组
    - eg
    ```js
    function (...args: any[]) {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            console.error(`Error in ${target.constructor.name}.${propertyKey}: ${error}`);
        }
    };
    ```
- 函数与对象
    - 实例化函数对象会使用返回值作为实例化后储存的对象。
        - 如果没有返回、返回值不为对象(比如返回了个基础类型)、或返回值为this，则返回其父级对象（函数作为方法时的父级对象）
        - 如果没有父级对象或者是匿名函数，非严格模式下会返回全局对象window，严格模式下返回`undefined`
    - 所以函数内也可以使用this，只要用new实例化为一个独立的对象且返回值不是对象就行

# null, undefined, NaN
- null
    - 应该在人为希望为空的变量/属性设置
    - 解除引用回收垃圾
    - 将会被使用(被有效值赋值)的变量初始化为null
    - null的类型是object（typeof null -> object）
    - 而null就是32个0
- undefined
    - 变量的“原始状态”
    - 未初始化变量，未声明(不存在的)属性，未传递实参，未声明变量的类型，void类型的变量，return; 都是undefined
    - typeof undefined -> undefined
    - null==undefined，但null!==undefined
- NaN (Not a Number)
    - typeof NaN -> number
    - NaN不会等于任何东西，包括其自身
- eg
    ```ts
    // 下面的返回值全是undefined
    let a = [];
    console.log(a?.name);

    let b = "";
    console.log(b?.name);

    let c = null;
    console.log(c?.name);

    let d  = undefined;
    console.log(d?.name)
    ```


# ***内置对象与方法***
### Math
- Math.max(...[all numebrs]); 如果a和b没法转换成number，返回NaN
    - Number(value); 所有变量，失败返回NaN
    - parseInt(value); 字符串，失败返回NaN
    - +name; 所有变量，失败返回NaN
    - * 1; 所有变量，失败返回NaN
- `Math.pow([base], [exponent]);` or `**`
- Math.abs()
### Promise
- `new Promise((resolve, reject) => { resolve("value"); reject("error") })`
    - resolve和reject都是函数体，调用就会终止promise异步操作，但resolve表成功，reject表失败
    - value是.then()会接受的值
    - error是.catch()可以接收的值
- `async`, `await`
    - await本质上就是把promise转换成了正常的返回值，也就是封装好了then
### setTimeout, setInteraval
- `setTimeout(func, time)`
    - 会在time ms后执行func()
- `let xxx = setInterval(func, time)` + `clearInterval(xxx)`

### Set/Map
- general
- Set
    - let a = new Set();
        可以从数组初始化
    - a.add(val);
    - a.has(val);
    - a.delete(val);
- Map
    - let a = new Map();
    - a.set(key, val);
    - a.has(key);
    - a.get(key);
    - a.delete(key);
    - a.forEach((key, val) => {});
    - a.entries(); 返回键值对迭代器
    - a.keys(); 返回键迭代器
    - a.values(); 返回值迭代器
    - for ( let [key, val] of a.entries() );


# other
### 导入模块
- 一般使用ES6模块格式即可
- 只有ES6模块可以导出/导入ES6模块
- 如果一份文件A导出，一份文件B引用，html导入时要使用`<script type="module" src="B.js></script>"`告知浏览器B是一个es6模块
### 语法糖
- `xxx?.yyy`: 可选链操作符
    - 安全访问xxx的属性yyy：如果xxx为undefined或者null之类无法获得属性的值，返回undefined而非报错
    - 注意如果xxx存在，即不是undefined或者null，虽然xxx?.yyy仍会返回undefined，但不是因为?.而是js自己的访问不存在变量的特性
- `!!xxxx`: 把xxxx转换成布尔值。等价于判断xxxx是否为null/undefined之类的无效值，减少了写判断式的功夫
- `a = b ?? c` vs `a = b || c`
    - `??`只会在null和undefined的时候返回右侧，`||`则只要false就返回
### resizeObserver
```js
const resizeObserver = new ResizeObserver((entries) => {
    // 可以同时监控多个元素
    for (let entry of entries) {
        // entry.target是被观察的元素

        // entry.contentRect包含元素的尺寸信息
        const [w, h] = [entry.contentRect.width, entry.contentRect.height];
    }
});
const observedElement = document.getElementById("aaa");
// observe 一个元素，要多个就多次observe
resizeObserver.observe(observedElement);
```
### Server-Sent Event (SSE)
- let frontend receive passively data from backend
- front: 
```js
const subscriber = new EventSource('http://localhost:11451/subscribe');
    subscriber.onopen = () => {
      console.log('Connection opened');
    };
    subscriber.onmessage = (event) => {
        // event.data是传入的东西，会被当成字符串（包括true false）
        console.log(event.data);
        // 可以用JSON解析
        const data = JSON.parse(event.data);
    };
    // 自定义事件，当发过来的字段中有"event: customEvent\n"就能被侦测到
    eventSource.addEventListener('customEvent', function(event) {
      console.log('Custom Event:', event.data);
    });
    subscriber.onerror = function(error) {
      console.error("EventSource failed:", error);
    };
    // 适当的时候关闭
    subscriber.close();
```
- back:
```js
const clients = [];
// 建立连接用
app.get('/subscribe', (req, res) => {
  try {
    // 设置header为event-stream，并且设置cache和keep-alive来确保数据会实时更新
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 记录client连接，用以继续给同一个client发数据
    clients.push(res);

    // 如果前端.close()了
    req.on('close', () => {
        // 清除client连接记录
        clients.splice(clients.indexOf(res), 1);
        console.log('close'+clients.length);
        // 关闭
        res.end();
    });
} catch (err) {
    console.error(`Subscribe ERROR: ${err}`);
    res.status(500).send('error');
}

// 发送数据用
function sendMsg() {
  try {
    // 发送信息。直接发送的任何东西都会被解析为字符串，包括boolean
    const data = JSON.stringify({aaa: "aaaa"});
    clients.forEach(client => {
        // 发送，\n\n为SSE标准中单次数据发送的结束符
        client.write(`data: ${data}\n\n`);
        
        // 除了用json，一次发送多个字段还可以用一个\n分割多个字段来发送
        // SSE发送的消息可以按照一定"xxx: yyy"格式被前端自动解析
        client.write(`id: 1\n`);                // eventSource.lastEventId
        client.write(`event: customEvent\n`);   // eventSource.addEventListener('customEvent', (event) => {})
        client.write(`data: ${data}\n\n`);      // event.data
    });
}
```
### localStorage
- `localStorage.setItem("key", value)`
- `localStorage.getItem("key")`
### URL类
- 封装好各种获得URL参数的方法
- 其中的属性/方法：
    - href：完整的 URL 字符串。
    - protocol：URL 的协议部分（例如 http: 或 https:）。
    - host：URL 的主机部分，包括端口号（如果有）。
    - hostname：URL 的主机名部分，不包括端口号。
    - port：URL 的端口号。
    - pathname：URL 的路径部分。
    - search：URL 的查询字符串，包括问号（?）。
    - searchParams：一个 URLSearchParams 对象，表示查询参数。
    - hash：URL 的片段标识符，包括井号（#）。
    - origin：URL 的源，包括协议、主机名和端口号。
    - toString()：返回 URL 的字符串表示形式。
    - toJSON()：返回 URL 的 JSON 表示形式，通常与 toString() 相同。
- e.g.
    ```ts
    const url = new URL('https://example.com:8080/path/name?query=string#hash');
    console.log(url.href);         // 'https://example.com:8080/path/name?query=string#hash'
    console.log(url.protocol);     // 'https:'
    console.log(url.host);         // 'example.com:8080'
    console.log(url.hostname);     // 'example.com'
    console.log(url.port);         // '8080'
    console.log(url.pathname);     // '/path/name'
    console.log(url.search);       // '?query=string'
    console.log(url.searchParams); // URLSearchParams { 'query' => 'string' }
    console.log(url.hash);         // '#hash'
    console.log(url.origin);       // 'https://example.com:8080'
    console.log(url.toString());   // 'https://example.com:8080/path/name?query=string#hash'
    console.log(url.toJSON());     // 'https://example.com:8080/path/name?query=string#hash'
    ```


### Request
- 属性  
    - method：请求方法（如 GET、POST、PUT、DELETE 等）。
    - url：请求的完整 URL。
    - headers：请求头部，类型为 Headers 对象。
    - body：请求主体，类型为 ReadableStream。
    - bodyUsed：一个布尔值，表示请求主体是否已被读取。
    - credentials：请求的凭据模式（如 omit、same-origin、include）。
    - mode：请求的模式（如 cors、no-cors、same-origin）。
    - cache：请求的缓存模式（如 default、no-store、reload、no-cache、force-cache、only-if-cached）。
    - redirect：请求的重定向模式（如 follow、error、manual）。
    - referrer：请求的引用来源。
    - referrerPolicy：请求的引用来源策略。
- 方法  
    - clone()：创建请求的副本。
    - text()：以文本形式读取请求主体，返回一个 Promise。
    - json()：以 JSON 形式读取请求主体，返回一个 Promise。
    - formData()：以 FormData 形式读取请求主体，返回一个 Promise。
    - arrayBuffer()：以 ArrayBuffer 形式读取请求主体，返回一个 Promise。
    - blob()：以 Blob 形式读取请求主体，返回一个 Promise。
- 手动实例化
    ```ts
    const request = new Request('https://example.com', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        mode: 'cors',
        cache: 'default'
    });
    ```

### Response
- 常用属性和方法
    - status：响应的状态码。
    - statusText：响应的状态文本。
    - headers：响应头部，类型为 Headers 对象。
    - ok：一个布尔值，表示响应的状态码是否在 200-299 范围内。
    - redirected：一个布尔值，表示响应是否是重定向的结果。
        - 一般情况下浏览器都会自动处理3xx的重定向状态码，不需要手动检测redirected和fetch
    - type：响应的类型（如 basic、cors、default、error、opaque、opaqueredirect）。
    - url：响应的 URL。
    - clone()：创建响应的副本。
    - text()：以文本形式读取响应主体，返回一个 Promise。
    - json()：以 JSON 形式读取响应主体，返回一个 Promise。
    - formData()：以 FormData 形式读取响应主体，返回一个 Promise。
    - arrayBuffer()：以 ArrayBuffer 形式读取响应主体，返回一个 Promise。
    - blob()：以 Blob 形式读取响应主体，返回一个 Promise。
- 手动实例化
    ```ts
    const response = new Response(JSON.stringify({ key: 'value' }), {
        status: 200,
        statusText: 'OK',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    ```
### Error
- 常用属性
    - name: 错误的名称，默认值是 "Error"。
    - message: 错误的描述信息。
    - stack: 错误的堆栈追踪信息，通常用于调试。
- 构造函数只接收message，要构造的时候修改其他属性需要extends；但可以在实例化后修改其他属性
- e.g. `const error = new Error('Something went wrong');`





- to-do
    - 搞清楚所谓"this指向调用者的上下文"是什么意思
        - 这涉及到.call()隐性传入的this是什么
    - symbol是什么