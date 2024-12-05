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
        - 内边距+滚动条 padding
        - 内容 content
    - 有两种盒模型
        - W3C 标准盒子模型
            - border-box: content-box
            - 只算content的宽高
        - IE 怪异盒子模型
            - border-box: border-box
            - 算上border
            - 包含滚动条，因为border包含着滚动条
- 这些属性在不同浏览器会有很多很多不同行为，因此大概知道意义就好了
- client
    - clientWidth/Height
        - 可视范围的宽高
        - 包含内边距的宽/高，不包含滚动条
- offset
    - offsetParent
        - position不为static(默认值)的最近父级元素
        - 最顶头的定位过的元素是body，所以没有被定位过的父级的话offsetParent会返回body
        - 如果元素本身是fixed那自然也没有任何父级，offsetParent返回null
    - offsetWidth/Height
        - 包含边框的宽高
    - offsetTop/Left
        - 相对于offetParent的位置
        - offsetParent的内边距宽度+元素外边距宽度，也就是parent边框内缘到元素边框外缘的宽度
        - top用上缘，left用左缘
- scroll
    - scrollWidth/Height
        - 包含溢出部分的元素宽高
        - 包含滚动条宽高
        - 不包含内边距
    - scrollTop/Left
        - 元素实际上/左边缘和元素可见上/左边缘的距离
        - 一般溢出滚动了才会变，不然大部分时候都是0

