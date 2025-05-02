
# 前端优化
- 资源优化
    - 优化资源的加载策略
        - 预加载关键资源
            - 让关键资源优先加载和缓存，因为http/1.1有并行限制，优先加载可以避免堵塞
            - 关键渲染路径（CRP）例如首屏的js和css就可以被预加载
            - `<head>`标签中的`<link>`可以设置`ref='preload'`（注意preload并不会执行资源，所以这个load其实是download）
        - 减少关键资源数量
            - 内联关键 CSS（首屏样式直接嵌入 HTML）。
            - 延迟非关键 JS（使用 async/defer）。
        - 懒加载
            - HTML内置属性loading=lazy，让图片在滚动到元素附近时才加载
                - <img source='/xxx.jpg' loading='lazy' alt=''>
            - js实现进入视窗再加载
                - 对比元素offsetTop是否小于scrollTop和clientHeight，是的话代表进入了视窗，开始加载
            - IntersectionObserver
                - 浏览器内置的解决"判断元素是否在视窗内"问题的API
        - 多域名分片
            - http/1.1有并发限制，所以往多个域名分别请求不同资源就能突破限制
            - 当然http/2没有这个限制
        - CDN
            - 配置 Cache-Control 响应头（如 public, max-age=31536000）让CDN服务器缓存资源
            - 一般网络供应商其实自己就有CDN服务器，服务器配好cache-control就行
            - 但使用 CDN 提供商的云存储会有更好的优化
    - 优化资源体积
        - 图片
            - 格式选择
                - WebP（比 JPEG/PNG 小 30%）。
                - AVIF（下一代格式，支持 HDR）。
            - 响应式图片
                - 对较小的设备使用分辨率/大小较低的图片
                - `<img srcset="small.jpg 480w, large.jpg 1080w" sizes="(max-width: 600px) 480px, 1080px">`
        - html/js/css
            - Webpack编译打包：split、prefetch、tree shaking（最小化js和css）
- 代码优化
    - 浏览器渲染
        - 减少重排（Reflow）与重绘（Repaint），避免频繁操作 DOM
            - 使用 `DocumentFragment` 批量插入 DOM。
            - 读写分离（先读取布局属性，再统一修改）。
                - 浏览器对于连续的相同操作会批量处理（类似“脏检查”机制）
                - 但如果读写在同一个循环中，就会导致所有操作都不连续，也就不会批量处理并导致频繁的重排
            - react本身会把所有setState合并为一次更新，所以不太会频繁操作DOM
    - react
        - 懒加载、虚拟列表
        - 钩子缓存
        - 预加载
    - css
        - 优化选择器性能
            - 避免嵌套过深（如 .nav ul li a → .nav-link）。
        - 使用 CSS3 动画替代 JS 动画
            - js动画需要主线程的布局与绘制
            - CSS3 的 transform 和 opacity 属性会触发 GPU 硬件加速，跳过主线程的布局和绘制计算
                - eg：`transform: translateZ(0);`，`transition: transform 0.3s ease;`
    - V8 引擎与 JS 执行优化
        - 隐藏类（Hidden Class）优化
            - V8 为每个对象创建隐藏类，记录属性布局（如偏移量），加速属性访问。
            - 避免动态添加属性和删除属性:
                ```js
                    // ❌
                    const obj = {};
                    obj.a = 1;
                    obj.b = 2;
                    delete obj.a;
                    // ✅
                    const obj = { a: 1, b: 2 };
                    obj.a = null;
                ```
        - 优化热路径（Hot Path）
            - 减少函数参数：
                - V8 使用寄存器传递参数（更快），超过4个参数转为堆栈传递（更慢）。
                - 可以用对象把多个参数包裹起来，这样只会算一个参数
            - 使用 TypedArray：处理二进制数据。
        - 内存管理
            - 内存占用过高时，内存的标记清除就得遍历更多引用，特别是老生代的标记-整理开销会更大
            - 避免内存泄漏：
                - 清除定时器、事件监听器。
                - 避免闭包滥用。
            - 使用 WeakMap/WeakSet：存储临时引用。
    - service worker、web worker、WASM
        - service worker：离线缓存、后台同步、消息推送。
        - web worker：多线程计算，避免阻塞主线程（如大数据处理）。
    - TypedArray+ArrayBuffer
        - 以二进制内存方式创建和操控数组，无需meta数据和类型检查
- 架构优化
    - HTTP2.0
        - 没有多路复用限制，preload的解决http1.1多路复用限制的特点就没用了
        - 不过有兼容性问题
        - 不过仍然会有TCP层可能的阻塞
- 性能监控
    - 性能分析：
        - Lighthouse：综合评分与优化建议。
        - Chrome DevTools：各种网站指标
            - Performance Tab：分析帧率、长任务。
            - Coverage test：检测未使用的代码。
    - 用户体验：
        - RUM（Real User Monitoring）：
            - 使用 web-vitals 监控核心指标（LCP、FID、CLS）。
        - Synthetic Monitoring：模拟用户行为测试。

# 前端多线程：Service worker/Web worker
- Service worker

# 浏览器
- 浏览器渲染流程
    - DOM树构建：渲染引擎使用HTML解析器（调用XML解析器）解析HTML文档，将各个HTML元素逐个转化成DOM节点，从而生成DOM树；
    - CSSOM树构建：CSS解析器解析CSS，并将其转化为CSS对象，将这些CSS对象组装起来，构建CSSOM树；
    - 渲染树构建：DOM 树和 CSSOM 树都构建完成以后，浏览器会根据这两棵树构建出一棵渲染树；
    - 页面布局（重排）：渲染树构建完毕之后，元素的位置关系以及需要应用的样式就确定了，这时浏览器会计算出所有元素的大小和绝对位置；
    - 页面绘制（重绘）：页面布局完成之后，浏览器会将根据处理出来的结果，把每一个页面图层转换为像素，并对所有的媒体文件进行解码。
- 重排与重绘
    - 重排是元素的几何属性改变就会触发
        - 同步重排：有些属性的获取操作会强制进行同步重排以返回最新的布局信息，如：
            - offsetTop/left/Width/Height
            - scrollTop/left/Width/Height
            - clientTop/left/Width/Height
    - 重绘负责绘制新UI
        - 有些改变只会触发重绘而不会重排，例如背景色改变
# 场景题
## 前端加密
- 就是让前端的js完成类似https的加密流程
- 但是性能和安全性受限，比如密钥容易泄露

## 前端防爬虫
- 验证机制
    - User-Agent检测：检查请求头中的User-Agent，拦截已知爬虫工具和异常UA
    - 请求频率验证码限制：对频繁请求的IP/同一用户进行限制或验证码验证
    - 行为验证：如拖动滑块、点击特定图案、鼠标轨迹等
    - Canvas指纹：结合用户设备指纹识别异常访问
- JavaScript渲染依赖
    - 动态生成关键数据：使简单爬虫无法直接获取完整HTML中的内容，如动态计算DOM元素、使用JS加密等
    - 懒加载技术：只有当用户滚动或交互时才加载关键数据
- 混淆技术（*感觉蛮有用的*）
    - CSS类名/ID混淆：定期变更CSS选择器名称
    - 数据混淆：使用Base64、Unicode编码或自定义加密
    - DOM结构动态变化：使基于XPath或CSS选择器的爬虫失效
- API防护
    - 动态Token：每次请求需要携带动态生成的Token
    - 请求签名：对参数进行加密签名
    - 时效限制：请求参数设置短时效
- 高级技术
    - WebAssembly：将关键逻辑用WASM实现，增加逆向难度
    - 反调试技术：检测开发者工具是否打开
## 遮罩
- 通过z-index保证显示在顶层
- 禁用事件
    - 点击事件
        ```js
        document.querySelector('.modal-content').addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止点击事件冒泡到 overlay
        });
        ```
    - 背景滚动
        - todo
    - inert
        - HTML5提供的原生禁用交互方案

# 前端工程化
- 就是对前端项目进行以下操作
    - 管理库：
        - npm、npm
    - 构建工程：
        - 编译
            - loader: 对不同的文件后缀进行不同的加载方法，例如json、Sass、ts
        - 优化
            - plugin: css提取、js压缩（Tree-shaking）、生成html之类的
            - code split
            - loader：资源加载管理
        - 打包
    - 测试
    - 部署：
        - 生成web站点。
    - 额外功能：
        - 开发服务器(Optional)
        - 生成分析报表
            - 包大小分析、souce-map
        - 定义全局变量
- 现代常用的构建工具
    - maven：java的项目管理工具
    - Babel：用来把ES6+的代码编译为ES5的代码
    - Webpack：把js模块优化、打包为一个bundle文件
    - Vite：可以理解为对开发环境优化的Webpack
## 构建工具
### Webpack
- 核心原理：
    - 采用打包机制，将所有模块打包成一个或多个 bundle 文件。开发模式下使用 webpack-dev-server 提供服务，通过热更新（HMR）实现快速开发。构建时需要遍历所有依赖，生成依赖图，然后进行打包。
- entry
- output
    ```js
    entry: {
        app: './src/app.js',
        search: './src/search.js',
    },
    output: {
        filename: filename: '[name].[contenthash:8].js', // 生成如 app.a1b2c3d4.js
        path: __dirname + '/dist',
        publicPath: 'https://cdn.example.com/assets/[fullhash]/', // 配合cdn缓存策略减少不必要的重新请求
    },
    ```
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
            - deprecated
        - MiniCssExtractPlugin：与ExtractTextWebpackPlugin类似，将CSS代码提取到单独的CSS文件中。
            - 这样请求html、css、js可以平行进行，嵌入css的话html容易阻塞
            - 支持HMR、支持 Webpack 5 的持久缓存。
        - DefinePlugin：定义全局变量。
        - UglifyJsWebpackPlugin：压缩JavaScript代码。
        - HotModuleReplacementPlugin：热模块替换，用于在开发环境下实现热更新。
        - BundleAnalyzerPlugin：分析打包后的文件大小和依赖关系。
            - 集成到 Webpack，实时分析包体积
            - 开发时查看打包结果，交互式可视化
        - TerserPlugin：Tree Shaking
            - 解析：将代码转换为抽象语法树（AST）。
            - 转换：深入删除死代码、缩短变量名、优化逻辑。
            - 生成：输出压缩后的代码。
- mode
- optimization
    - 常用属性
        ```js
        optimization: {
            splitChunks: {    // 代码分割
                chunks: 'all',          // 分割所有类型的 chunk（initial/async/all）
                minSize: 20000,         // 生成 chunk 的最小体积（单位：字节）
                maxSize: 0,             // 尝试拆分大于max(minSize, maxSize)的 chunk
                minChunks: 1,           // 模块被至少 minChunks 个 chunk 引用时才分割
                cacheGroups: {          // 定义缓存组
                    vendors: {
                        test: /[\\/]node_modules[\\/]/, // 给webpack用以匹配此group要被打包的模块
                        name: 'vendors',    // 生成的 chunk 名称
                        priority: -10,      // 优先级，用于指定webpack匹配模块时时优先合并到哪个cacheGroup
                        reuseExistingChunk: true // 重用已存在的 chunk
                    },
                    common: {
                        minChunks: 2,       // 被 2 个以上 chunk 引用的模块
                        name: 'common',
                        priority: -20
                    }
                }
            },
            moduleIds: 'deterministic',    // 默认值。固定模块 ID。优先级低于output.filename
            chunkIds: 'deterministic',     // 固定 Chunk ID。优先级低于output.filename
            runtimeChunk: 'single',        // 分离 Webpack 运行时代码
            minimize: true,                // 启用压缩（生产模式默认 true）
            minimizer: [new TerserPlugin({ parallel: true })], // 指定压缩工具
        }
        ```
    - splitChunks.chunks 可选值
        - initial：只分割同步加载的模块。
        - async：只分割异步加载的模块。
        - all：所有模块都可能被分割（推荐）。
    - optimization.minimizer：
        - 默认就是TerserPlugin，UglifyJsWebpackPlugin是4+以前的版本
        - 只要minimize为true就会默认加载Terser
        - 需要自定义配置时才手动实例化
    - optimization.moduleIds
        - 编译优化完的js文件的import语句名字
        - import语句实际上会变成webpack内置的一个模块id，用于检查模块是否被加载了（我也不大懂）
    - optimization.chunkIds:
        - 5+默认为deterministic，4+是简易的数字id
- devServer
- devtool
    - 开发环境显示源码：'source-map'/'eval-cheap-source-map'
    - 生产环境：false/'hidden-source-map'
- resolve.alias	路径别名（如 @ -> src）
- externals	排除某些库（如 CDN 引入的 React）
- cache	持久化缓存（Webpack 5 默认开启，大幅提升构建速度）
    ```js
    cache: {
        type: 'filesystem', // 缓存到磁盘
        buildDependencies: {
            config: [__filename] // 依赖文件名来决定什么时候revalidate？
        }
    }
    ```
- performance 资源大小警告阈值
- manifest.json（**不太懂**）
    - Webpack 通过 manifest 知道如何chunk和源js文件的关系。
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
- 包大小分析：
    - source-map-explorer
        - 生产环境构建后分析，精确到源码行
        - 开发阶段用 BundleAnalyzerPlugin（实时反馈）。
        - 使用方法：
            ```json
            "scripts": {
                "analyze": "source-map-explorer 'build/static/js/*.js'",
            }
            ```
    - BundleAnalyzerPlugin：分析打包后的文件大小和依赖关系。
        - 开发环境下的实时反馈
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
- React 默认 webpack配置：
    - CRA默认有webpack
    ```js
    const webpackConfig = {
        mode: isEnvProduction ? 'production' : 'development',
        bail: isEnvProduction, // 生产环境构建失败时退出
        devtool: isEnvProduction
            ? 'source-map' // 生产环境生成完整 Source Map
            : 'cheap-module-source-map', // 开发环境快速生成 Source Map
        entry: paths.appIndexJs, // 入口文件：src/index.js
        output: {
            path: paths.appBuild, // 输出目录：build/
            filename: 'static/js/[name].[contenthash:8].js', // 带哈希的输出文件名
            chunkFilename: 'static/js/[name].[contenthash:8].chunk.js', // 动态导入的 chunk
            publicPath: publicPath, // 静态资源公共路径（默认 '/'）
            clean: true, // 构建前清空输出目录
        },
        module: {
            rules: [
                // 处理 JS/JSX（Babel 转译）
                {
                    test: /\.(js|jsx)$/,    // webpack遇到一个文件时会对每个rules的test进行匹配，test到最匹配的就使用这个rule
                    include: paths.appSrc,
                    loader: 'babel-loader',
                    options: {
                        presets: ['react-app'], // CRA 默认 Babel 配置
                        cacheDirectory: true, // 缓存 Babel 结果
                    },
                },
                // 处理 CSS（支持 CSS Modules）
                {
                    test: /\.css$/,
                    use: [
                        isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ],
                },
                // 处理图片/字体
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    type: 'asset/resource', // Webpack 5 资源处理
                },
            ],
        },
        plugins: [
            // 生成 index.html 并注入 JS/CSS
            new HtmlWebpackPlugin({
                template: paths.appHtml, // public/index.html
            }),
            // 生产环境提取 CSS 为独立文件
            isEnvProduction && new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            }),
            // 定义环境变量
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(process.env),
            }),
        ].filter(Boolean),
        optimization: {
            minimize: isEnvProduction, // 生产环境启用压缩
            minimizer: [new TerserPlugin()], // 使用 Terser 压缩
            splitChunks: {
                chunks: 'all', // 分割所有类型的 chunk
                    cacheGroups: {
                        vendors: {
                            test: /[\\/]node_modules[\\/]/, // 分离 node_modules
                            name: 'vendors',
                            priority: -10,
                        },
                    },
            },
            runtimeChunk: 'single', // 分离 Webpack 运行时代码
            moduleIds: 'deterministic', // 固定模块 ID
        },
        resolve: {
            extensions: ['.js', '.jsx'], // 自动解析的文件扩展名
            alias: {
                'react-dom': '@hot-loader/react-dom', // 开发环境热更新支持
            },
        },
        devServer: {
            hot: true, // 启用热更新
            historyApiFallback: true, // 支持 SPA 路由
        },
    };
    ```
    - productionSourceMap: true, // CRA 中默认开启
    - 如需自定义：可通过以下方式覆盖配置：
        - react-app-rewired + customize-cra（推荐）：
        - eg
            ```js
            // config-overrides.js
            const { override, addWebpackPlugin } = require('customize-cra');
            const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

            module.exports = override(
                addWebpackPlugin(new BundleAnalyzerPlugin())
            );
            ```
        - npm run eject（不可逆）
### Vite
- 优势：
    - 极快的启动速度
        - 直接将源文件作为原生 ES 模块提供给浏览器
        - 因此Vite 的"冷启动"只是启动一个静态文件服务器，几乎瞬间完成，而Webpack 必须先打包整个依赖图才能启动开发服务器
    - 精确的 HMR 边界检测
- 工作原理
    1. 原生 ES Modules (ESM) 的利用
        - 直接将源文件作为原生 ES 模块提供给浏览器
        - 通过 `<script type="module">` 加载入口文件，浏览器自行解析模块依赖图
        - 按需编译：只编译当前页面实际使用的文件，而不是整个应用
        - 但也因此必须浏览器原生支持esm
    2. 依赖预构建
        - 将 CommonJS/UMD 依赖转换为 ESM 格式
        - 将多个内部模块的依赖合并为单个模块（如 lodash 的各种方法）
    3. 快速 HMR 实现
        - Vite 维护了一个模块关系图
        - 当一个模块发生变化时，Vite 查关系图并精确地使已更新的模块与其最近的 HMR 边界之间的链失效，然后简单编译更新
            - Vite 服务器通过文件系统监听发现变更
            - 仅对修改的文件进行轻量级转译（如 TS→JS）
            - 通过 **WebSocket** 向浏览器发送更新事件
            - 浏览器直接重新请求该模块（利用 HTTP 缓存机制）
            - 新模块执行后，Vite 的运行时仅更新相关组件树
        - 这使 HMR 更新始终快速，无论应用大小
    4. 生产构建
        - 生产环境使用 Rollup 进行打包
        - Rollup 的打包效率更高
        - 生成的代码更简洁
        - 更好的 tree-shaking
- 使用场景
    - 现代浏览器项目：需要快速开发体验的应用
    - 大型单页应用 (SPA)：传统打包工具在大型项目中启动和 HMR 慢
    - 库/组件开发：快速的开发反馈循环很重要
    - 需要快速原型设计的项目：立即看到更改效果
    - Vue/React 项目：对这两个框架有很好的支持
## 库管理工具
### pnpm
- 核心原理：存储中心 Store 集中管理依赖：不同项目，相同版本依赖安装只进行硬链接（不复制）；不同版本依赖，只增加Diff文件
- 具体文件结构：
    - 项目 package.json 依赖列表，和node_modules/.pnpm目录结构一致
    - 相同依赖安装时，将 Store 中的依赖硬链接到项目的 node_modules/.pnpm 下，而不是复制，速度快
    - 项目node_modules中已有依赖重复安装时，会被软链接到指定目录下
- 常用命令
    - 查看ts-node的所有版本：`pnpm view ts-node versions`
    - npm i：pnpm i（i是install的简写）
    - 等价与`npm i nodemon -g`：`pnpm add nodemon -g`
    - 查看依赖(全局)：pnpm list [-g]
    - `pnpm dev`
- 事实上可以跨管理工具使用，比如`npm run dev/test/build`应该在pnpm管理的node_modules下仍然能用
### package.json
- 原本是nodejs的npm的meta配置文件，后来变成了js生态通用的配置文件
- 因此有一些字段其实是给js生态中的热门库设置的，比如webpack
- sideEffect:
    - 用来指定哪些文件可以tree shaking的，有sideEffect的就不shake
    - Webpack内置的静态分析功能
    - 和Terser的区别在于，sideEffect只会进行简单的shaking，如清除未引用的变量等，而Terser还会进一步清除未使用的代码片段
- "browserslist": 
    ```json
    {
        "production": [
            ">0.2%",      // 市场份额 >0.2% 的浏览器
            "not dead",   // 排除官方已不再维护的浏览器
            "not op_mini all" // 排除 Opera Mini
        ],
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
        ]
    }
    ```

# 前端指标
- 核心前端指标
    - LCP（最大内容绘制时间）衡量感知「加载速度」
    - FID（首次输入延迟）衡量「响应性」
    - CLS（累积布局偏移）衡量「视觉稳定性」
- 硬性指标
    - 可访问性/响应性（Accessibility/Responsiveness）
        - 定义：页面是否对所有用户友好，包括残障人士。
        - 解释：确保页面支持屏幕阅读器、键盘导航、不同屏幕尺寸显示，并提供足够的对比度和文本描述。
    - 页面加载时间（Page Load Time）
        - 定义：页面加载所需时间。
        - 解释：加载时间过长会导致用户流失，需优化性能。
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
    - 用户留存/流失率（User Retention Rate）
        - 定义：用户是否会再次访问。
        - 解释：高留存率表明页面设计成功吸引用户。
    - 用户参与深度（User Engagement Depth）
        - 定义：用户与页面的互动深度。
        - 解释：如浏览页面数量、停留时间、评论、分享按钮等，反映用户参与度。
- 抽象信息层面
    - 学习曲线（Learning Curve）
        - 定义：用户掌握页面操作的难易程度。
        - 解释：学习曲线越平缓，用户越容易上手。
    - 信息架构（Information Architecture）
        - 定义：信息组织是否合理。
        - 解释：清晰的信息架构帮助用户快速找到所需内容。
    - 导航效率（Navigation Efficiency）
        - 定义：用户能否快速找到目标页面。
        - 解释：高效的导航设计减少用户点击次数，提升体验。
    - 内容可读性（Content Readability）
        - 定义：内容是否易于阅读。
        - 解释：合适的字体、字号、行距和对比度提升可读性。
    - 可用性（Usability）
        - 定义：用户能否轻松完成任务。
        - 解释：页面应直观易用，用户无需复杂操作即可找到所需信息或功能。
- 用户行为层面
    - 用户控制感（User Control）
        - 定义：用户是否感到能控制页面，是否有及时反馈。
        - 解释：提供撤销、返回、vision notice等功能，增强用户控制感。
    - 用户行为分析（User Behavior Analysis）
        - 定义：通过数据分析用户行为。
        - 解释：了解用户在页面上的操作路径，优化设计。
    - 用户反馈
        - 定义：用户对页面的直接评价与评分。
        - 解释：量化调查过程和结果，如通过调查、评论、评分等收集用户意见，指导优化。
    - 用户信任度（User Trust）
        - 定义：用户对页面的信任程度。
        - 解释：通过安全标识、隐私政策等增强用户信任。
    - 用户推荐率（User Referral Rate）
        - 定义：用户推荐页面的比例。
        - 解释：高推荐率表明页面设计成功。
- 艺术层面
    - 一致性（Consistency）
        - 定义：页面设计是否保持一致。
        - 解释：统一的字体、颜色、按钮样式等有助于用户快速熟悉界面。
    - 情感设计（Emotional Design）
        - 定义：页面设计是否能引发用户积极情感。
        - 解释：通过色彩、图像、动画等元素提升用户体验。
    - 美学吸引力（Aesthetic Appeal）
        - 定义：页面视觉是否吸引人。
        - 解释：美观的设计提升用户的第一印象和留存率。
    - 品牌一致性（Brand Consistency）
        - 定义：页面设计是否符合品牌形象。
        - 解释：一致的品牌元素增强用户对品牌的认知和信任。
    - 视觉层次（Visual Hierarchy）
        - 定义：页面元素是否按重要性排列。
        - 解释：通过大小、颜色、对比度等设计手段，引导用户关注重要内容。


# 不同的前端框架
- Svelte: 一个编译型前端框架，将组件编译为高效的原生 JavaScript 代码。无虚拟 DOM，运行时开销极小，适合构建高性能应用。 SvelteKit 是 Svelte 的全栈框架，支持 SSR、SSG 和客户端渲染。
- Solid.js: 一个高性能的响应式 UI 框架，语法类似 React，但无虚拟 DOM。通过细粒度的响应式更新实现高性能。适合需要极致性能的应用。
- Qwik: 一个专注于即时加载性能的框架，通过延迟加载 JavaScript 实现极快的首屏加载。适合内容密集型网站，如电商或新闻站点。