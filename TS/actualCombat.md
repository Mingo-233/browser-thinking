## 全局类型声明

### 1. 创建一个x.d.ts 声明文件

ex:
```
declare type anyobj = {
  [propName: string]: any;
};

```
### 2. 在tsc中进行配置

tsconfig.json中配置include属性，表示哪些文件使用ts配置。（如果不声明，像vue文件是无法使用的）
```
  "include": ["src/*.vue", "src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
```

### 3. eslint全局变量声明

对于每个全局变量键，将对应的值设置为等于以"writable"允许覆盖变量或"readonly"禁止覆盖
```
  globals: {
    anyobj: "readonly",
  },
```

## 类型导出
1 这里grey 导出的是一个已经申明类型的js变量 （不是ts类型）
2 StringValidator就是导出的一个ts类型
```
declare const grey: string[] & {
  primary?: string | undefined;
};

export interface StringValidator {
  name: string;
}


// import { grey } from "@/type/g";
import { StringValidator } from "@/type/g";

const d: StringValidator = {
  name: "ss",
};

```

### 申明模块

declare声明一个模块,通俗直白的理解就是declare就是告诉TS编译器你担保这些变量和模块存在，并声明了相应类型，编译的时候不需要提示错误！

最经典的声明模块应该是这样了

```
declare module '*.css';
declare module '*.less';
declare module '*.png';

```
在编辑ts文件的时候，如果你想导入一个.css/.less/.png格式的文件，如果没有经过declare的话是会提示语法错误的


### 命名空间 namespace

命名空间一个最明确的目的就是解决重名问题。

假设这样一种情况，当一个班上有两个名叫小明的学生时，为了明确区分它们，我们在使用名字之外，不得不使用一些额外的信息，比如他们的姓（王小明，李小明），或者他们父母的名字等等。

命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的。这样，在一个新的名字空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其他名字空间中。


比如

 在a处定义
```
namespace SomeNameSpaceName {
  export interface ISomeInterfaceName {
    name: string;
  }
}

```
 在b处使用
这里有2个名字叫ISomeInterfaceName的类型，一个从命名空间中取，两者互不干涉
 ```
const a: SomeNameSpaceName.ISomeInterfaceName = {
  name: "11",
};

interface ISomeInterfaceName {
  age: number;
}

const b: ISomeInterfaceName = {
  age: 0,
};

 ```

### 三斜线指令 ///

> 我们知道在 TS 项目中，文件之间相互引用是通过 import 来实现的，那么声明文件之间的引用呢？没错通过三斜线指令。


三斜线指令常用的就两个功能：
1倒入声明文件
2倒入第三方包

如果对比 import 的功能，我们可以写出如下的等式：

/// <reference path="..." /> == import filename.xxx
/// <reference types="..." /> == import lodash from "lodash"
