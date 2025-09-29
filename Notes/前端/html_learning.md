# General
- 用class做样式，用id做js事件绑定
- JSX中很多标签和属性都不一样，具体去看react_leanring
- HTML的模板和内容是不同的概念，模板是静态的，内容（无论由前端还是后端生成的）则可以动态插入加载

# HTML的概念
- 语义化
    - 代码结构up，更可读
    - 有助SEO
    - 方便各种设备的解析，有意思的例子包括无障碍功能能够更方便解析

# Tags
- `<pre>`
    - 保留内容的换行符、空格
    - 使用等宽字体显示内容
    - 可以用来展示日志、代码片段、预格式化文本啥的
- `<form>`
    - action: 请求路径，默认为当前路径
    - method: get, post, put
    - enctype: 当你的表单包含文件上传控件时（即包含`<input type="file">`），必须将表单的enctype属性设置为multipart/form-data。
    - target: 定义提交表单后，响应的显示位置。比如，_blank会在新窗口或新标签页中打开响应页面。
    - novalidate: 此布尔属性指示表单在提交时不应该进行验证。默认情况下，表单会在客户端进行验证。
    - autocomplete: 指定表单或表单字段是否应该启用自动完成功能。设置为on允许浏览器自动完成，设置为off则禁用自动完成。
    - name: 定义表单的名称。这个属性的值对于脚本和样式表是重要的，但不会被发送到服务器。
    - form submit
- `<input>`
    - type: 
        - text: 默认值。定义用于输入文本的单行字段。
        - password: 用于输入密码的字段，输入的字符会被遮蔽。
        - submit: 定义用于提交表单的按钮。
        - reset: 定义用于重置表单的按钮。
        - radio: 定义单选按钮。
        - checkbox: 定义复选框。
        - button: 定义可点击的按钮，但不提交表单。
        - file: 定义文件选择字段和“浏览”按钮，用于文件上传。
            - 加一个multiple的boolean tag就能多选文件
        - hidden: 定义不显示的输入字段，通常用于存储表单的某些数据。
        - image: 定义作为提交按钮的图像。
        - email: 用于应包含电子邮件地址的输入字段。
        - date: 用于应包含日期的输入字段。
        - color: 用于选择颜色的输入字段。
        - number: 用于应包含数值的输入字段。
    - name: 
        - 定义输入控件的名称，所有输入控件都可以用，会在submit时以name为键发出用户的输入值
        - query string: `[ori_url]?name1=value1&name2=value2`
    - value: 
        - 定义输入字段的初始值。
    - placeholder: 
        - 提供输入字段预期值的提示。
    - required: 
        - 规定输入字段是必填的。
    - disabled: 
        - 规定输入字段是禁用的。
    - readonly: 
        - 规定输入字段是只读的。
    - autocomplete
        - ="on/off/[tokens]"
        - 允许浏览器自动填充。tokens是可选的提示关键字，让浏览器知道填什么进去
    - input会默认成为query string被写入http请求
    - 上传文件的话，会用form-data header+对应文件body来处理http请求：
        - eg 
        ```
        POST /upload HTTP/1.1
        Host: www.example.com
        Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
        Content-Length: 138

        ------WebKitFormBoundary7MA4YWxkTrZu0gW
        Content-Disposition: form-data; name="file"; filename="example.txt"
        Content-Type: text/plain

        (file content)
        ------WebKitFormBoundary7MA4YWxkTrZu0gW--
        ```
- `<label>`
    - for="`<input>`'s name attr"
- `<select>` & `<option>`
    - name: 
        - 定义下拉列表的名称。
    - multiple: 
        - 允许用户选择多个选项。
    - required: 
        - 规定用户必须选择一个选项。
    - size: 
        - 规定下拉列表中可见选项的数目。
    - sample: 
        <select name="cars" id="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
        </select>
        ```
        <select name="cars" id="cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
        </select>
        ```
- `<textarea>` 
    - 用于多行文本输入
- `<button>`
    - 用于点击按钮。虽然&lt;input>也可以定义按钮（&lt;input type="button">、&lt;input type="submit">、&lt;input type="reset">），&lt;button>元素则提供了更丰富的内容定制能力，比如，你可以在&lt;button>标签中放入HTML内容（如图标加文字）。
    - 默认样式: border, cursor, bg-color, text-color, padding, focus-outline
- `<fieldset>` 
    - 用于将表单内的相关元素分组。&lt;fieldset>元素将表单内的相关元素分组，通常用于表单的不同部分，以便于表单的组织和设计。&lt;legend>元素为&lt;fieldset>定义标题。
- `<legend>`
    - 用于为&lt;fieldset>元素定义标题。&lt;legend>元素为&lt;fieldset>元素定义标题，帮助用户理解表单的不同部分的用途。
- `<optgroup>`
    - 用于将&lt;select>列表中的相关&lt;option>元素分组。


- `<head>`
    - defer：脚本异步加载，按顺序执行，在文档解析完成后执行。
    - async：脚本异步加载，加载完成后立即执行，执行顺序不保证。
- `<img>`
    - loading属性决定加载行为
        - lazy表示懒加载
        - eager表示立刻加载，为默认值

- `data-xxxx`
    - HTML5引入的自定义数据属性


# web components
- basically 就是浏览器原生的供开发者自定义模块化元素的api。不需要额外的框架
- web component被常见框架兼容
### Custom Elements（自定义元素）
- eg
```js
// 定义自定义元素
class MyButton extends HTMLElement {
constructor() {
    super();
    this.addEventListener('click', () => {
        console.log('Button clicked!');
    });
}
}
customElements.define('my-button', MyButton);
```
```html
<!-- 使用自定义元素 -->
<my-button>Click Me</my-button>
```
### Shadow DOM（影子 DOM）
- 制造一个隔离的dom树
- 因此样式会互相隔离
- 每个影子DOM都是独立的新的dom树
- eg
```js
class MyComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
        <style>
            p { color: red; } /* 仅在此影子 DOM 内生效 */
        </style>
        <p>我是第一个影子 DOM</p>
        `;
    }
}
customElements.define('my-component', MyComponent);
```
```html
<!-- 使用影子DOM -->
<my-component>bruh</my-component>
```
### HTML Templates（HTML 模板）
- 创建可复用的模板
- eg
```html
<template id="user-card">
    <div class="card">
        <h2><slot name="name">Default Name</slot></h2>
        <p><slot name="email">default@example.com</slot></p>
    </div>
</template>
```
```js
// 使用模板
const template = document.getElementById('user-card');
const clone = template.content.cloneNode(true);
document.body.appendChild(clone);
```
### HTML Imports
- 早期用于导入外部 HTML 文件，现已被现代模块化方案（如 ES Modules）取代。
- 支持度有限
- 在script中定义好template或者自定义元素，script导入就行了
- eg
```html
<!-- 导入外部 HTML 文件 -->
<link rel="import" href="my-component.html">
```


# Other
- 不间断空格：`&nbsp`