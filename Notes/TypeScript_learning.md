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

# Syntax
### 操作符
    - `?:` optional props of interface or class or sth
    - `!.` 非空断言符
    - `?.` 可选链操作符
    - `boolean && function()` 如true则调用function()
### react中的操作
- basic
    ```ts
    function Home(props: { prop1: string, prop2: number }): JSX.Element{}
    // or
    function Home({
        prop1,
        prop2,
    }: {
        prop1: string;
        prop2: number;
    }): JSX.Element {}

    // use
    <Home prop1="asd" prop2={20}  />
    ```
### class
- 用构造函数定义属性（规范）
    ```ts
    class Person {
        constructor(public firstName: string, public lastName: string) {}
    }
    ```


- add `[]` after type key words make them an array
    - but write type key words in `[]` make them **tuple**. i.e. specified **length** and **type** of every elements in it

### type
- type guard：
    - 如果某值不允许undefined，只要用任何方法排除undefined的情况即可，哪怕不是在那个花括号内，而是在父元素排除的都可以
    - 或者用`xxxx.yyyy!;`，强行声明不可能undefined
- `any`/`unknown` 任何类型都可
    - 区别是unknown类型的变量在被使用前强制要求二次断言好unknown
- `string`, `number`, `boolean`, `enum`
    - `enum`就是多个常量同时枚举，可以用自带的数字值枚举、字符串枚举、或者自己指定的异构枚举
- `JSX.Element` 一般在react里是implied的，不用特地写
- Union type：`string | string[]`, allow multiple types. 
    - However, type specific operation will cause error. 
    - e.g. `string.substring()`不能被用在`number`上，因此`string | number`的变量不能使用`.substring()`
- 元组类型
    - 用来固定数组每个元素的类型
    - eg
        ```ts
        const arr: [string, number] = ['123', 123];
        ```
- 泛型`<T>`
    - 感觉就是用来声明某两个位置的类型将会是一样的，但具体是什么类型则无所谓
    - eg
        ```ts
        function toArray<T>(attr: T): T[] {
            return [attr];
        }
        ```
- type导入导出
    - eg
        ```ts
        // 导出
        export type { aType };
        // 导入
        import type { aType };
        ```
- basic:
    ```ts
    type Letter = "AAA" | "BBB" | "CCC"
    type HomeProps = {
        // 不用分号也行
        prop1: Letter;
        prop2: number[];
        prop3?: boolean;
        prop4: Letter;
        prop5: [number, number, string];
    }
    function Home({
        prop1,
        prop2,
        prop3,
        prop4, 
        prop5, 
    }: HomeProps
    ): JSX.Element {
        return (
            // ...
        )
    }
    <Home prop1="BBB" prop2={[20, 30]} prop4="CCC" props={[20, 30,'px']}  />
    ```
    function
    ```ts
    type AAA = {
        onClick: (i: number) => number;
        bruh: () => void;
        bruh2: Function; //似乎不怎么用
    }
    
    ```
- 交叉类型 Intersection Types（拓展type）
    ```ts
    type AAA = {
        id: string;
        name: string;
    }

    type BBB = AAA & {
        uid: string;
        name: number;
    }
    ```
- `Omit`: 交叉类型，但是删除版
    ```ts
    type AAA = {
        id: string;
        name: string;
        uid: number;
    };
    type BBB = Omit<AAA, "name" | "uid">
    ```
- Record
    - 动态添加type
    - 一般用于给object定义类型
    ```ts
    type AAA = Record<string, number>;
    const BBB: AAA = {
        id: 1, 
        age: 18,
    }
    ```
- react的type
    - `children`关键字，接收子元素
    ```ts
    function AAA({ 
        children
    }: {
        children: React.ReactNode
    }) {
        return <div>{children}</div>
    };
    // 此处的bruh会被传入children
    <AAA>bruh</AAA>
    // 此处的<a>aaa</a>会被传入children
    <AAA><a>aaa</a></AAA>
    // 如果不使用children
    <AAA />
    ```
    - `React.ReactNode`
        - 万用，啥都可以
        - 最常用
    - `JSX.Element`
        - 不接受text，只有<>包住的才是
    - Hooks的type
        - 直接悬停查看，然后复制比较好
        - 例如 `useState(0)`的`setXXX`函数的类型是`React.DIspatch<SetStateAction<number>>`
        - `useState<string>("");`
    - Event
        - `React.ChangeEvent<HTMLInputElement>`
        - focus: `change: React.FocusEvent<HTMLInputElement>`
        - key pressed: `React.KeyboardEvent<HTMLInputElement>`
        - click: `React.MouseEvent<HTMLButtonElement, MouseEvent>`
        - form submit: `React.FormEvent<HTMLFormElement>`
- style
    ```ts
    type HomeStyle = {
        style: {
            // 注意是分号不是逗号
            backgroundColor: string;
            color: string;
        }
    }
    ```
    or 直接允许所有CSS元素
    ```ts
    type HomeStyle = {
        style: react.CSSProperties;
    }
    ```
    then
    ```ts
    function Home({
        style
    }: HomeStyle
    ): JSX.Element {
        return (
            // ...
            style;
            // ...
        )
    }
    <Home 
        style={
            prop1="BBB", 
            prop2={[20, 30]}, 
            prop4="CCC",
            props={[20, 30,'px']},  
        }  
    />
    ```

### interface
- 和type基本上一样，官方文档也说两者大部分情况都可互用
- 交叉类型要用`extends`关键字
    ```ts
    interface AAA {
        id: string;
        name: string;
    }

    interface BBB extends AAA {
        uid: string;
        name: number;
    }
    ```
- `extend`的性能比type的`intersaction`好
- 定义了多个同名interface时，所有其中的键会被合并集中为一个interface，不会有error
    - 因此或可少用interface，避免不想要的合并
- 可以和type互相拓展
- interface多用于类外部接口，type多用于union type


### 装饰器
- 记住，装饰器本质上就是个高阶函数的语法糖
- 装饰器会隐性传入被调用者的this
- tsconfig中指定`"experimentalDecorators": true`
- 对于独立函数的装饰器需要特殊处理，因为里面的this在严格模式下是undefined
- e.g.
```ts
// target: any：调用 被装饰方法 的对象实例的prototype
// propertyName/propertyKey: string | symbol：方法名
// descriptor: PropertyDescriptor：被装饰者的属性描述。value属性就是被装饰者的具体内容
function catchErrors(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    // 先把原方法保存下来，以方便修改
    const method = descriptor.value;

    // 修改被装饰者的方法内容
    descriptor.value = async function (...args: any[]) {
        try {
            return await method.apply(this, args); // this 调用 被装饰方法 的对象实例
        } catch (error) {
            console.error(error);
        }
    };
    // 返回被装饰者
    return descriptor;
}

const fetchData = catchError((async function () {
    // 模拟一个可能抛出错误的异步操作
    throw new Error('Fetch failed');
}));
// 等价于
@catchError
function fetchData() {
    throw new Error('Fetch failed');
}

fetchData(); // 此处调用就相当于descriptor()
```

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





