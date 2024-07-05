
# ***基础***
    变量二进制的低三位代表其类型：000: 对象，001：整数，100：字符串等
    == 类型转换同一再对比
    === 不做类型转换
        类型对比 -> 如一样则对比值，如果是数字就得额外判断NaN，如果是对象或函数则对比引用
### 数组
    .push() 追加
    .length 长度
    .shift() 删除index为0的元素
    .pop() 删除并返回最后一位元素
    .toString() 用,拼接所有元素成字符串
    复制可以用[...target]
    一般用const修饰，因为const的是引用而非数组内的值，所以数组const仍可修改
### 循环 
传统循环：<br>
- `for ( const i = 0; i < n; i++ ) {};`

for in：<br>
- `for ( let x in a_object ) {};`
- x代表对象属性
- 虽然父类属性会被跳过，但可能有部分父类的属性被设置为可遍历了。可以用`a_object.hasOwnProperty(x)`来判断避免
- 数组的属性是其索引

for of：<br>
- `for ( let x of a_iterable ) {};`
- x代表可迭代对象a_iterable的迭代值
- 数组可迭代，迭代值是元素；常见json对象不可迭代

.map()：<br>
- `arr.map((element, index, arr) => { return sth; }, a_object);`
- 第一个参数是函数，接收 元素，索引，被map的对象本身三个参数；可以只声明一个来只接收元素
- 第二个参数是供在第一个参数的函数内调用`this`的指向。可以因此 达成用a的元素索引b 的操作

.forEach()：<br>
- 类似map，但不返回值
- 值得注意的是，这类循环都是直接对数组本身操作的，唯一记录的就是数组长度和index，每次步进1直到记录的数组长度。因此在循环内更改数组十分危险

.filter()：<br>
- 类似map，但只返回内部函数返回了true的元素


# ***函数***
    默认返回undefined
### 箭头函数
    () => xxxx; 隐性返回xxxx
    () => {return xxxx;}; 显性返回xxxx
<br>


# ***null, undefined, NaN***
### null
    应该在人为希望为空的变量/属性设置
    解除引用回收垃圾
    将会使用(被有效值赋值)的变量初始化为null
    null的类型是object
    typeof null -> object
    而null就是32个0
### undefined
    变量的“原始状态”
    未初始化变量，未声明属性，未传递实参，未声明变量的类型，void类型的变量，return; 都是undefined
    typeof undefined -> undefined
### NaN (Not a Number)
    typeof NaN -> number
