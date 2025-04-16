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
    - 泛型`<T>`
        - 感觉就是用来声明某两个位置的类型将会是一样的，但具体是什么类型则无所谓
        - eg `function toArray<T>(attr: T): T[] {return [attr];}`
    - 组合type：`XXXX<yyy>`
        - 有点类似“指定XXXX接收yyy类型的参数”
        - eg `const aMap: Map<number, number> = new Map([[1, 2], [2, 3]])`
        - eg `const [a, setA] = useState<number>(0)`
    - `Omit`: 取B在A的补集（complementary）
        ```ts
        type AAA = {
            id: string;
            name: string;
            uid: number;
        };
        type BBB = Omit<AAA, "name" | "uid">
        ```
    - `Record`
        - 动态添加type
        - 一般用于给object定义类型
        ```ts
        type AAA = Record<string, number>;
        const BBB: AAA = {
            id: 1, 
            age: 18,
        }
        ```
- React的type
    - `JSX.Element`/`React.ReactNode`
        - children就是`React.ReactNode`
    - `FunctionComponent<<propType>>`
        - 就是一般react会导出的那个组件，可以指定`<propType>`
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
- type的操作
    - 导入导出
        - `export type { aType };`
        - `import type { aType };`
    - 交叉类型 Intersection Types（拓展type）
        - `type TB = TA & TC;`
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
### declare，.d.ts
### T
### Symbol




