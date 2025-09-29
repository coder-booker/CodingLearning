# NextJS Notes
### Common Knowledge
- SSR and CSR can be chosen
    - if SEO is important or resources is sensitive, use SSR (e.g. Home Pgae, Post Page)
    - if you use Hooks ot need user interaction, use CSR (e.g. Login Page, Add New Page)

# project structure
- /src:
    - /app
        - 里面的文件夹名都是一个endpoint，返回里面的page.tsx/jsx。因此/app就是router
        - 除了/api的文件夹，剩下的文件夹都只会响应对应路径的GET请求
        - /api
            - 后端的endpoint
    - /components
        - /core
            - 最小的components单位，一些可能被部分重用或者小到没有明显特征的组件
        - /shared: 
            - 会被整个app使用的components
            - 命名规范：
                - 物件名字
            - 命名规范：
                - UI: 物件名字 + domain
                - Entity: Entity_name + 物件名字
                - utilities: no restriction 
            - /layouts: 定义pages的layouts
        - /features: 
            - 更大一点的section，可以用page名字或者其他某种特征来进一步细分
    - /models: 定义数据结构
    - /styles/theme: 
        - /foundations: colors, size, etc
        - /components: components style
    - /assets: 放字体文件的
- other points: 
    - unique components: 如果某个子component have unique sub-component, create a folder named components inside the component's folder
    - messy style declaraion: separate it into a components_name.elements.js file. But do this only when it gets really messy or at the end of development
    - inversion of control

# Initilize
1. Have npm
2. `npx create-next-app@latest` to init an nextjs app  
The following are the config to select when u enter the command in terminal  
√ What is your project named? ... my-app  
√ Would you like to use TypeScript? ... No / Yes  
√ Would you like to use ESLint? ... No / Yes  
√ Would you like to use Tailwind CSS? ... No / Yes  
√ Would you like to use `src/` directory? ... No / Yes  
√ Would you like to use App Router? (recommended) ... No / Yes  
√ Would you like to customize the default import alias (@/*)? ... No / Yes  
√ What import alias would you like configured? ... @/*  
3. you can choose to delete the content of firectory `src/app/font/` and `src/app/globals.css`, and modify tyhe font setting in `src/app/layout.tsx` or `layour.jsx`

# General
- 谨记软件架构与nextjs中的use client之类的概念完全不相关，不需要纠结
- 修改`next.config.mjs`文件需要重启服务器


# experience
- 在client中用children来嵌入服务端组件
- 可以利用这个特性来异步预加载数据，也就是提前不await，在需要的时候await，两个加载请求指向的是同一个请求


# route cache
- Request Memorization
    - Nextjs会自动把fetch的结果在组件树开始渲染时记忆化，用于在应用渲染时避免应用各处对该函数的重复调用。但在渲染完成后就会删除。
    - 注意事项：
        - 只对GET请求生效
        - 只对React Component Tree生效（也就是对route handler无效）
        - 只在渲染中生效，和运行后的data cache是不同的概念
    - Opt out:
        ```ts
        const { signal } = new AbortController()
        fetch(url, { signal })
        ```
- Data Cache
    - 普遍情况下会对fetch的结果cache的空间
    - 无论是不是在渲染都会cache
    - cache在服务器上
    - 生命周期：persistent（default），或者一般都会自己设置
    - cache options：
        - cache: 'force-cache' (default, 会被cache和memorize)
        - cache: 'no-store' (不会被cache，但会memorize)
        - 路由段缓存设置，但该路由段下的第三方库也会被影响
    - 设置生命周期（validate）：
        - next: { revalidate: 3600 } (ms，但过期之后的第一个fetch不会立马使用新数据，只会返回旧数据和同时触发data cache更新)
        - next: { tags: ['taggg']} + revalidateTag('taggg')（基于tag的触发来revalidate，会立马更新和返回新数据）
    - react cache可以实现更自定义的cache
- Full Route Cache
    - 对整个page进行cache，不只是cache fetch
    - 包括完整html和RSC payload
    - cache在服务器上
    - 生命周期：persistent（default）
- Route Cache
    - cache在客户端(浏览器)上，进一步说就是用户内存
    - cache RSC payload
    - 生命周期：session（default），或者根据next的prefetch设置，或者手动validate
        - Link组件会让next去prefetch对应链接
        - 在link设置prefetch可以控制client cache的行为
        - null or unspecified (default, dynamic不cache，static cache 5分钟)
        - true/false （都dynamic和static都5mins或者压根不cache）
        - ？？？什么叫state会被保留？？？
- ***duration, revalidate, opting out, api***
- dynamic route会在客户端miss时，直接去找data cache，因为server无法cache动态路由。
    - 有种叫force-dynamic或者revalidate = 0的东西可以进一步跳过data cache
- Server action: revalidatePath('/page_path') 可以用来在没有重新渲染触发的页面手动刷新页面获得最新的结果


# routes & page
- 渲染的完整流程：basic HTML -> RSC payload -> JS Hydration
- basic HTML
    - 静态占位符网页，可以自定义样式
- RSC payload 
    - 用流式传输异步渲染画面，而不是渲染好一次性发出去
    - 同时可以协调basic HTML和服务器渲染内容
- JS Hydration
    - 最后把交互组件施加在客户端
- dynamic route: [slug]
    - 对page/api而言，从解析好的params直接对象解构slug就行
    - 可以自定义名字
- next是前后端结合的，因此所有交互都是某种服务器路径的捕获
    - 所有next的react组件都默认是use server，相对的是use client
    - next的react组件默认为React Server Components (RSC)，或者说`use server`
    - `'use client';`
        - client无法导入server组件，反之则可以
        - 所有子组件也都会变成client，除非用children传入服务端组件
        - 有任何交互式设计时才需要使用client，否则server已足够 (e.g. hooks)
        - neccessary if use react features
        - basically change certain file from SSR to CSR
            - However it is not really CSR
            - It is basically like: first render in server and then pass to client. so it takes time from components to enter the browser, some functions like `localStorage` may not function correctly immediately. 
        - e.g. login page
        - write at line 1 to indicate 
        - `async/await` cannot be used in client, only server
- next会自动解析page间的请求，如解析好query string和params。
    - 应该是api也会被解析
    - client可以用useParams和useSearchParams钩子，在next/navigation里
    - 还有什么会被解析？

# Optimization
### next components
- Link
    - 非自闭合
- Image
    - 自闭合
    - `fill`属性可以使图片填满最近的有明确width和height的父容器
    -  [Largest Contentful Paint (LCP) element](https://nextjs.org/docs/app/building-your-application/optimizing/images#priority)
<!-- - router -->
### Metadata
- 在layout export或者generateMetadata()动态加入
### Monitoring
- https://nextjs.org/docs/app/building-your-application/optimizing#analytics-and-monitoring
### 外部链接权限
- e.g.
```ts
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
}
```
### Form
- 给form的action传入一个接收(不是解构)FormData类为参数的function就能直接解析好FormData
    - e.g.
    ```ts
    export default function Page() {
        async function createInvoice(formData: FormData) {
            'use server'
        
            const rawFormData = {
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
            }
        
            // mutate data
            // revalidate cache
        }
        
        return <form action={createInvoice}>...</form>
    }
    ```
- 还可以bind些form没有的额外data（作用类似与hidden input）




# next module
- next-auth
    - 目前在学v4
    - NextAuth是最重要起始接口
        - 塞入config可以设定好不同平台的登录方式
        - 返回值就是这些平台的各种方法，例如 handlers, signIn, signOut, auth
    - 可以写在client也可以写在server
    - handler就像是装饰器，装饰所有对应请求的回调函数，例如next的app的子文件夹的GET响应
        - GET和`/auth/session`路径会自动解析query string、cookie、headers、params之类的东西
- prisma
    - 关键在于global的那个client上
    - `npx prisma studio`打开prisma内置的panel
    - query: 
        - `prisma.$transaction([aaa, bbb])` 确保aaa和bbb语句都被正确完成的语句。中文称为“事务”
- next/router vs next/navigation
    - router是旧版本（<= v13）原本的router解决方案，在新版本已经被app文件夹router替代了
    - 新版本（> v13）的其他相同功能已经被navigation完全替代了，包括useRouter hook
    - `useRouter()`用于重定向
        - e.g. `const router = useRouter();router.push("/");`
- server-only , client-only
    - 用来提供把服务器代码意外写到client或者相反情况的错误
    - 但一般只是用在js环境下，因为只有js环境的模块可以同时被客户端和服务端使用？？？（似乎是的，因为我的async/await模块无法在客户端导入和使用）
- next/headers
    - e.g.
    ```ts
        import { headers, cookies } from 'next/headers';

        const cookieStore = cookies()
        const theme = cookieStore.get('theme')
        const headersList = headers()
        const referer = headersList.get('referer')
    ```


# next class
### NextResponse
- 扩展了js原生的Response类，且有些的对next的适配
- 常用属性/方法
    - status：设置响应的状态码。
        - `const response = NextResponse.json({ message: 'Hello' }, { status: 200 });`
    - headers：设置响应头部。
        - `response.headers.set('Content-Type', 'application/json');`
    - json()：创建一个 JSON 响应。
        - `const response = NextResponse.json({ message: 'Hello' });`
    - redirect()：创建一个重定向响应。（用于指示客户端重新请求另一个url）
        - `const response = NextResponse.redirect('/new-url');`
        - 其实就是便捷设置"Location"头部
    - rewrite()：创建一个重写响应。
        - `const response = NextResponse.rewrite('/new-url');`
    - next()：继续处理下一个中间件或路由。
        - `const response = NextResponse.next();`





# runtime
- building
    - Next.js要表达任意Object，用`object`
    - any默认无法通过build，可以对`@typescript-eslint/no-explicit-any`做修改来调整


# WIP
### Data fetching & Caching
- Request Memorization
    - Nextjs会自动把fetch或者自定义函数的结果在组件树开始渲染时记忆化，用于在应用渲染时避免应用各处对该函数的重复调用。但在渲染完成后就会删除。
    - cache的目标：
        - GET 的 `fetch`
        - `React.cache`封装的函数
    - 注意事项：
        - 只对React Component Tree生效（也就是对route handler无效）
        - 只在渲染中生效，和运行后的data cache是不同的概念
    - Opt out:
        ```ts
        // for fetch
        const { signal } = new AbortController()
        fetch(url, { signal })
        // for React.cache: 不写就行
        ```
- Data Cache
    - 对向外部的请求，包括fetch API和unstable_cache，的缓存
    - 14默认cache ，但15默认不cache 
    - opt-in/-out：
        - fetch: `{ cache: 'force-cache' }` or `{ cache: 'no-store' }`
        - unstable_: `unstable_cache` or `unstable_noStore`
    - 有多种revalidate方法：
        1. 不revalidate，持久化缓存：
            - fetch：`fetch(URL, { cache: 'force-cache' })`：对同样的URL cache
            - unstable_cache：`unstable_cache(async () => {await getData})`：可以用在ORM之类的非fetch请求中
        2. Time-based: 
            - fetch：`next: { revalidate: 3600 }` (ms，但过期之后的第一个fetch不会立马使用新数据，只会返回旧数据和同时触发data cache更新)
            - unstable_cache: 看看下面的
        3. On-demand
            - fetch：
                - 【似乎有些问题】`revalidatePath()`
                - `next: { tags: ['taggg']}` + `revalidateTag('taggg')`（基于tag的触发来revalidate，会立马更新和返回新数据）
    - 注意事项：
        - revalidate的行为是无效化，等下次请求再重新cache
        - time-based revalidate是stale-while-invalidate的
    - unstable_cache:
        - eg
            ```ts
            const getCachedUser = unstable_cache(
                async () => {
                    return { id: userId }
                },
                [userId], // add the user ID to the cache key
                {
                    tags: ['users'],
                    revalidate: 60,
                }
            )
            ```
- Full Route Cache 全路由缓存
    - 缓存每一个route page的RSC payload、HTML、客户端组件的js到服务器上
    - 注意事项：
        - 不会缓存dynamic rendering的route page
    - revalidate：
        - Data Cache的revalidate就会revalidate
- Router Cache
    - stores the RSC payload of route segments, split by layouts, loading states, and page
    - 会缓存访问过的页面或者prefetch将要访问的页面，缓存形式：
        - 共用的Layout
        - 在树中最近的降级UI
        - 实验性的把route的前进后退的page缓存在客户端
    - 将要访问的页面：
        - `<Link>`组件
            - 在link设置prefetch可以控制prefetch的行为，默认为null
        - `router.prefetch()`
            - 默认为full prefetch
    - 生命周期：
        - session改变就会刷新
        - 根据prefetch的设置来invalidate
            - default不prefetch动态的，静态的保留5分钟
            - prefetch为true就动态静态都5分钟
        - revalidatePath, revalidateTag
        - 【todo】Using cookies.set or cookies.delete invalidates the Router Cache to prevent routes that use cookies from becoming stale (e.g. authentication).
        - `router.refresh` 刷新当前路由

- Nextjs对异步显示的丰富封装：
    - 基础：
        - loadings.ts：对route的page显示备用UI
        - React.Suspense：对props还没更新好的组件显示备用UI
    - preload：
        - 用`void getDate()`先后台异步获取数据
    - 注意事项：
        - 小心sequential的误区，尽量进行非阻塞的parallel数据获取，少用await

### rendering
- Static Rendering
    - 默认行为。只要fetch cache了且没有dynamicAPI，正常写组件就会自动static rendering为html，也就是SSG
    - 可以通过一些设置实现 ISG 增量静态再生
        - revalidate：
            - Time-based：
                - `export const revalidate = 60;`
            - On-demand：
                - `revalidatePath('/posts')`
                - `next: { tags: ['posts'] },`
        - `export async function generateStaticParams() {}`
            - 用于有`[slug]`的动态路由，实现生成返回slug所有可能的值供生成html
        - `export const dynamicParams = true`
            - 当出现了并未在generateStaticParams生成返回的slug，要不要后台生成新的html
            - 如果为false就返回404
    - static render的page会在build或者ISG的revalidate被渲染并缓存
    - 用于非个性化的公共页面，更新频率倒是无所谓
- Dynamic Rendering
    - 在服务端实时渲染组件
    - dynamicAPI || fetch no-store 就是 dynamic rendering
    - Dynamic API：
        - `cookies`
        - `headers`
        - `connection`
        - `draftMode`
        - `searchParams` prop
        - `unstable_noStore`
        - `export const dynamic = 'force-dynamic'`

### Hydration
1. React Rendering on the Server
    - 把服务端组件编码为RSC payload，optimized for streaming
    - 用RSC payload和客户端组件的js来在服务端生成一个不包含互动的基础HTML
2. Next.js Caching on the Server (Full Route Cache)
    - 缓存每一个route page的RSC payload、HTML、客户端组件的js到服务器上
    - 传送给客户端开始水合
3. React Hydration and Reconciliation on the Client
    - 显示基础HTML
    - 【不太理解为什么协调】用RSC payload来协调客户端组件，并渲染服务端组件，更新DOM
    - 【不太理解为什么水合】客户端js运行，水合客户端组件，然后绑定交互逻辑到客户端组件上，更新DOM
4. Next.js Caching on the Client (Router Cache)
    - 把每个route page的RSC payload缓存到客户端上
    - used to improve the navigation experience by storing previously visited routes and prefetching future routes.
5. Subsequent Navigations
    - 在之后的navigation中，如果Router Cache有缓存就直接使用，无需再次请求服务器。否则访问Full Router Cache并缓存在Router Cache中

- RSC Payload
    - used to reconcile the Client and rendered Server Component trees, and update the DOM.
    - 包含：
        - The rendered result of Server Components
        - Placeholders for where Client Components should be rendered and references to their JavaScript files
        - Any props passed from a Server Component to a Client Component
### Optimization
- Image
    - 自动懒加载，quality、priority、loader、自动编译为webp
    - 对导入的本地图片自动调整大小，但url的就得指定大小了
    - WebP自适应如何兼容IE：picture标签+source标签
### Route


### other
- 'server-only'和'client-only'用来标注模块仅能被server或client组件使用，例如serveronly包含敏感信息，clientonly操作windows等等。如果违反了在build时会报错。
- taint可以保护敏感数据泄露到客户端
- revalidatePath确实无法控制外部API的fetch，得用revalidateTag

### question
streaming
    其实就是懒加载和排优先级。把部分ui suspense，页面就会先加载其他ui
并行路由
    default.ts: 没有显性访问子页面时的默认页面或者无法匹配到的子路由
    layout＞page＞default
国际化
    - `[lang]`的slug+文字字典
冷启动
    首次调用时需要重新加载运行时环境和依赖模块。
    心跳函数定期warm up
	解耦API路由的依赖来加快冷启动
edge function
    环境依赖：无法使用Nodejs模块
    资源限制：Edge Functions 一般是serverless的，有很多资源限制
serverless function
    function name、内存、CPU 资源、运行时间、response body size都有限制，需避免复杂逻辑。
    API 路由就是serverless的
中间件
    根目录定义middleware.ts，用matchConfig或者手动判断来筛选路由
- Webpack
    - 插件、loader、按需加载、路径等等
    ```ts
    webpack: (config, options) => {
        config.module.rules.push({
        test: /\.mdx/,
        use: [
            options.defaultLoaders.babel,
            {
                loader: '@mdx-js/loader',
                options: pluginOptions.options,
            },
        ],
        })
        return config
    },
    ```
page route
    不支持stream和SSR，也不支持很多先进的特性
next/script的strategy参数对LCP的影响
	- beforeInteractive：
	脚本会在页面渲染之前加载，可能会阻塞 LCP。
	适用于关键脚本（如 analytics、AB 测试）。

	afterInteractive：
	脚本会在页面交互之后加载，不会阻塞 LCP。
	适用于非关键脚本（如第三方库）。

	lazyOnload：
	脚本会在页面完全加载后延迟加载，对 LCP 无影响。
	适用于低优先级脚本（如广告、社交媒体按钮）。

CDN控制
redux的兼容



Router Cache对访问过的路由进行cache是cache什么？page本身还是prefetch？
为什么dynamic不会Full Router Cache？RSC payload到底是什么？
客户端组件的缓存行为与服务端有区别吗？
RSC payload在Router Cache的行为
ondemand isg不会触发中间件？



平行加载和Promise.all的联动
async和await在client和server的不同