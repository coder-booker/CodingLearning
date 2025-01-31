// // 默认
// function test() {
//   console.log("test", this);
// }
// const test1 = function() {
//   console.log("test1", this);
// }
// const test2 = () => {
//   console.log("test2", this);
// }
// console.log("全局");
// test();   // 全局
// test1();  // 全局
// test2();  // 应该是全局，但啥也没捕获到
// console.log("全局构造");
// new test(); // test {}
// new test1(); // test1 {}
// new test2(); // error, 箭头函数不能构造

// (function aaa() {
//   console.log(this);
// })();  // 全局
// (function() {
//   console.log(this);
// })();  // 全局
// (() => {
//   console.log(this);
// })(); // 无法直接捕获全局

// new (function aaa() {
//   console.log(this);
// })(); // new
// new (function() {
//   console.log(this);
// })(); // new
// new (() => {
//   console.log(this);
// })(); // error, 箭头函数不能构造



// // 隐性
// // 1. 作为对象的方法调用
// let obj = {
//   test() {
//     console.log("test", this);
//   },
//   test1: function() {
//     console.log("test1", this);
//   },
//   test2: () => {
//     console.log("test2", this);
//   },
// };
// console.log("对象");
// obj.test();  // obj对象
// obj.test1();  // obj对象
// obj.test2();  // 应该是全局，但啥也没捕获到，不是因为let或者var
// new obj.test();  // error, 不是构造函数
// new obj.test1();  // 就是new的行为，因此为空
// new obj.test2();  // error, 箭头函数不能构造



// // 2. 作为类方法调用
// class Test {
//   constructor() {
//     console.log("constructor", this);
//   }
//   test() {
//     console.log("test", this);
//   }
//   test1 = function() {
//     console.log("test1", this);
//   }
//   test2 = () => {
//     console.log("test2", this);
//   }
// }
// console.log("类");
// const test3 = new Test(); // 类
// test3.test(); // 类
// test3.test1(); // 类
// test3.test2(); // 捕获到了类
// new test3.test(); // error, 不是构造函数
// new test3.test1(); // error, 不是构造函数
// new test3.test2(); // error, 不是构造函数



// function bruh() {
//   console.log("bruh");
//   function test() {
//     console.log("test", this);
//   }
//   const test1 = function() {
//     console.log("test1", this);
//   }
//   const test2 = () => {
//     console.log("test2", this);
//   }
//   test(); // 全局
//   test1(); // 全局
//   test2(); // 全局
// }
// const bruh1 = function() {
//   console.log("bruh1");
//   function test() {
//     console.log("test", this);
//   }
//   const test1 = function() {
//     console.log("test1", this);
//   }
//   const test2 = () => {
//     console.log("test2", this);
//   }
//   test(); // 全局
//   test1(); // 全局
//   test2(); // 全局
// }
// const bruh2 = () => {
//   console.log("bruh2");
//   function test() {
//     console.log("test", this);
//   }
//   const test1 = function() {
//     console.log("test1", this);
//   }
//   const test2 = () => {
//     console.log("test2", this);
//   }
//   test(); // 全局
//   test1(); // 全局
//   test2(); // 捕获不到东西
// }
// bruh();
// bruh1();
// bruh2();

// 函数中的对象
// 没啥好说的，取决于其调用形式

// // 类中的对象
// // 应该会挂载到类之下
// class Test {
//   constructor() {
//     console.log("constructor", this);
//   }
//   obj = {
//     test() {
//       console.log("test", this);
//     },
//     test1: function() {
//       console.log("test1", this);
//     },
//     test2: () => {
//       console.log("test2", this);
//     },
//   }
// }
// const test = new Test();
// test.obj.test(); // obj
// test.obj.test1(); // obj
// test.obj.test2(); // Test

// // 对象中的对象
// const obj = {
//   obj: {
//     test() {
//       console.log("test", this);
//     },
//     test1: function() {
//       console.log("test1", this);
//     },
//     test2: () => {
//       console.log("test2", this);
//     },
//   }
// }
// obj.obj.test(); // obj
// obj.obj.test1(); // obj
// obj.obj.test2(); // 无法捕获到

// // 立刻执行函数的嵌套
// const obj = {
//   bruh: function() {
//     console.log("test", this);
//     (() => {
//       console.log("test2", this);
//     })();
//   }
// }
// obj.bruh(); // obj, 全局, 全局


// bind被解构会消除上下文吗？
const obj = {
  test() {
    console.log("test", this);
  }
}
obj.test(); 
const aaa = obj.test.bind(obj);// obj
aaa();
