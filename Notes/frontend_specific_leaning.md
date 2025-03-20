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


# 前端指标
### 硬性指标
- 可访问性/响应性（Accessibility/Responsiveness）
    - 定义：页面是否对所有用户友好，包括残障人士。
    - 解释：确保页面支持屏幕阅读器、键盘导航、不同屏幕尺寸显示，并提供足够的对比度和文本描述。
- 页面加载时间（Page Load Time）
    - 定义：页面加载所需时间。
    - 解释：加载时间过长会导致用户流失，需优化性能。
- 用户留存/流失率（User Retention Rate）
    - 定义：用户是否会再次访问。
    - 解释：高留存率表明页面设计成功吸引用户。
- 任务完成率（Task Success Rate）
    - 定义：用户完成目标行为的比例。
    - 解释：如注册、购买等，高任务完成率表明页面设计有效。
- 用户任务时间（User Task Time）
    - 定义：用户完成任务所需时间。
    - 解释：时间越短，页面设计越高效。
- 错误率（Error Rate）
    - 定义：用户操作中的错误频率。
    - 解释：低错误率说明页面设计清晰，用户不易犯错。
- 用户错误恢复时间（User Error Recovery Time）
    - 定义：用户从错误中恢复所需时间。
    - 解释：恢复时间越短，页面设计越友好。
- 用户参与深度（User Engagement Depth）
    - 定义：用户与页面的互动深度。
    - 解释：如浏览页面数量、停留时间、评论、分享按钮等，反映用户参与度。



- 信息层面
9. 学习曲线（Learning Curve）
定义：用户掌握页面操作的难易程度。
解释：学习曲线越平缓，用户越容易上手。
11. 信息架构（Information Architecture）
定义：信息组织是否合理。
解释：清晰的信息架构帮助用户快速找到所需内容。
12. 导航效率（Navigation Efficiency）
定义：用户能否快速找到目标页面。
解释：高效的导航设计减少用户点击次数，提升体验。
13. 内容可读性（Content Readability）
定义：内容是否易于阅读。
解释：合适的字体、字号、行距和对比度提升可读性。
18. 用户控制感（User Control）
定义：用户是否感到能控制页面。
解释：提供撤销、返回等功能，增强用户控制感。
1. 可用性（Usability）
定义：用户能否轻松完成任务。
解释：页面应直观易用，用户无需复杂操作即可找到所需信息或功能。




- 艺术层面
4. 一致性（Consistency）
定义：页面设计是否保持一致。
解释：统一的字体、颜色、按钮样式等有助于用户快速熟悉界面。
10. 情感设计（Emotional Design）
定义：页面设计是否能引发用户积极情感。
解释：通过色彩、图像、动画等元素提升用户体验。
15. 美学吸引力（Aesthetic Appeal）
定义：页面视觉是否吸引人。
解释：美观的设计提升用户的第一印象和留存率。
17. 品牌一致性（Brand Consistency）
定义：页面设计是否符合品牌形象。
解释：一致的品牌元素增强用户对品牌的认知和信任。
3. 视觉层次（Visual Hierarchy）
定义：页面元素是否按重要性排列。
解释：通过大小、颜色、对比度等设计手段，引导用户关注重要内容。



- 用户行为层面
23. 用户反馈（User Feedback）
定义：用户对页面的直接评价。
解释：通过调查、评论等收集用户意见，指导优化。
24. 用户行为分析（User Behavior Analysis）
定义：通过数据分析用户行为。
解释：了解用户在页面上的操作路径，优化设计。
25. 用户满意度评分（User Satisfaction Score）
定义：用户对页面的评分。
解释：通过评分系统量化用户满意度。
28. 用户信任度（User Trust）
定义：用户对页面的信任程度。
解释：通过安全标识、隐私政策等增强用户信任。
29. 用户推荐率（User Referral Rate）
定义：用户推荐页面的比例。
解释：高推荐率表明页面设计成功。
6. 用户满意度（User Satisfaction）
定义：用户对页面的整体感受。
解释：通过用户反馈、调查等方式了解用户是否对页面满意。
14. 交互反馈（Interactive Feedback）
定义：用户操作后是否有及时反馈。
解释：如按钮点击后的状态变化，帮助用户确认操作成功。

