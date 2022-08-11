## 结构化类型系统
代表语言 ts python C#

ts属于结构化类型系统，结构化类型系统意味着基于完全的类型结构来判断类型兼容性。


例如
```
class Cat {
  meow() { }
  eat() { }
}

class Dog {
  eat() { }
}

function feedCat(cat: Cat) { }

// 报错！  这里报错是因为ts判断类型标注cat存在meow方法 但是传入的dog类型没有
feedCat(new Dog())
```

```
class Cat {
  eat() { }
}

class Dog {
  bark() { }
  eat() { }
}

function feedCat(cat: Cat) { }
<!-- 这里不报错是因为dog 完全适配兼容了 cat的方法，dog被认为是cat的一个子类扩展  -->
feedCat(new Dog())
```

```
class Cat {
  eat(): boolean {
    return true
  }
}

class Dog {
  eat(): number {
    return 599;
  }
}

function feedCat(cat: Cat) { }
 
// 报错！  这里报错是因为，ts的结构化类型系统，会根据完全的类型结构来判断兼容性，这里存在同名方法，但是返回类型不同，因此ts认为这并不兼容
feedCat(new Dog())
```


## 标称类型系统
代表语言 C++、Java、Rust

标称类型系统（Nominal Typing System）要求，两个可兼容的类型，其名称必须是完全一致的，比如以下代码：
（这里的名称指的是类型的名称）
```
type USD = number;
type CNY = number;

const CNYCount: CNY = 200;
const USDCount: USD = 200;

function addCNY(source: CNY, input: CNY) {
  return source + input;
}

addCNY(CNYCount, USDCount)

```
如果按照标称类型系统，这边应该是会报错的，因为传入的值类型为人民币和美元，但是USDCount类型 其实并不是 input 的 CNY，所以这里应该是要报错的（但是ts属于结构化类型系统）

那用ts如何模拟标称类型系统呢？

类型的重要意义之一是限制了数据的可用操作与实际意义。这往往是通过类型附带的额外信息来实现的（类似于元数据），要在 TypeScript 中实现，其实我们也只需要为类型额外附加元数据即可，比如 CNY 与 USD，我们分别附加上它们的单位信息即可，但同时又需要保留原本的信息（即原本的 number 类型）。

2个方法：
1从类型层面，为类型附加信息的方式
2从逻辑层面，为类型附加信息的方式
这两种方式其实并没有非常明显的优劣之分，基于类型实现更加轻量，你的代码逻辑不会受到影响，但难以进行额外的逻辑检查工作。而使用逻辑实现稍显繁琐，但你能够进行更进一步或更细致的约束。