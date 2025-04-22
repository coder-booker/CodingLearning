# General
- 语法类似python，但有实际的类型约束错误
- 导入库时，如果库本身是js的也没有自带ts支持(类型支持)，可能需要导入额外的`@types/[module_name]`来在ts中正确使用
    - 例如 uuid和@types/uuid
- 运行ts文件背后一般都是编译成js再运行
- 留意commonjs和es6模块的区别，似乎可以用文件后缀来指定: `.cjs`, `.mjs`；但也可以在`tsconfig.json`中指定
    - `type: module;` vs `"esModuleInterop": true;`???
- nodejs运行ts文件：
    - 局部安装`ts-ndoe`和`typescript`，注意ts-node不能全局安装，会报错
    - `node --loader ts-node/esm .\test.ts`
    - `--loader` 用于指定使用什么加载器加载和运行后续文件
    - `ts-node`默认使用commonjs语法，因此要在`tsconfig.json`加上`{"compilerOptions": {"module": "ESNext"}`额外指定使用ESMAScript，或者说es6 
    - 使用`ts-node`可以无需编译直接运行ts文件
### 规范
- 函数要写好参数和返回值类型
- 字符串一般都用单引号，除非字符串包括单引号就用双引号


# 操作符
- `xxx?: yyy` 表示xxx是可选的类型？
- `xxx!` 非空断言符，强行声明不可能undefined
- `?.` 可选链操作符
- `<boolean> && function()` 如true则调用function()
# type
- type guard：
    - 如果某值不允许undefined，只要用任何方法排除undefined的情况即可，哪怕不是在那个花括号内，而是在父元素排除的都可以
    - 或者用`xxxx.yyyy!;`，
- 常用type
    - `any`/`unknown`：any过不了eslint的默认规则
    - `string`, `number`, `boolean`
    - `xxxx[]`xxx的数组
- 特殊type
    - 枚举类型`enum`：就是多个常量同时枚举，可以用自带的数字值枚举、字符串枚举、或者自己指定的异构枚举
    - Union type：`xxxx | yyyy`
    - 元组类型：`const arr: [string, number] = ['123', 123];`
    - 组合type：`XXXX<yyy>`
        - 有点类似“指定XXXX接收yyy类型的参数”
        - eg `const aMap: Map<number, number> = new Map([[1, 2], [2, 3]])`
        - eg `const [a, setA] = useState<number>(0)`
- type的操作
    - 注意对type的操作和泛型的约束语法是完全不同的两种东西
        - 泛型是对类型的相对描述，所以泛型算在普通类型的上一层而不是同层
        - 比如`type A = keyof B`和`<T extends keyof K>`是完全不同的东西
    - 注意ts的type的理念是Duck Typing，也就是某类型的超集也能通过该类型的检查
    - 导入导出
        - `export type { aType };`
        - `import type { aType };`
    - `keyof XXX`: 返回一个对象类型的所有键的Union type。
    - `type TB = TA & TC;`：交叉类型 Intersection Types（拓展type）
    - `Omit<T, K extends keyof T>`: 去除了K的T对象类型，可以理解为T对K的补集（complementary）
        - 比较有意思的是第一个类型参数是对象参数而第二个类型参数是Union type，这也是Omit和Exclude的不同之处
        ```ts
        type AAA = {
            id: string;
            name: string;
            uid: number;
        };
        type BBB = Omit<AAA, "name" | "uid">; // {id: string}
        ```
    - `Pick<T, K extends keyof T>`: 返回第二个参数指定的键的对象类型
        ```ts
        type AAA = { 
            id: string;
            name: string;
            uid: number;
        }
        type BBB = Pick<AAA, "name" | "uid">; // {name: string; uid: number}
        ```
    - `Record<T, K>`
        - 批量动态声明对象每个键值对应有的类型
        - 有点类似一张表的一条记录的类型，只不过这个表的column只有俩：键和值
        - 一般用于给object定义类型
            ```ts
            type AAA = Record<string, number>;
            const BBB: AAA = {
                id: 1, 
                age: 18,
            }
            ```
    -  `Partial<T>`/`Required<T>`: 把一个对象类型的所有键变成可选/必选的
- 泛型`<T>`
    - 感觉就是用来实现多态的对类型的相对描述
    - eg `function toArray<T>(attr: T): T[] {return [attr];}`
    - 约束语法
        - `T extends K`: 表示T必须是K或者K的继承者/超集
- React的type
    - `JSX.Element`/`React.ReactNode`
        - children就是`React.ReactNode`
    - `FunctionComponent<<propType>>`/`FC<<propType>>`
        - 就是一般react会导出的那个组件，可以指定`<propType>`
        - 注意`React.Component`就是16以前的类组件
    - `React.CSSProperties`
        ```ts
        type HomeStyle = {
            style: {
                backgroundColor: string;
                color: string;
            }
        }
        ```
    - Hooks
        - 直接悬停查看，然后复制比较好
        - 例如 `useState(0)`的`setXXX`函数的类型是`React.DIspatch<SetStateAction<number>>`
        - `useState<string>("");`
    - Event
        - `React.ChangeEvent<HTMLInputElement>`
        - focus: `change: React.FocusEvent<HTMLInputElement>`
        - key pressed: `React.KeyboardEvent<HTMLInputElement>`
        - click: `React.MouseEvent<HTMLButtonElement, MouseEvent>`
        - form submit: `React.FormEvent<HTMLFormElement>`

- basic:
    ```ts
    type Letter = "AAA" | "BBB" | "CCC";
    type HomeProps = {
        // 不用分号也行
        prop1: Letter;
        prop2: number[];
        prop3?: boolean;
        prop4: Letter;
        prop5: [number, number, string];
    };
    function Home({
        prop1,
        prop2,
        prop3,
        prop4, 
        prop5, 
    }: HomeProps): JSX.Element {
        return (
            // ...
        )
    }
    <Home prop1="BBB" prop2={[20, 30]} prop4="CCC" props={[20, 30,'px']}  />
    ```
# interface
- 和type基本上一样，官方文档也说两者大部分情况都可互用
- `extends`关键字
    - ***`extend`的性能比type的`intersaction`好***
    - 交叉类型用的
    - 可以和type互相拓展，关键字也可以互相用（`extends`, `&`）
- 合并声明：
    - 定义了多个同名interface时，所有其中的键会被合并集中为一个interface，不会有error
    - 因此或可少用interface，避免不想要的合并
- 类可以实现（implements）type和interface
### type vs interface
- interface的使用场景：
    - 类接口、函数参数、state？
- type使用场景：
    - 复杂的Union Type
    - 各种变量

### tsconfig.json
- for pure ts project (no frame)
- e.g. backend in ts
- sample
    ```json
    {
        "compilerOptions": {
            "target": "ES6",            // 指定 TypeScript 编译后的 JavaScript 版本。ES6 表示 ECMAScript 2015。
            "module": "esnext",         // 指定生成的模块代码类型。esnext 表示使用最新的 ECMAScript 模块语法。
            "moduleResolution": "node", // 指定模块解析策略。node 表示使用 Node.js 的模块解析策略，用于适配node环境，即能够拥有正确使用node_modules、识别模块路径、能够识别更多后缀等features。
            "resolveJsonModule": true,  // 允许导入 JSON 文件，搭配上一条使用，因为需要让ts能够自动生成类型
            "rootDir": "./src",         // 指定输入文件的根目录。TypeScript 会从这个目录开始查找文件。
            "strict": true,             // 启用所有严格类型检查选项。包括 noImplicitAny, noImplicitThis, alwaysStrict 等。
            "esModuleInterop": true,    // 启用对 ES 模块默认导入的互操作性，以此兼容CommonJS模块中的默认导入，以让所有node_module正常运作。
            "experimentalDecorators": true // 启用对装饰器的实验性支持。
        },
        "include": ["src/**/*"] // 指定要包含在编译中的文件或目录。这里表示包含 src 目录下的所有文件和子目录。
    }
    ```



# Advanced features
### declare，.d.ts 与 模块命名空间加载
- `.d.ts`文件包含了供引擎/开发时识别的命名空间和对应类型定义
    - 可以理解为声明某个类有哪些属性和方法 及 其类型
- TypeScript 会自动解析以下内容，因为类型声明本就是是文件路径解析的一部分：
    - node_modules/@types/ 下的类型声明（全局或模块）。
    - tsconfig.json 中 "types" 指定的类型。
    - 项目中匹配 "include" 的 .d.ts 文件和里面声明的模块的.d.ts文件。
- 一般.d.ts文件有插件可以自动生成
- 用法
    - declare var/let/const 声明变量
        - 不过一般都是const，因为外部模块一般都不应该能够被修改
    - declare function 声明函数头
    - declare module 声明模块
        - 声明模块有啥和其类型，以及提供识别哪些文件是模块的通配符。让 TypeScript 支持非代码文件的导入（如 CSS Modules、图片文件）。
        - 对于每个模块都会尝试寻找同名的.d.ts文件来获取该模块导入后的类型和命名空间
        - 局部没有才去找全局的
    - declare class 声明类的属性和方法
    - declare enum 声明枚举类型
        - 纯类型声明，不会生成真实的枚举代码
    - declare const enum
        - 声明编译时常量枚举（内联到代码中，运行时不存在）。
    - declare namespace 声明（含有子属性的）对象
        - 用于组织代码。
        - 描述旧版 JavaScript 库的模块化结构（如 jQuery 的 $.ajax）。
        - 替代早期 TypeScript 的 module 关键字（现已推荐用 declare module）。
    - declare global 扩展全局作用域的类型。
    - declare interface / declare type 声明接口或类型
        - 通常可省略 declare
- 用export设置作用域
    - 如果没有export则默认全局，即该项目中任何地方都能使用。
    - 如果有export就必须通过import来使用
    - export 导出变量
    - export namespace 导出（含有子属性的）对象
    - export default ES6 默认导出
    - export = commonjs 导出模块
    - export as namespace UMD 库声明变量
    - declare global 扩展全局变量
    - declare module 扩展模块
    - `/// <reference />` 三斜线指令
- 比如`lib.es5.d.ts`里就有`JSON`模块、`parseInt`方法等

### T泛型
- type本身就是一种有很多语法糖的object，所以很多object操作是能够用在type上以实现非常多灵活的功能
- 一些nb的做法
    - 动态指定类型为某个类型集合中的哪些类型的Union type，还可以设置默认值为所有类型的Union type
        ```ts
        type Person = {
            name: string;
            age: number;
            address: string;
        };
        // 泛型函数，T 被约束为 Person 的键，默认是所有键
        function getProperty<T extends keyof Person = keyof Person>(obj: Person, key: T): Person[T] {
            return obj[key];
        }
        const person: Person = {
            name: "Alice",
            age: 30,
            address: "123 Main St"
        };
        // 显式指定 T 为 "name" | "age"
        getProperty<"name" | "age">(person, "name"); // OK
        getProperty<"name" | "age">(person, "age"); // OK
        getProperty<"name" | "age">(person, "address"); // 错误："address" 不在 "name" | "age" 中

        // 不指定 T，默认为 keyof Person（"name" | "age" | "address"）
        getProperty(person, "address"); // OK，因为 T 默认为所有键
        ```
### Symbol




