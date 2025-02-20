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
    - 生命周期：在 ***渲染*** 时生效
    - 对且只对React Component Tree的GET生效（也就是对route handler无效）
    - 在渲染完成前，根据url和option，cache所以fetch
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
