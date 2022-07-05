
## polyfill
--- 
### babel 和 polyfill
  很多小白使用babel后就认为可以随意使用es2015，不用担心兼容性问题，但是事实babel 的编译不会做 polyfill。那么 polyfill 是指什么呢?
  例如

```
const foo = (a, b) => {
    return Object.assign(a, b);
}; 
```

当我们写出上面这样的代码，交给 babel 编译时，我们得到了：

```
"use strict";        

var foo = function foo(a, b) {
    return Object.assign(a, b);
}; 
```

arrow function 被编译成了普通的函数，但仔细一看 Object.assign 还牢牢的站在那里，而它作为 es2015 的新方法，并不能运行在相当多的浏览器上。为什么不把 Object.assign 编译成 (Object.assign||function() { /*...*/}) 这样的替代方法呢？好问题！编译为了保证正确的语义，只能转换语法而不是去增加或修改原有的属性和方法。所以 babel 不处理 Object.assign 反倒是最正确的做法。而处理这些方法的方案则被称为 polyfill。

###  babel-plugin-transform-xxx   

解决上述问题最简单的思路就是缺什么补什么，babel 提供了一系列 transform 的插件来解决这个问题，例如针对 Object.assign，我们可以使用 babel-plugin-transform-object-assign
```
yarn add babel-plugin-transform-object-assign
# in .babelrc
{
  "presets": ["latest"],
  "plugins": ["transform-object-assign"]
}
```

但是这种方法有一个问题，transform 的引用是 module 级别的，这意味着在多个 module 使用时会带来重复的引用，这在多文件的项目里可能带来灾难。而且，你可能也并不想一个个的去添加自己要用的 plugin，如果能自动引入该多好。


### babel-runtime & babel-plugin-transform-runtime
前面提到问题主要在于方法的引入方式是内联的，直接插入了一行代码从而无法优化。鉴于这样的考虑，babel 提供了 babel-plugin-transform-runtime，从一个统一的地方 core-js自动引入对应的方法。

安装和使用的方法同样不复杂：
```
yarn add -D babel-plugin-transform-runtime
yarn add babel-runtime
# .babelrc
{
  "presets": ["latest"],
  "plugins": ["transform-runtime"]
}
```

首先需要安装开发时的依赖 babel-plugin-transform-runtime。同时还需要安装生产环境的依赖 babel-runtime。一切就绪，编译时它会自动引入你用到的方法。但是这样也会有问题，比如下面这个例子：
```
export const foo = (a, b) => Object.assign(a, b);

export const bar = (a, b) => {
    const o = Object;
    const c = [1, 2, 3].includes(3);
    return c && o.assign(a, b);
};
```
会编译成：
```
var _assign = __webpack_require__(214);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var foo = exports.foo = function foo(a, b) {
    return (0, _assign2.default)(a, b);
};

var bar = exports.bar = function bar(a, b) {
    var o = Object;
    var c = [1, 2, 3].includes(3);
    return c && o.assign(a, b);
};
```
foo 中的 assign 会被替换成 require 来的方法，所以_assign2这个方法是可以正常使用的。
但是在bar 中这样非直接调用的方式则无能为力了，从Object上取或者像 [1,2,3].includes从Array.prototype.includes上调用就无法正常使用了。
因为 babel-plugin-transform-runtime 依然不是全局生效的，因此实例化的对象方法则不能被 polyfill。

### babel-polyfill
上面两种 polyfill 方案共有的缺陷在于作用域。
因此 babel 直接提供了通过改变全局来兼容 es2015 所有方法的 babel-polyfill，安装 babel-polyfill 后你只需要在所有代码的最前面加一句 import 'babel-polyfill' 便可引入它，如果使用了 webpack 也可以直接在 entry 中添加 babel-polyfill 的入口。
```
import 'babel-polyfill';

export const foo = (a, b) => Object.assign(a, b);
```

但是加入 babel-polyfill 后，打包好的 pollyfill.js 一下子增加到了 251kb（未压缩）

babel-polyfill 在项目代码前插入所有的 polyfill 代码，为你的程序打造一个完美的 es2015 运行环境。babel 建议在网页应用程序里使用 babel-polyfill，只要不在意它略有点大的体积（min 后 86kb），直接用它肯定是最稳妥的。值得注意的是，因为 babel-polyfill 带来的改变是全局的，所以无需多次引用，也有可能因此产生冲突，所以最好还是把它抽成一个 common module，放在项目 的 vendor 里，或者干脆直接抽成一个文件放在 cdn 上。

### babel-preset-env

上面的方案还可以再优化，优化的点就在体积大小。 babel-preset-env它可以根据指定目标环境判断需要做哪些编译。只需引入 babel-polyfill，并在 babelrc 中声明 useBuiltIns，babel 会将引入的 babel-polyfill 自动替换为所需的 polyfill。

```
 .babelrc
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["IE >= 9"]
      },
      "useBuiltIns": true
    }]
  ]
}
比如IE >=9 的意思就是ie9以下包括ie9浏览器版本不支持的方法和属性都要引入编译
```
对比 "IE >= 9" 和 "chrome >= 59" 环境下编译后的文件大小:
```
Asset                  Size       Chunks           
         polyfill.js   252 kB       0  [emitted]  [big]
              ie9.js   189 kB       1  [emitted]
           chrome.js  30.5 kB       2  [emitted]
transform-runtime.js  17.3 kB       3  [emitted]
transform-plugins.js  3.48 kB       4  [emitted]
```
### polyfill.io
更优秀的办法，polyfill服务。
你可以尝试在不同的浏览器下请求 https://cdn.polyfill.io/v2/polyfill.js 这个文件，服务器会判断浏览器 UA 返回不同的 polyfill 文件，你所要做的仅仅是在页面上引入这个文件，polyfill 这件事就自动以最优雅的方式解决了。更加让人喜悦的是，http://polyfill.io 不旦提供了 cdn 的服务，也开源了自己的实现方案 polyfill-service。
他的思路是不在打包的时候引入，而是网页被浏览器打开的时候，向polyfill服务发送一个请求，携带的参数是当前浏览器版本或者型号（user agent），服务会根据当前型号返回相适应的编译语法配置。

但是它仍然存在一定的问题，就是当前国内浏览器环境比较混乱，没有一个标准，有些浏览器厂商可能会随意更改一些配置，导致返回的语法配置不准确。