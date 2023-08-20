## Q 什么是虚拟dom，为什么需要虚拟dom
 使用虚拟dom效率更高？ 瞎几把扯淡。 
我们先看vue 或者react这种框架渲染的流程： 数据变化=》 生成vdom，diff=》对真实dom操作
原生： 数据变化=》 对真实dom操作。

所以说使用了虚拟dom，并不会提升效率的，一定是原生效率高，那为什么需要虚拟dom呢？

1 像vue或者react这种框架，采用数据驱动的思路，数据和视图一一对应，但是一个数据可能在多个地方会用到，此时没有办法那么精确，我这个数据变了，哪个位置要重写渲染，所以采取的办法是所有地方全部重新渲染。这个方法如果是原生直接操作，那么消耗量太夸张了，所以引入了虚拟dom，利用js计算替换大量的浏览器dom消耗。
2 抽象，创造出一种ui表达方式，使得具有跨平台的作用，在移动端app或者桌面适用

## Q vue3的diff和vue2有什么区别
vue3中重写了diff实现，所以代码层面上大多不一样了，但是实现思路还是一致的，在这个过程中做了很多的优化
1事件缓存：将事件缓存，可以理解为变成静态的了
2添加静态标记：Vue2 是全量 Diff，Vue3 是静态标记 + 非全量 Diff   （静态标记，比如写死的html结构数据）
3静态提升：创建静态节点时保存，后续直接复用 （在vue2中每次有更新的时候，会把所有的元素都重写创建，不管参不参与更新，现在会把静态节点保存起来，后续复用）
4使用最长递增子序列优化了对比流程：Vue2 里在 updateChildren() 函数里对比变更，在 Vue3 里这一块的逻辑主要在 patchKeyedChildren() 函数里，

## Q 讲一下vue模板编译的过程

我们知道 `<template></template> `这个是模板，不是真实的 HTML，浏览器是不认识模板的，所以我们需要把它编译成浏览器认识的原生的 HTML
这一块的主要流程就是:

1. 提取出模板中的原生 HTML 和非原生 HTML，比如绑定的属性、事件、指令等等
2. 经过一些处理生成 render 函数
3. render 函数再将模板内容生成对应的 vnode
4. 再经过 patch 过程( Diff )得到要渲染到视图中的 vnode
5. 最后根据 vnode 创建真实的 DOM 节点，也就是原生 HTML 插入到视图中，完成渲染

上面的 1、2、3 条就是模板编译的过程了
那它是怎么编译，最终生成 render 函数的呢？

编译的流程，主要有三步：

1. 模板解析：通过正则等方式提取出 <template></template> 模板里的标签元素、属性、变量等信息，并解析 成抽象语法树 AST
2. 优化：遍历 AST 找出其中的静态节点和静态根节点，并添加标记
3. 代码生成：根据 AST 生成渲染函数 render，rennde函数的返回值就是虚拟dom的结构，包含tag、attr、事件等属性


## Q vue2 diff 双端比较
diff 的核心目的：复用，利用一种算法找出需要移动的dom和如何进行移动


react中的思路：最大索引值，寻找需要移动的dom。

如果在寻找的过程中遇到的索引呈现递增趋势，则说明新旧 children 中节点顺序相同，不需要移动操作。相反的，如果在寻找的过程中遇到的索引值不呈现递增趋势，则说明需要移动操作。

vue中的思路：双端比较

一、
oldStart 与 newStart比较；
oldEnd 与 newEnd比较；
oldStart 与 newEnd比较；
oldEnd 与 newStart比较；

当oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx 条件不成立时终止。

理想的情况下，双端四次比较中，找到了复用的节点，那边此时移动dom，并切更新最新索引

二、非理想的情况下，四次比较中都没有找到相同的，此时会拿newchildren中的第一个，去遍历oldchildren找是否有相同的。如果找到了，说明原先的这个节点目前是新节点的中的第一位，所以把这个dom移动到最前面就可以了。
```
      patch(vnodeToMove, newStartVNode, container)
      // 把 vnodeToMove.el 移动到最前面，即 oldStartVNode.el 的前面
      container.insertBefore(vnodeToMove.el, oldStartVNode.el)
      // 由于旧 children 中该位置的节点所对应的真实 DOM 已经被移动，所以将其设置为 undefined
      prevChildren[idxInOld] = undefined
    }
    // 将 newStartIdx 下移一位
    newStartVNode = nextChildren[++newStartIdx]
```
三、添加新节点
在上面，我们尝试拿着新 children 中的第一个节点去旧 children 中寻找与之拥有相同 key 值的可复用节点，然后并非总是能够找得到，当新的 children 中拥有全新的节点时，就会出现找不到的情况，

此时需要挂载一个新节点上去。

此外当循环结束之后，立即判断 oldEndIdx 的值是否小于 oldStartIdx 的值， 如果条件成立，则需要使用 for 循环把所有位于 newStartIdx 到 newEndIdx 之间的元素都当做全新的节点添加到容器元素中，这样我们就完整的实现了完整的添加新节点的功能。
四、删除节点
此外当循环结束之后，newStartId >newEndIdx 时，说明旧的节点仍多，需要删除多余的节点。


## Q vue3 响应式


### 副作用函数
Vue3通过创建Proxy的实例对象而实现的，它们都是收集依赖、通知依赖更新。而Vue3中把依赖 命名为副作用函数effect，也就是数据改变发生的副作用。
所以说 effect副作用函数的作用就是 1收集依赖 2通知更新 触发视图等更新

### 全局变量activeEffect


建立数据与副作用函数之间的关联： 在副作用函数内部访问响应式数据时，会触发数据的依赖追踪，将数据与当前的 activeEffect 关联起来。（塞带depsMap中的dep里去）这样，当数据发生变化时，就可以通过 activeEffect 来找到需要重新运行的副作用函数。

### Weak、Map、Set三个集合方法

前提问题：

假如读取不存在的属性的时候，副作用函数发生什么？ 副作用函数会被重新执行，由于目标字段与副作用函数没有建立明确的函数联系。所以这就需要引入唯一key辨识每一个数据的副作用函数，以target（目标数据）、key（字段名）、effectFn（依赖）
分三种情况分析副作用函数存储数据唯一标识：
1. 两个副作用函数同时读取同一个对象的属性值：
2. 一个副作用函数中读取了同一个对象不同属性：
3. 不同副作用函数中读取两个不同对象的相同属性：

所以为了解决这些不同情况的副作用保存问题，所以Vue3引入了Weak、Map、Set三个集合方法来保存对象属性的相关副作用函数：

![](https://mmbiz.qpic.cn/mmbiz/pfCCZhlbMQToQ8GUib0uia7klolUfLrBntYYIyHgEBKutj5YNh7S66jRbtSKYPAPk7k9hZOIfIicyYKrV6poMNPxw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)


### 依赖清理

前提问题：在一个副作用函数中调用了对象的两个属性
```
const effectFn = (() => {
  const str = obj.status ? '' : obj.type;
})
const obj = new Proxy(house, {
  get(target, key) {
    console.log('get run!');// 打印了两次
    ...
  },
  set(target, key, newVal) {
   ...
  }
})
```

解决思路就是当每次副作用函数执行时，我们可以先把它从所有与之关联的依赖集合中删除。
源码例子：
```
// 清空副作用函数依赖的集合
function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}
```

**嵌套副作用函数处理**：由于副作用函数可能是嵌套，比如副作用函数中effectFn1中有还有一个副作用函数effectFn2，以上面的方法对于嵌套函数的处理用全局变量 activeEffect 来存储通过 effect 函数注册的副作用函数，这意味着同一时刻 activeEffect 所存储的副作用函数只能有一个。当副作用函数发生嵌套时，内层副作用函数的执行会覆盖 activeEffect 的值，并且永远不会恢复到原来的值。看了很多资料举例用effect栈存储，是的没错，当执行副作用函数的时候把它入栈，执行完毕后把它出栈。现在我们一起看一下源码怎么处理的：

按位跟踪标记递归深度方式（优化方案）：通过用二进制位标记当前嵌套深度的副作用函数是否记录过，如果记录过就，如果已经超过最大深度，因为采用降级方案，是全部删除然后重新收集副作用函数的。
```
let effectTrackDepth = 0 // 当前副作用函数递归深度
export let trackOpBit = 1 // 在track函数中执行当前的嵌套副作用函数的标志位
const maxMarkerBits = 30 // 最大递归深度支持30位， 为什么需要设置30位，因为31位会溢出。
```

```
// 每次执行 effect 副作用函数前，全局变量嵌套深度会自增1
trackOpBit = 1 << ++effectTrackDepth

// 执行完副作用函数后会自减
trackOpBit = 1 << --effectTrackDepth;
```

当超过递归深度，就会采用全量清理的方案
```
  if (effectTrackDepth <= maxMarkerBits) {
    // 执行副作用函数之前，使用 `deps[i].w |= trackOpBit`对依赖dep[i]进行标记，追踪依赖
    initDepMarkers(this)
  } else {
    // 降级方案：完全清理
    cleanupEffect(this)
  }
  ```
清理依赖
```
export const finalizeDepMarkers = (effect: ReactiveEffect) => {
  const { deps } = effect
  if (deps.length) {
    let ptr = 0
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i]
      // 有 was 标记但是没有 new 标记，应当删除
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect)
      } else {
        // 需要保留的依赖
        deps[ptr++] = dep
      }
      // 清空，把当前位值0，先按位非，再按位与
      dep.w &= ~trackOpBit
      dep.n &= ~trackOpBit
    }
    // 保留依赖的长度
    deps.length = ptr
  }
}
```


  如何判断当前依赖是否已记录过，通过按位与判断是否有位已经标识，有就大于0：

```
//代表副作用函数执行前被 track 过
export const wasTracked = (dep: Dep): boolean => (dep.w & trackOpBit) > 0
//代表副作用函数执行后被 track 过
export const newTracked = (dep: Dep): boolean => (dep.n & trackOpBit) > 0
```


### Vue3响应式原理小结:

* activeEffect解决匿名函数问题。
* WeakMap、Map、Set存储对象属性的相关副作用函数。
* 处理副作用函数时，假如有多个响应式属性，控制只触发生效的属性或用到的属性。
* 嵌套副作用函数，使用二进制位记录嵌套副作用，通过控制二进制位是否清理嵌套副作用实现层级追踪。
* track()实现依赖收集、层级依赖追踪、依赖清理（解决嵌套副作用）。
* trigger()当某个依赖值发生变化时触发的, 根据依赖值的变化类型, 会收集与依赖相关的不同副作用处理对象, 然后逐个触发他们的 run 函数, 通过执行副作用函数获得与依赖变化后对应的最新值

