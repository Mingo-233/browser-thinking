## 1 类型操作符

ts 中也定义了大量类型操作，例如 &（对象类型合并）、|（联合类型）等等，这些操作可以操作 TS 的类型

### 1.1 & - 合并类型对象
& 合并多个类型对象的键到一个类型对象中。

```
type A = { a: number }
type B = { b: string }
type C = A & B;
// C 包含 A 和 B 定义的所有键
/**
* C = {
    a: number;
    b: string;
  }
*/
const c: C = {
  a: 1,
  b: '1'
}
```
### 1.2 | - 联合类型

|将多个类型组成联合类型：
```
type A = string | number;
type B = string;
```
此时类型 A 既可以是 string 又可以是 number，类型 B 是类型 A 的子集，所有能赋值给类型 B 的值都可以赋值给类型 A。

### 1.3 keyof - 获取对象类型的键

keyof 可以获取某些对象类型的键：

interface People {
  a: string;
  b: string;
}

// 返回 'a' | 'b'
type KeyofPeople = keyof People;
// type KeyofPeople = 'a' | 'b';   此时只能输入 a或者b
用这种方式可以获取某个类型的所有键。

> 注意 keyof 只能对类型使用，如果想要对值使用，需要先使用 typeof 获取类型

### 1.4 typeof - 获取值的类型

typeof 可以获取值的类型。

```
// 获取对象的类型
const obj = { a: '123', b: 123 }
type Obj = typeof obj;
/**
type Obj = {
    a: string;
    b: number;
}
*/

// 获取函数的类型
function fn(a: Obj, b: number) {
  return true;
}
type Fn = typeof fn;
/**
type Fn = (a: Obj, b: number) => boolean
*/

```
注意对于 enum 需要先进行 typeof 操作获取类型，才能通过 keyof 等类型操作完成正确的类型计算（因为 enum 可以是类型也可以是值，如果不使用 typeof 会当值计算）：
```
enum E1 {
  A,
  B,
  C
}

type TE1 = keyof E1;
/**
拿到的是错误的类型
type TE1 = "toString" | "toFixed" | "toExponential" | "toPrecision" | "valueOf" | "toLocaleString"
*/

type TE2 = keyof typeof E1;
/**
拿到的是正确的类型
type TE2 = "A" | "B" | "C"
使用TE2的话是，只能输入 A 或B C字符
*/
```

### 1.5 [...] - 元组展开与合并

元组可以视为长度确定的数组，元组中的每一项可以是任意类型。通过 [...元组, ...元组] 语法可以合并两个元组。

```
type TupleA = [1, 2, 3]
type TupleB = [...TupleA, 4]
/**
type TupleB = [1, 2, 3, 4]
*/
type TupleC = [0, ...TupleA]
/**
type TupleC = [0, 1, 2, 3]
*/
```

### 1.6 [in] - 遍历对象键值

在对象类型中，可以通过 [临时类型变量 in 联合类型] 语法来遍历对象的键，示例如下：

// 下述示例遍历 '1' | '2' | 3' 三个值，然后依次赋值给 K，K 作为一个临时的类型变量可以在后面直接使用 
/**
下述示例最终的计算结果是：
```
type MyType = {
    1: "1";
    2: "2";
    3: "3";
}
```
因为 K 类型变量的值在每次遍历中依次是 '1', '2', '3' 所以每次遍历时对象的键和值分别是 { '1': '2' } { '2': '2' } 和 { '3': '3' }，
最终结果是这个三个结果取 &
```
*/
type MyType = {
  // 注意能遍历的类型只有 string、number、symbol，也就是对象键允许的类型
  [K in '1' | '2' | '3']: K 
}
```

[in] 常常和 keyof 搭配使用，遍历某一个对象的键，做相应的计算后得到新的类型，如下：
```
type Obj = {
  a: string;
  b: number;
}
/**
```
遍历 Obj 的所有键，然后将所有键对应的值的类型改成 boolean | K，返回结果如下：
```
type MyObj = {
    a: boolean | "a";
    b: boolean | "b";
}
这样我们就实现了给 Obj 的所有值的类型加上 | boolean 的效果
*/
type MyObj = {
  [K in keyof Obj]: boolean | K
}
```


### 1.7  类型守卫
TypeScript 中提供了非常强大的类型推导能力，它会随着你的代码逻辑不断尝试收窄类型，这一能力称之为类型的控制流分析（也可以简单理解为类型推导）。

```
function isString(input: unknown): boolean {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 类型“string | number”上不存在属性“replace”。
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```

使用类型守卫函数
```
function isString(input: unknown): input is string {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 正确了
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```

isString 函数称为类型守卫，在它的返回值中，我们不再使用 boolean 作为类型标注，而是使用 input is string 这么个奇怪的搭配，拆开来看它是这样的：

input 函数的某个参数；
is string，即 is 关键字 + 预期类型，即如果这个函数成功返回为 true，那么 is 关键字前这个入参的类型，就会被这个类型守卫调用方后续的类型控制流分析收集到。
## 2范型

### 2.1 范性约束

我所理解的就是约束住类型

```
interface LLength {
  length:number
}
function fn<T extends LLength>(x:T):void{
  console.log(x.length);
}
fn('ds')
```

```
此时函数的参数只能输入数字或字符串
function fn<T extends number | string>(x:T):void{
  console.log(x);
  
}
fn(12)
```


## 3工具类型

工具类型的分类


* 对属性的修饰，包括对象属性和数组元素的可选/必选、只读/可写。我们将这一类统称为属性修饰工具类型。
*  对既有类型的裁剪、拼接、转换等，比如使用对一个对象类型裁剪得到一个新的对象类型，将联合类型结构转换到交叉类型结构。我们将这一类统称为结构工具类型。
* 对集合（即联合类型）的处理，即交集、并集、差集、补集。我们将这一类统称为集合工具类型。
* 基于 infer 的模式匹配，即对一个既有类型特定位置类型的提取，比如提取函数类型签名中的返回值类型。我们将其统称为模式匹配工具类型。
* 模板字符串专属的工具类型，比如神奇地将一个对象类型中的所有属性名转换为大驼峰的形式。这一类当然就统称为模板字符串工具类型了。


### 属性修饰工具类型


type Partial<T> = {
    [P in keyof T]?: T[P];
};

type Required<T> = {
    [P in keyof T]-?: T[P];
};

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// 去除全部只读  这个方法是ts官网非内置的
type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};


思考
现在我们了解了 Partial、Readonly 这一类属性修饰的工具类型，不妨想想它们是否能满足我们的需要？假设场景逐渐开始变得复杂，比如以下这些情况：

现在的属性修饰是浅层的，如果我想将嵌套在里面的对象类型也进行修饰，需要怎么改进？
现在的属性修饰是全量的，如果我只想修饰部分属性呢？这里的部分属性，可能是基于传入已知的键名来确定（比如属性a、b），也可能是基于属性类型来确定(比如所有函数类型的值)？

export type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type DeepRequired<T extends object> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

// 也可以记作 DeepImmutable
export type DeepReadonly<T extends object> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

export type DeepMutable<T extends object> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};


// 在对象结构中我们也常声明类型为 string | null 的形式，代表了“这里有值，但可能是空值”。此时，我们也可以将其等价为一种属性修饰（Nullable 属性，前面则是 Optional / Readonly 属性）。
type NonNullable<T> = T extends null | undefined ? never : T;
let stringVarA :NonNullable<string>
 
export type DeepNonNullable<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<T[K]>
    : NonNullable<T[K]>;
};

> 需要注意的是，DeepNullable 和 DeepNonNullable 需要在开启 --strictNullChecks 下才能正常工作。
### 结构工具类型

这一部分的工具类型主要使用条件类型以及映射类型、索引类型。

结构工具类型其实又可以分为两类，结构声明和结构处理。

#### 结构声明
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

其中，Record<string, unknown> 和 Record<string, any> 是日常使用较多的形式，通常我们使用这两者来代替 object 。

Dictionary （字典）结构只需要一个作为属性类型的泛型参数即可。

// ts官网非内置
type Dictionary<T> = {
  [index: string]: T;
};

// ts官网非内置
type NumericDictionary<T> = {
  [index: number]: T;
};

#### 结构处理

type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;