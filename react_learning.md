key
    component must have a unique key among its sibling for react to identify and midify it.

useState
    state不变原则，setState是直接创建和替换新的引用
    setState会触发重新渲染，但包含setState的函数运行完了才会真正更新state和重新渲染，在此之前对state的更新会被保存在某队列中。
    嵌套组件因为是递归的，在所有组件都渲染完了(队列全都排好了)才会更新替换state
    更新函数: setState(n => n+1)
        更新函数的n是直接在state更新队列中获取的值，而非当前state的值
        n不一定要叫n，惯例是按照state变量名的单词首字母来命名

useEffect
    检测state和prop变化（引用变化）
    一般使用事件处理程序来执行操作。useEffect是在最后手段

philosophy
    一个组件做一件事
    组件渲染顺序布可预测，所以组件应该以纯函数的形式设计

JSX
    Fragment: empty tags
    标签属性多为驼峰命名
    组件渲染顺序难以预测，尽量不要让多个组件共享同一个变量（有点类似多线/进程）常量则无所谓
    display: none和return null有区别
    mutation
        内部组件修改了外部变量

event
    onScroll之外的所有事件都会被传播到父级组件
    (e) => {e.stopPropagation();}
    e.preventDefault();
    