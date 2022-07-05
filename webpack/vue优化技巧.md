仅记录，非markdown格式

38.Vue性能优化技巧
1函数式组件
2将大量内容分割成子组件
3局部变量 
不用频繁使用this. ，因为每次访问响应式数据都会触发getter，导致执行后面的逻辑例如依赖收集等，在数据量大的情况性能影响较大
4 v-show
5 Deferred features 
分批渲染组件
当你有渲染耗时的组件，使用 Deferred 做渐进式渲染是不错的注意，它能避免一次 render 由于 JS 执行时间过长导致渲染卡住的现象。

<template>
  <div class="deferred-on">
    <VueIcon icon="fitness_center" class="gigantic"/>
    <h2>I'm an heavy page</h2>
    <template v-if="defer(2)">
      <Heavy v-for="n in 8" :key="n"/>
    </template>
    <Heavy v-if="defer(3)" class="super-heavy" :n="9999999"/>
  </div>
</template>
<script>
import Defer from '@/mixins/Defer'
export default {
  mixins: [
    Defer(),
  ],
}
</script>

Defer
<script >
export default function (count = 10) {
  return {
    data () {
      return {
        displayPriority: 0
      }
    },

    mounted () {
      this.runDisplayPriority()
    },
    methods: {
      runDisplayPriority () {
        const step = () => {
          requestAnimationFrame(() => {
            this.displayPriority++
            if (this.displayPriority < count) {
              step()
            }
          })
        }
        step()
      },
      defer (priority) {
        return this.displayPriority >= priority
      }
    }
  }
}
</script>

6 Time slicing 时间片切割技术
https://blog.csdn.net/weixin_40906515/article/details/108633532

<script >

fetchItems ({ commit }, { items, splitCount }) {
  commit('clearItems')
  const queue = new JobQueue()
  splitArray(items, splitCount).forEach(
    chunk => queue.addJob(done => {
      // 分时间片提交数据
      requestAnimationFrame(() => {
        commit('addItems', chunk)
        done()
      })
    })
  )
  await queue.start()
}
</script>

为什么在优化前页面会卡死呢？因为一次性提交的数据过多，内部 JS 执行时间过长，阻塞了 UI 线程，导致页面卡死。
使用 Time slicing技术可以避免页面卡死，通常我们在这种耗时任务处理的时候会加一个 loading 效果，在这个示例中，我们可以开启 loading animation，然后提交数据。对比发现，优化前由于一次性提交数据过多，JS 一直长时间运行，阻塞 UI 线程，这个 loading 动画是不会展示的，而优化后，由于我们拆成多个时间片去提交数据，单次 JS 运行时间变短了，这样 loading 动画就有机会展示了
核心技术 requestAnimationFrame
7非响应式数据 
<script >
function optimizeItem (item) {
  const itemData = {
    id: uid++,
    vote: 0
  }
  Object.defineProperty(itemData, 'data', {
    // Mark as non-reactive
    configurable: false,
    value: item
  })
  return itemData
}
</script>
优化后我们把新提交的数据中的对象属性 data 手动变成了 configurable 为 false，这样内部在 walk 时通过 Object.keys(obj) 获取对象属性数组会忽略 data，也就不会为 data 这个属性 defineReactive，由于 data 指向的是一个对象，这样也就会减少递归响应式的逻辑，相当于减少了这部分的性能损耗。数据量越大，这种优化的效果就会更明显
> (本质原因是enumerable默认为false，不可枚举后才被Object.keys(obj)所拿到值)

或者使用Object.freeze( )技术