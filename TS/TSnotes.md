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
