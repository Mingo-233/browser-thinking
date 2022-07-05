# webpack5新特性
## 1功能清除
1. 所有在 webpack 4 里面被废弃的能力都被清除，因此需要确保 webpack4 没有打印警告。
2. require.includes 语法已被废弃
3. 不再为 Node.js 模块引⼊ polyfill

## 2缓存
### 1⻓期缓存：确定的模块 Id、chunk 和导出名称
在生产模式下，默认的 chunkIds: “deterministic”, moduleIds: “deterministic”。设置成 deterministic 时默认最小 3 位数字会被使用

比如在webpack4中一个动态inport的文件内容变化，打包的时候这个chunk的名字就会变化，如果是使用顺序id，那么后面所有的chunkname都会依次变化。  

而如果使用deterministic，那么每一个模块的名字都是固定的，哪个模块变化了，变更哪个模块的名字

### 2 持久化缓存
在 webpack 4 ⾥⾯，可以使⽤ cache-loader 将编译结果写⼊硬盘缓存，还可以使⽤ babel-loader，设置option.cacheDirectory 将 babel-loader 编译的结果写进磁盘。

webpack 5 缓存策略
• 默认开启缓存，缓存默认是在内存⾥。可以对 cache 进⾏设置 。 • 缓存淘汰策略：⽂件缓存存储在 node_modules/.cache/webpack，最⼤ 500MB，缓存时常两个星期，旧的缓存先淘汰。

## 3构建优化
1 Tree Shaking 优化-嵌套的 Tree shaking
例如 a引入b，b引入c ，c中有q，w，e，r等多个变量，但是只用到了q，那么只用q会打包进去，而其他不会。简单来说webpack5实现了 嵌套的Tree shaking


2 构建优化：Tree Shaking 优化-内部模块 Tree shaking
```
import {a} form './a.js'
function useA(){
  return a
}

export function test (){
  return useA()
}
```
例如上面的代码，在webpack4中摇树优化中，useA这个函数没有被使用到，但是因为test的存在，所以他也会打包进去，但是在webpack5中不会。简单来说，webpack5中实现了代码依赖的分析。

## 4代码⽣成：⽀持⽣成 ES6 代码
webpack 4 之前只⽣成 ES5 的代码。 webpack 5 则现在既可以⽣成 ES5 ⼜可以⽣成 ES6/ES2015 代码。
两种设置⽅式：5 =< ecmaVersion <= 11 或 2009 =< ecmaVersion <= 2020

## 5开创性的特性：模块联邦

基本解释：使 ⼀个JavaScript 应⽤在运⾏过程中可以动态加载另⼀个应⽤的代码，并⽀持共享依赖（CDN）。不再需要本地安装 npm 包。

• Remote：被依赖⽅，被 Host 消费的 webpack 构建
• Host：依赖⽅，消费其他 Remote 的 webpack 构建
一个应用可以是 Host，也可以是 Remote，也可以同时是 Host 和 Remote。

以前的做法，要共享依赖，把某个依赖打包成npm包，在另一个项目中require进来使用。
使用模块联邦，当a项目启动时，能通过本地起的服务，例如localhost，拿到另一个b项目中共享出来的组件或者其他文件。

使用场景：微前端

# bundle与 bundless
## 资源加载的差异 
使用bundle，加载的时候页面会先加载打包后的bundle.js 文件，而是用bundless，则直接加载原生文件例如vue.js、 App.vue、a.js

## bundless优势
bundless 的冷启动时间大大缩短
bundless 的 HMR 速度不受整个项目体积影响
bundless 的单文件粒度的缓存更优

## 开发体验的对⽐
bundle 依赖 sourcemap,而bundless因为直接引用单文件，所以直接debug调试就行

## 总结
目前来说针对复杂场景，webpack打包仍是生产环境首选，但是在特定适用场景，使用vite 和bundless将大大提高开发阶段的效率