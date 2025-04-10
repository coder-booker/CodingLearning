
# experience
- body
    - max-width: 100vw;：将 body 元素的最大宽度设置为视口宽度的 100%。这意味着 body 元素的宽度不会超过视口的宽度。  
    - overflow-x: hidden;：隐藏 body 元素在水平方向上的溢出内容。如果 body 元素的内容超出了视口的宽度，超出的部分将不会显示。
- a: 
    - color: inherit;
    - text-decoration: none;
- :root:  
    - 全局定义固定的颜色var，可以加上rgb参数版本来方便调透明度
- text
    - 根据字体大小决定容器大小: 不设置width和height，只设置font-size和padding+box-sizing就可以
    - 粗体化: `<b></b>`和`font-weight: `结合可以实现部分文本的自定义大小粗体化，而无需使用`<span></span>`
- 均匀排列
    - flex + gap
    - 猫头鹰选择器: `* + *`，或者 `<xxx> + <xxx>`
- decoration用的一些字段
    - `cursor: pointer`
    - `border-radius: 50%`
- 屏蔽交互实现
    - html标签声明`disabled`，然后用`:disabled`选择器来捕获
    - 常见做法是同时配合 `cursor: not-allowed;`和背景颜色设置

# 奇怪的概念
- BFC (Block Formatting Context)
    - 就是把某个盒子和外部完全独立
        - 因为本来会有margin塌陷问题，BFC时就不会了
    - 能够清除浮动
        - 父级BFC可以识别子float的高度
    - 文档的根元素（`<html>`）。其实就是第一个BFC
    - 创建方法
        - `display: flow-root`
        - overflow不为visible，如auto、hidden


# selector选择器
- css选择器优先级
    - 总顺序
        1. `!important`会覆盖页面内任何位置的元素样式，权值为正无穷
        2. 内联样式，如`style="color: green"`，权值为1000
        3. ID选择器，如`#app`，权值为0100
        4. 类、伪类、属性选择器，如`.foo`, `:first-child`, `div[class="foo"]`，权值为0010
        5. html标签、伪元素选择器，如`div::first-line`，权值为0001
        6. 通配符、子类选择器、兄弟选择器，如`*`, `>`, `+`，权值为0000
        7. 继承的样式没有权值
    - 权值计算：
        - 一行选择器的优先级 = ABCD
        - 如果存在内联样式，那么 A = 1, 否则 A = 0
        - B 的值等于 ID选择器出现的次数
        - C 的值等于 类选择器 和 属性选择器 和 伪类 出现的总次数
        - D 的值等于 标签选择器 和 伪元素 出现的总次数
        - eg `.main .123[class="foo"]`中，A=0，B=0，C=3，D=0，最终权值为0030
    - 权重相同的情况下，后者覆盖前者
    - 权值其实是256进制的
- 所有空格分隔的选择器都是上下级，所有无空格的选择器都是concurrent关系
    - 因此其实常用的伪类选择器也是无空格的concurrent级
    - e.g. `.AAA.BBB`是选中同时拥有AAA和BBB class的元素，`.AAA .BBB`是上下级关系
    - e.g. `.AAA :focus`可以一次性选中所有AAA的子元素的focus样式
- 各种选择器
    - ID选择器，如`#app`
    - 类、伪类、属性选择器，如`.foo`, `:first-child`, `div[class="foo"]`
        - 伪类选择器：选择处于特定状态的元素，比如`:hover`、`:invalid`、`:focus`
    - html标签、伪元素选择器，如`div::first-line`
        - 伪元素选择器：无法用 HTML 语义表达的抽象实体，如同往标记文本中加入全新的 HTML 元素一样。
    - 通配符、子类选择器、兄弟选择器，如`*`, `>`, `+`
        - `a ~ b `在a标签后任意位置的b兄弟标签
        - `a + b`紧贴在a标签后的b兄弟标签
        - `a || b`列选择器：匹配表格行的，a标签作用域中的所有b标签
    - `a:`伪类选择器：按照未被包含在文档树中的状态信息来选择元素。
- 有意思的pattern
    - 猫头鹰选择器: `* + *`，或者 `xxx + xxx`

# css module
- `:global(.className)`用来在`.module.css`中对全局施加样式，也就是去除哈希值

# 盒模型
- 关乎以下四项内容
    - 外边距 margin
    - 边框 border
    - 滚动条 scroll bar
    - 内边距 padding
    - 内容 content
- 有两种盒模型
    - W3C 标准盒子模型
        - box-sizing: content-box
        - 只算content的宽高，不包含border到padding
    - IE 怪异盒子模型
        - box-sizing: border-box
        - 算上border，当然也算上其内的滚动条和padding
# 各种attr
- 这些属性在不同浏览器会有很多很多不同行为，因此大概知道意义就好了
- client
    - 不变
    - clientWidth/Height
        - 可视范围，也就是内容的宽高
        - 包含内边距的宽/高，不包含滚动条
    - clientTop/Left
        - clientWidth/Height 之外的和border外缘的距离，或者说border上边/左边的宽度
- offset
    - 不变
    - offsetWidth/Height
        - 包含边框、滚动条、padding的宽高
    - offsetTop/Left
        - 相对于offetParent的位置
        - offsetWidth/Height之外的 和 parent border内缘/padding外缘的宽度，或者offsetParent的padding宽度 + 子元素margin宽度
        - 如果子元素溢出了，溢出的部分是会算进offsetTop/Left里的。例如未滚动时，最底下的子元素的offsetTop和scrollHeight差不多且不会改变
    - offsetParent
        - position不为static(默认值)的最近父级元素
        - 最顶头的定位过的元素是body，所以没有被定位过的父级的话offsetParent会指向body
        - 如果元素本身是fixed那自然也没有任何父级，offsetParent返回null
- scroll
    - 变
    - scrollWidth/Height
        - 包含溢出部分的元素内容宽高
            - 所以在没有溢出时，scrollWidth/Height === clientWidth/Height
        - 包含滚动条宽高
        - 不包含内边距
    - scrollTop/Left
        - 子元素实际内容上/左边缘和子元素可见内容上/左边缘的距离
        - 一般溢出滚动了才会变，不然大部分时候都是0
- 单位
    - 绝对单位
    - 相对单位：
        - em：相对父元素字体大小的y倍 -> yem
        - rem：相对根元素(<html>)的字体大小的y倍 -> yrem
        - ex、ch：当前1em下的x的高度、0的宽度的y倍 -> yex、ych
        - vh、vw：视窗的高度和宽度的百分之y -> yvh、yvw
        - vmin、vmax：min or max(vh, vw) 的百分之y;
    - 百分比单位：
        - 基于父级块的***宽度***计算的百分比
            - `margin` 和 `padding`
            - `top`, `right`, `bottom`, `left`
        - 基于自身宽高计算百分比
            - `transform`: `translateX` 和 `translateY`
        - 基于背景区域的宽高，且控制的是背景图片的中心点
            - `background-position`
- `background`
    - `background-color`:
        - 透明：rgb设置第四个参数，[0.0, 1.0]
        - 渐变：`background-image: linear-gradient(to bottom, transparent 20%, blue 40%, blue 60%, transparent 80%);`
    - `background-position`: 
        - 控制背景图片的中心点
- `float`
    - 浮动元素前的块会顶开浮动元素，后的块则会被覆盖。
        - 当然如果float方向不会覆盖到后面的块自然不会影响显示后面的块，只是位置会不同：float被顶开的距离只会计算前面块，后面的块会被忽略
    - 清除浮动：设置**块状**clear的空**后**兄弟元素撑起父容器，具体left/right/both再判断
        - 伪元素`:after`、空div都可以
        - 注意clear的含义其实就是不允许某个方向上有元素浮动，所以float的left和right与clear的left和right注意需要互相对着
            - 比如float在前且float:left，你后面的元素clear:right是没用的
            - 此外，因为float前的块会顶开float，对前块设置clear没用
- 文本
    - 垂直居中：
        - `line-height`和`height`一样
        - 行内元素使用`vertical-align`
        - flex使用center
    - `text-transform`可以修改用css修改文字
        - `capitalize`
        - `lowercase`
    - `word-wrap`, `word-break`, `text-wrap`
        - `word-wrap`: 当过长时，对尾部的最后一个单词整体往下换行还是截断。默认不会截断。(`normal`, `break-word`)
        - `word-break`：当过长时，对尾部的最后一个单词整体截断还是换行。(`normal`, `break-all`, `keep-all`(在符号或空格处截断))
        - `text-wrap`: `wrap`（word整体换）, `nowrap`（不换）, `balance`（word整体换且让每一行差不多长）
- `transform`
    - `translateX`
    - `translateY`

- **calc符号间要空格！！！**

- `width`, `height`
    - `body`和`html`也是块状元素，因此宽度为100%，高度为内容决定
    - 一些比较有意思的值：
        - `height: auto;` 代表自动撑开
        - `width: max-content;` 使用子元素/文字的最大长度来设定width（完全不换行，可以理解为nowrap的长度）
        - `width: min-content;` 使用子元素/文字的最小长度来设定width（每个字都换行，可以理解为用最长的不可分割字符来作为长度）
        - `width: fit-content;` 不超出容器，如超出就正常换行
- `display`: 
    - 非`block`/`inline-block`无法设w h
    - flex父元素会把所有子元素的`display`变成"flex子元素"(注意不是flex元素)，以此移除所有原特性
    - flex子元素不会融合外部margin
- `position`
    - `static`：默认值
    - `relative`
    - `absolute`
    - `fixed`
- box 盒子
    - `box-shadow`: 
        - [horizontal_offset] [vertical_offset] [blur_radius] [spread_radius] [color];
    - `box-sizing`: 
        - `border-box`, 怪异盒子模型
- `color`: 
    - 灰度应该叫亮度，因为255是最亮（白色）
- `image`: 
    - `object-fit`
        - `contain`; 不裁剪，保留比例缩放
        - `cover`; 裁剪，保留比例缩放
    - 用相对路径加载本地资源："/public/pictures/nam_of_picture.jpg"
- `overflow`:
    - `visible` - default
    - `hidden`
    - `scroll` - constantly display
    - `auto` - display when overflow
    - 只要不是visible，都能把容器变成BFC
- flex 
    - `margin: auto`会尽可能分配多的空间，所以可以用来置左置右置顶置底
        - 和`justify-content`+`align-items`不太一样，`margin`以单个子元素为单位，jus和ali以整个容器里的元素为单位
    - `gap`
        - `row-gap`
        - `column-gap`
    - `flex-grow`
        - 有剩余空间时，子元素按什么比例分配剩余空间。
        - possible value: 
            - 0 (default): 不会分配，由子元素自己撑大
            - other: 取决于所有子元素的flex-grow之间的比例
        - 计算公式：子元素A增加的空间 = 父元素剩余空间 x (A-flex-grow/(sum-ABC-flex-grow))
            - 因此与比例相关，只要不是0都挺复杂
    - `flex-shrink`
        - 有溢出空间时，子元素按什么比例缩小
        - possible value: 
            - 1 (default)
            - 0: 不分配
        - 子元素`flex-shrink`相加＞=1时，就把溢出空间按比例分配给子元素，行为类似`flex-grow`
        - 子元素`flex-shrink`相加 < 1时, 则根据自己的空间而非溢出空间缩小
    - `flex-basis`: 
        - `max-width`/`min-width` > `flex-basis` > `width` > box
    - flex: 1
        - 类似于这个子元素在父元素占的空间的权重，全是1就代表平分空间，而不是由子元素的子元素撑开
        - 也就是说，对于row的flex direction，flex: 1就是平分宽度

- `filter` 滤镜，可以用在图片上
    - `invert(1)`
    - `grayscale(1)`
    - `invert(1) `
    - `brightness(1.5);`

- `aspect-ratio`
    - 对`block`的宽高比例进行设定
    - 宽高任意一个需要被指定，另一个要设为`auto`
    - 以`box-sizing`所指向的宽高为宽高
    - e.g. `aspect-ratio: 16/9;`

- `outline`
    - border外的另一个border
    - 不占空间，因此不会当成width和height
    - 所有默认outline都是focus时才会显示，一般用于链接、表单组件
    - `outline: [color] [style] [width];`

- `:disabled`
    - html标签声明这个属性可以用css来捕获
    - 常见做法是同时配合 `cursor: not-allowed;`和背景颜色设置

- 自定义属性
    - on tag, write `data-[name]`，可以使用`aaaa[data-xxx="yyy"]`的选择器来捕获