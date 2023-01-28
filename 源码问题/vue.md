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