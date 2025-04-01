# 图片懒加载
- HTML内置属性loading=lazy，让图片在滚动到元素附近时才加载
    - <img source='/xxx.jpg' loading='lazy' alt=''>
- js实现进入视窗再加载
    - 对比元素offsetTop是否小于scrollTop和clientHeight，是的话代表进入了视窗，开始加载
- IntersectionObserver
    - 浏览器内置的解决"判断元素是否在视窗内"问题的API


# 前端工程化
- 就是对前端项目进行以下操作
    - 编译
        - 把类似Typescript和Sass的高级语言编译成最基础的js
    - 打包
    - 优化
        - Tree-shaking
            - 一种减少代码体积的技术，通过静态分析代码依赖关系来移除代码中其实不会被使用的部分
            - 在ES2015/ES6中引入
        - Code Split
            - 按需加载代码
    - 资源管理
    - 提供开发服务器(Optional)
- 现代常用的构建工具
    - Babel：用来把ES6+的代码编译为ES5的代码
    - Webpack：把js模块优化、打包为一个bundle文件
- Webpack
    - entry
    - output
    - loader
        - 作用：把非js的文件转换为webpack可识别的模块以打包
        - 常见loader：
            - babel-loader：将ES6+的代码转换成ES5的代码。
            - css-loader：解析CSS文件，并处理CSS中的依赖关系。
            - style-loader：将CSS代码注入到HTML文档中。
            - sass-loader：将Sass文件编译成CSS文件。
            - less-loader：将Less文件编译成CSS文件。
            - postcss-loader：自动添加CSS前缀，优化CSS代码等。
            - vue-loader：将Vue单文件组件编译成JavaScript代码。
            - file-loader：解析文件路径，将文件赋值到输出目录，并返回文件路径。
            - url-loader：类似于file-loader，但是可以将小于指定大小的文件转成base64编码的Data URL格式
        - eg
            ```js
            module: {
                rules: [
                    {
                        test: /\.文件后缀$/, // 正则匹配文件类型
                        use: ['loader-name'], // 使用的 loader
                        exclude: /node_modules/, // 排除目录
                        options: { ... } // loader 参数
                    }
                ]
            }
            ```
    - plugin
        - 作用：扩展 Webpack 功能，处理 Loader 无法完成的任务（如代码压缩、HTML 生成等）。
        - 常见plugin
            - HtmlWebpackPlugin：生成HTML文件，并自动将打包后的javaScript和CSS文件引入到HTML文件中。
            - CleanWebpackPlugin：清除输出目录。
            - ExtractTextWebpackPlugin：将CSS代码提取到单独的CSS文件中。
            - DefinePlugin：定义全局变量。
            - UglifyJsWebpackPlugin：压缩JavaScript代码。
            - HotModuleReplacementPlugin：热模块替换，用于在开发环境下实现热更新。
            - MiniCssExtractPlugin：与ExtractTextWebpackPlugin类似，将CSS代码提取到单独的CSS文件中。
            - BundleAnalyzerPlugin：分析打包后的文件大小和依赖关系。
    - mode
    - optimization
        - eg
            ```js
            optimization: {
                splitChunks: {    // 代码分割
                    chunks: 'all',          // 分割所有类型的 chunk（initial/async/all）
                    minSize: 20000,         // 生成 chunk 的最小体积（单位：字节）
                    maxSize: 0,             // 尝试拆分大于此值的 chunk
                    minChunks: 1,           // 模块被至少 minChunks 个 chunk 引用时才分割
                    cacheGroups: {          // 定义缓存组（可多组）
                        vendors: {
                            test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 中的模块
                            name: 'vendors',    // 生成的 chunk 名称
                            priority: -10,      // 优先级（数值越大越优先）
                            reuseExistingChunk: true // 重用已存在的 chunk
                        },
                        common: {
                            minChunks: 2,       // 被 2 个以上 chunk 引用的模块
                            name: 'common',
                            priority: -20
                        }
                    }
                },
                moduleIds: 'deterministic',    // 固定模块 ID
                chunkIds: 'deterministic',     // 固定 Chunk ID
                runtimeChunk: 'single',        // 分离 Webpack 运行时代码
                minimize: true,                // 启用压缩（生产模式默认 true）
                minimizer: [new TerserPlugin()] // 指定压缩工具
            }
            ```
        - splitChunks.chunks 可选值
            - initial：只分割同步加载的模块。
            - async：只分割异步加载的模块。
            - all：所有模块都可能被分割（推荐）。
        - 实际项目的例子：
            - eg
                ```js
                optimization: {
                    splitChunks: {
                        chunks: 'all',
                        cacheGroups: {
                        react: {
                            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                            name: 'react-vendor',
                            priority: 20
                        },
                        lodash: {
                            test: /[\\/]node_modules[\\/]lodash[\\/]/,
                            name: 'lodash-vendor',
                            priority: 10
                        }
                        }
                    }
                }
                ```
    - sizeEffect:
        - 用来tree shaking的
    - devServer
    - devtool
        - devtool: 'source-map'
        - devtool: false, // 或 'hidden-source-map'
    - resolve.alias	路径别名（如 @ -> src）
    - externals	排除某些库（如 CDN 引入的 React）
    - cache	持久化缓存（Webpack 5 默认开启，大幅提升构建速度）
    - performance 资源大小警告阈值


    - 魔法注释
        - 在动态导入（import()）写魔法注释（Magic Comments）可以对模块的加载产生不同行为
            -  `webpackPrefetch: true`可以让模块自动被预加载
            - `webpackPreload: true`可以立刻预加载当前页面关键资源（如字体）
        - eg
            ```ts
            const Settings = React.lazy(() =>
                import(/* webpackPrefetch: true */ './Settings')
            );
            ```
    - manifest.json
        - Webpack 通过 manifest 知道如何加载 chunk。
        - 长期缓存：若第三方库哈希不变，用户无需重复下载。
        - eg
            ```json
            {
                "main.js": "main.8a9b3c.js",
                "vendor.js": "vendor.d4e5f6.js",
                "src_index.js": "main.8a9b3c.js",
                "node_modules_lodash.js": "vendor.d4e5f6.js"
            }
            ```

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

