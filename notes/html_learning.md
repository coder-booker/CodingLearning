# HTML syntax

### General
- 用class做样式，用id做js事件绑定
- JSX中很多标签和属性都不一样，具体去看react_leanring
- HTML的模板和内容是不同的概念，模板是静态的，内容（无论由前端还是后端生成的）则可以动态插入加载

### &lt;form>
- action: 请求路径，默认为当前路径
- method: get, post, put
- enctype: 当你的表单包含文件上传控件时（即包含&lt;input type="file">），必须将表单的enctype属性设置为multipart/form-data。
- target: 定义提交表单后，响应的显示位置。比如，_blank会在新窗口或新标签页中打开响应页面。
- novalidate: 此布尔属性指示表单在提交时不应该进行验证。默认情况下，表单会在客户端进行验证。
- autocomplete: 指定表单或表单字段是否应该启用自动完成功能。设置为on允许浏览器自动完成，设置为off则禁用自动完成。
- name: 定义表单的名称。这个属性的值对于脚本和样式表是重要的，但不会被发送到服务器。

### &lt;input> 
- type: 
    - text: 默认值。定义用于输入文本的单行字段。
    - password: 用于输入密码的字段，输入的字符会被遮蔽。
    - submit: 定义用于提交表单的按钮。
    - reset: 定义用于重置表单的按钮。
    - radio: 定义单选按钮。
    - checkbox: 定义复选框。
    - button: 定义可点击的按钮，但不提交表单。
    - file: 定义文件选择字段和“浏览”按钮，用于文件上传。
    - hidden: 定义不显示的输入字段，通常用于存储表单的某些数据。
    - image: 定义作为提交按钮的图像。
    - email: 用于应包含电子邮件地址的输入字段。
    - date: 用于应包含日期的输入字段。
    - color: 用于选择颜色的输入字段。
    - number: 用于应包含数值的输入字段。

- form submit
    - input会成为query string被写入http请求
    - 上传文件：
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


### &lt;label>
- for="&lt;input>'s name"

### &lt;select> & &lt;option>
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

### &lt;textarea> 
用于多行文本输入。&lt;textarea>元素定义了一个多行的文本输入控制，可以输入更多的文本比&lt;input type="text">，是理想的用于需要多行输入的场合，如评论框或文章发布。

### &lt;button>
- 用于点击按钮。虽然&lt;input>也可以定义按钮（&lt;input type="button">、&lt;input type="submit">、&lt;input type="reset">），&lt;button>元素则提供了更丰富的内容定制能力，比如，你可以在&lt;button>标签中放入HTML内容（如图标加文字）。
- 默认样式：
    - 边框：通常有一个默认的边框。
    - 背景颜色：通常是灰色或白色。
    - 文本颜色：通常是黑色。
    - 内边距：通常有一些默认的内边距。
    - 字体：通常使用系统默认字体。
    - 光标：悬停时光标变为指针（手形）。
    - 焦点样式：当按钮获得焦点时，通常会有一个轮廓（outline）
    - commonly to customize, simply write `border: none;background-color: none;`

### &lt;label>
用于定义&lt;input>元素的标签。&lt;label>提高了用户界面的可用性，因为点击标签时，会将焦点移动到和标签相关联的&lt;input>元素上。通过for属性与输入元素的id属性关联起来。

### &lt;fieldset> 
用于将表单内的相关元素分组。&lt;fieldset>元素将表单内的相关元素分组，通常用于表单的不同部分，以便于表单的组织和设计。&lt;legend>元素为&lt;fieldset>定义标题。

### &lt;legend>
用于为&lt;fieldset>元素定义标题。&lt;legend>元素为&lt;fieldset>元素定义标题，帮助用户理解表单的不同部分的用途。

### &lt;optgroup>
用于将&lt;select>列表中的相关&lt;option>元素分组。


# &lt;head>
- defer：脚本异步加载，按顺序执行，在文档解析完成后执行。
- async：脚本异步加载，加载完成后立即执行，执行顺序不保证。

# data-x
- HTML5引入的自定义数据属性
- 主要作用：自定义属性和给js访问

