# Bootstrap

### Quick start
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
```
- `integrity`: 一个hash，用来对比服务器返回的内容和这个hash匹不匹配，如不匹配就不load
- `crossorigin="anonymous"`: 字面意思


### idk
- 以class为主要css配置，然后局部自定义客制化css
- components and utilities
    - 基于components examples来开发学习
    - 然后再看情况客制化utilities
- Components
    - 看doc
    - have learnt:
        - carousel
        - navbar
        - data-bs-target (component会用到的数据属性)
- Utilities
    - 一般分为几个部分：
        - [prefix]-{[infix, ...]}-[suffix]
        - prefix一般代指主要功能
            - prefix有时候会有不使用'-'的额外配置，例如margin的ms/me
        - infix则一般是responsive设计的配置，如sm/lg/xl、print啥的
        - suffix则是主要功能的具体配置
    - have learnt
        - margin: m
        - bg
        - display: d
