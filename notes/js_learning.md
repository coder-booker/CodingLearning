# ***函数***
### 箭头函数
    () => xxxx; 隐性返回xxxx
    () => {return xxxx;}; 显性返回xxxx
<br>

# ***基础***
    变量二进制的低三位代表其类型：000: 对象，001：整数，100：字符串等
    == 类型转换同一再对比
    === 不做类型转换
        类型对比 -> 如一样则对比值，如果是数字就得额外判断NaN，如果是对象或函数则对比引用


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
