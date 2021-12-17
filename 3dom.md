# 一、async 和 defer

都是异步去加载文件，但区别在使用 async 标志的脚本文件一旦加载完成，会立即执行，执行顺序和申明顺序就不相关了；而使用了 defer 标记的脚本文件，需要在 DOMContentLoaded 事件之前执行。
```
<script  type="text/javascript" src='foo.js'></script>

<script async type="text/javascript" src='foo.js'></script>

<script defer type="text/javascript" src='foo.js'></script>
```
推荐应用场景  
defer
如果你的脚本代码依赖于页面中的DOM元素（文档是否解析完毕），或者被其他脚本文件依赖。
例： 评论框、代码语法高亮 、polyfill.js

async
如果你的脚本并不关心页面中的DOM元素（文档是否解析完毕），并且也不会产生其他脚本需要的数据。
如：百度统计、Google Analytics
如果不太能确定的话，用defer总是会比async稳定。。。

# 二、js、css、dom解析渲染之间的关系
  * JS会阻塞DOM解析
  * CSS会阻塞JS的执行
  * CSS不会阻塞DOM解析，但是会阻塞DOM渲染，严谨一点则是CSS会阻塞render tree的生成，进而会阻塞DOM的渲染


# 三、requestAnimationFrame

## requestAnimationFrame 和 setTimeout

### setTimeout
setTimeout通过设置一个间隔时间来不断的改变图像的位置，从而实现动画效果。但我们会发现，利用seTimeout实现的动画在某些低端机上会出现卡顿、抖动的现象。这种现象的产生有两个原因：

* setTimeout的执行时间并不是确定的。在Javascript中， setTimeout 任务被放进了异步队列中，只有当主线程上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行，因此 setTimeout 的实际执行时间一般要比其设定的时间晚一些。
* 刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的屏幕刷新频率可能会不同，而 setTimeout只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。

### requestAnimationFrame
* 最大的优势是由系统来决定回调函数的执行时机。具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象

* 使用setTimeout实现的动画，当页面被隐藏或最小化时，setTimeout 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费CPU资源。而requestAnimationFrame则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统步伐走的requestAnimationFrame也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。