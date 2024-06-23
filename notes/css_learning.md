单位
    绝对单位
    相对单位：
        em：相对父元素字体大小的y倍 -> yem
        rem：相对根元素(<html>)的字体大小的y倍 -> yrem
        ex、ch：当前1em下的x的高度、0的宽度的y倍 -> yex、ych
        vh、vw：视窗的高度和宽度的百分之y -> yvh、yvw
        vmin、vmax：min or max(vh, vw) 的百分之y;

背景颜色
    透明：rgb设置第四个参数
    渐变：background-image: linear-gradient(to bottom, transparent 20%, blue 40%, blue 60%, transparent 80%);

文本
    垂直居中：line-height和height一样就可以居中

css mudule
    :global(.className)：可以且仅可以去除这个class渲染后的哈希

display: 
    非block/inline-block无法设w h
    flex父元素会把所有子元素的display变成flex子元素，以此移除所有原特性
    flex子元素不会融合外部margin

根据字体大小决定大小
    不设置width和height，只设置font-size和padding+box-sizing就可以