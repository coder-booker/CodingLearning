# 图片懒加载
- HTML内置属性loading=lazy，让图片在滚动到元素附近时才加载
    - <img source='/xxx.jpg' loading='lazy' alt=''>
- js实现进入视窗再加载
    - 对比元素offsetTop是否小于scrollTop和clientHeight，是的话代表进入了视窗，开始加载
- IntersectionObserver
    - 浏览器内置的解决"判断元素是否在视窗内"问题的API


# 宽高
- 盒模型
    - 关乎以下四项内容
        - 外边距 margin
        - 边框 border
        - 滚动条 scroll bar
        - 内边距 padding
        - 内容 content
    - 有两种盒模型
        - W3C 标准盒子模型
            - border-box: content-box
            - 只算content的宽高，不包含border到padding
        - IE 怪异盒子模型
            - border-box: border-box
            - 算上border，当然也算上其内的滚动条和padding
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

# 浏览器
- sessionStorage和localStorage的区别
    - sessionStorage：
        - 生命周期：页面会话期间有效，关闭页面后数据被清除。
        - 作用域：仅在当前标签页有效。
    - localStorage：
        - 生命周期：永久存储，除非手动清除。
        - 作用域：跨标签页共享。

# 前端加密
- 就是让前端的js完成类似https的加密流程
- 但是性能和安全性受限，比如密钥容易泄露