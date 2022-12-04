
## 支持多个v-model
如果v-model没有使用参数，则其默认值为modelValue，如上面的第一个v-model，注意此时不再是像Vue2那样使用$emit('input')了，而是统一使用update:xxx的方式。

废弃.sync
在Vue2中，由于一个组件只支持一个v-model，当我们还有另外的值也想要实现双向绑定更新时，往往用.sync修饰符来实现，而在Vue3中该修饰符已被废弃，因为v-model可以支持多个，所以.sync也就没有存在的必要了
```
// 父组件
<template>
  <child v-model="name" v-model:email="email" />
  <p>姓名：{{ name }}</p>
  <p>邮箱：{{ email }}</p>
</template>

<script lang="ts" setup>
import child from './child.vue'
import { ref } from 'vue'

const name = ref<string>('张三')
const email = ref<string>('666@qq.com')
</script>
```
```
// 子组件
<template>
  <button @click="updateName">更新name</button>
  <button @click="updateEmail">更新email</button>
</template>

<script lang="ts" setup>
// 定义emit
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:email', value: string): void
}>()

const updateName = () => {
  emits('update:modelValue', '李四')
}

const updateEmail = () => {
  emits('update:email', '123456@qq.com')
}
</script>
```


## watch
基础数据类型的监听：
```
const name = ref<string>('张三')
watch(name, (newValue, oldValue) => {
  console.log('watch===', newValue, oldValue)
})
```

复杂数据类型的监听：
```
interface UserInfo {
  name: string
  age: number
}

const userInfo = reactive<UserInfo>({
  name: '张三',
  age: 10
})
// 监听整个对象
watch(userInfo, (newValue, oldValue) => {
  console.log('watch userInfo', newValue, oldValue)
})

// 监听某个属性
watch(() => userInfo.name,  (newValue, oldValue) => {
  console.log('watch name', newValue, oldValue)
})
```


支持监听多个源

```
const name = ref<string>('张三')
const userInfo = reactive({
  age: 18
})

// 同时监听name和userInfo的age属性
watch([name, () => userInfo.age], ([newName, newAge], [oldName, oldAge]) => {
  // 
})
```

## watchEffect与watch的区别

相比Vue2，Vue3多了watchEffect这个API，watchEffect传入一个函数参数，该函数会立即执行，同时会响应式的最终函数内的依赖变量，并在依赖发生改变时重新运行改函数。(而watch是懒执行的)
```
const name = ref<string>('张三')
const age = ref<number>(18)

watchEffect(() => {
  console.log(`${name.value}：${age.value}`) // 张三：18
})

setTimeout(() => {
  name.value = '李四' // 李四：18
}, 3000)

setTimeout(() => {
  age.value = 20 // 李四：20
}, 5000)
```


**和watch的区别**
1. 运行时机不同，watchEffect会立即执行，相当于设置了immediate: true的watch。
2. watchEffect无法获取改变前后的值。
3. 与watch显示的指定依赖源不同，watchEffect会自动收集依赖源。


用watchEffect还是watch？

具体还是根据实际业务情况，但是大多数情况下，建议使用watch，避免一些不必要的重复触发。


## $attrs
Vue3中，$attrs包含父组件中除props和自定义事件外的所有属性集合。

不同于Vue2，$attrs包含了父组件的事件，因此$listenners则被移除了。

```
// 父组件
<template>
  <child id="root" class="test" name="张三" @confirm="getData" />
</template>

<script lang="ts" setup>
const getData = () => {
  console.log('log')
}
</script>

// 子组件
<template>
  <div>
    <span>hello：{{ props.name }}</span>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
const props = defineProps(['name'])

const attrs = useAttrs()
console.log('attrs', attrs)
</script>
```

使用v-bind即可实现组件属性及事件透传：

```
// 父组件
<template>
  <child closeable @close="onClose" />
</template>

<script lang="ts" setup>
const onClose = () => {
  console.log('close')
}
</script>

// 子组件
<template>
  <div>
    <el-tag v-bind="attrs">标签</el-tag>
  </div>
</template>

```
小提示：没有参数的 v-bind 会将一个对象的所有属性都作为 attribute 应用到目标元素上。

## 使用ref访问子组件

在Vue2中，使用ref即可访问子组件里的任意数据及方法，但在Vue3中则必须使用defineExpose暴露子组件内的方法或属性才能被父组件所调用。

```
// 父组件
<template>
  <child ref="childRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const childRef = ref()

onMounted(() => {
  childRef.value.getData()
})
</script>

// 子组件
<script lang="ts" setup>
import { defineExpose } from 'vue'

const getData = () => {
  console.log('getData')
}
const name = ref('张三')

defineExpose({
  getData,
  name
})
</script>
```

## 为 ref() 标注类型
通过接口指定类型。有时我们可能想为 ref 内的值指定一个更复杂的类型，可以使用 Ref 这个接口：

```
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2022')
year.value = 2022 // 成功！
```

通过泛型指定类型。我们也可以在调用 ref() 时传入一个泛型参数，来覆盖默认的推导行为：
```
const year = ref<string | number>('2022')
year.value = 2022 // 成功！

```


## 为 reactive() 标注类型
通过接口指定类型。要显式地指定一个 reactive 变量的类型，我们可以使用接口：
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
book.year = 2022 // 成功！


## 缓存路由组件写法
```
// Vue2 中缓存路由组件
<KeepAlive>
  <RouterView />
</KeepAlive>
```

```
// Vue3 中缓存路由组件
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <Component :is="Component"></Component>
  </KeepAlive>
</RouterView>
```

## props写法
### 方法1
```
const props = defineProps({
  exampleInfo: {
    type: Object,
    default: () => {},
  },
});
```
### 方法2
```
interface IProps {
  orderInfo: Record<string, any>;
  orderStatus: orderStatusT;
  orderType: orderTypeT;
}
type priceTxtStatusT = "waiting" | "waiting_design" | "waiting_final";
const props = withDefaults(defineProps<IProps>(), {
  orderStatus: "waiting",
});
```
### 方法3
```
type ISize = "small" | "medium" | "large";
import { defineComponent, PropType } from "vue";
const props = {
  // 新增
  size: {
    type: String as PropType<ISize>,
    default: "medium",
  },
}
```


## emit
```
const Emits = defineEmits(["update:selectedTag", "on-click"]);
const selectTagHandler = (tag: tagT) => {
  Emits("update:selectedTag", tag);
  Emits("on-click", tag);
};
```

## 插槽写法
```
<!-- 父组件 -->
<script setup>
import ChildView from './ChildView.vue'
</script>

<template>
  <div>parent</div>
  <ChildView>
    <template v-slot:content="{ msg }">
      <div>{{ msg }}</div>
    </template>
  </ChildView>
</template>

<!-- ChildView 也可以简写为： -->
<ChildView>
  <template #content="{ msg }">
    <div>{{ msg }}</div>
  </template>
</ChildView>
```

```
<!-- 子组件 -->
<template>
  <div>child</div>
  <slot name="content" msg="hello vue3!"></slot>
</template>
```


# 进阶问题

## vue3响应式失效问题 (1)


vue3 响应式在使用过程中有以下2个弊端： 
1、 原始值的响应式系统的实现 导致必须将他包装为一个对象， 通过 .value 的方式访问
2、 ES6 解构，不能随意使用。会破坏他的响应式特性

为什么？

首先第一个问题

我们知道vue3中通过对proxy 的使用实现对象的拦截， 通过new Proxy 的返回值，拦截了obj 对象
如此一来，当你 访问对象中的值的时候，他会触发 get 方法， 当你修改对象中的值的时候 他会触发 set方法。
但是到了原始值的时候，他没有对象啊，咋办呢，new proxy 派不上用场了。无奈之下，我们只能包装一下了，所以就有了使用.value访问了


第二个问题

先实现以下proxy的封装

```
    const obj = {
            a: {
                count: 1
            }
        };
        
        function reactive(obj) {
            return new Proxy(obj, {
                get(target, key, receiver) {
                    console.log("这里是get");
                    // 判断如果是个对象在包装一次，实现深层嵌套的响应式
                    if (typeof target[key] === "object") {
                        return reactive(target[key]);
                    };
                    return Reflect.get(target, key, receiver);
                },
                set(target, key, value, receiver) {
                    console.log("这里是set");
                    return Reflect.set(target, key, value, receiver);
                }
            });
        };
        const proxy = reactive(obj);
```

现在列举一下我知道的响应式失去的几个情况：

1、解构 props 对象，因为它会失去响应式
2、 直接赋值reactive响应式对象
3、 vuex中组合API赋值

1 解构props对象
```
       const obj = {
            a: {
                count: 1
            },
            b: 1
        };
            
            //reactive 是上文中的reactive
           const proxy = reactive(obj);
        const {
            a,
            b
        } = proxy;
        console.log(a)
        console.log(b)
        console.log(a.count)
```
上述代码中，我们发现， 解构赋值，b 不会触发响应式，a如果你访问的时候，会触发响应式,这是为什么呢？

首先先来讨论为什么解构赋值，会丢失响应式呢？
我们知道解构赋值，区分原始类型的赋值，和引用类型的赋值，原始类型的赋值相当于按值传递， 引用类型的值就相当于按引用传递。
```
   // 假设a是个响应式对象
  const a={ b:1}
  // c 此时就是一个值跟当前的a 已经不沾边了
  const c=a.b

// 你直接访问c就相当于直接访问这个值 也就绕过了 a 对象的get ，也就像原文中说的失去响应式
```
那为啥a 具备响应式呢?

因为a 是引用类型，我们还记得上述代码中的一个判断吗。如果他是个object 那么就重新包装为响应式

正式由于当前特性，导致，如果是引用类型， 你再去访问其中的内容的时候并不会失去响应式

```
  // 假设a是个响应式对象
 const a={ b:{c:3}}
 // 当你访问a.b的时候就已经重新初始化响应式了，此时的c就已经是个代理的对象
 const c=a.b

// 你直接访问c就相当于访问一个响应式对象，所以并不会失去响应式
复制代码
```

> 问题来了，那么vue2中呢？ 为什么解构赋值不会影响响应式问题？

答：记得vue2中data函数返回的一个大对象么?
vue2响应式过程关键函数
`defineReactive(vm, key, obj[key]);`
```    function defineReactive (obj, key, val) {
      var dep = new Dep();
      Object.defineProperty(obj, key, {
        get: function () {
          // 添加订阅者 watcher 到 Dep
          if (Dep.target) dep.addSub(Dep.target);
          return val
        },
        set: function (newVal) {
          if (newVal === val) return
          val = newVal;
          // 作为发布者发出通知
          dep.notify();
        }
      });
    }
```
所以在vue2中是对vue当前实例的整个大data对象做了劫持，上面所说的解构是针对data中的某一项数据，因此对他的操作仍包含在大data对象中，因此也是被监听到的，所以响应式没有丢

2 直接赋值导致响应式失效问题

```
// 当reactive 之后返回一个代理对象的地址被vue 存起来，
 // 用一个不恰当的比喻来说，就是这个地址具备响应式的能力
 const vue = reactive({ a: 1 })
 
 //  而当你对于vue重新赋值的时候不是将新的对象赋值给那个地址，而是将vue 换了个新地址
 // 而此时新地址不具备响应式，可不就失去响应式了吗
 vue = { b: 2 }
 ```

 3 vuex中组合API赋值 


```
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
    return {
      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),

      // 在 computed 函数中访问 getter
      double: computed(() => store.getters.double)
    }
  }
}
这种情况需要用 计算属性包一层，否值直接用 . 拿到子属性和上面所说的变量赋值问题一样，会导致响应式的实效
 ```
## vue3响应式失效问题 (2) ref不丢失 reactive丢失
问题描述：使用 reactive 定义的对象，重新赋值后失去了响应式，改变值视图不会发生变化。而用ref却不会，为什么？


ref 定义数据（包括对象）时，都会变成 RefImpl(Ref 引用对象) 类的实例，无论是修改还是重新赋值都会调用 setter，**都会经过 reactive 方法处理为响应式对象**。
```
class RefImpl {
    constructor(value, __v_isShallow) {
        this.__v_isShallow = __v_isShallow;
        this.dep = undefined;
        this.__v_isRef = true;
        this._rawValue = __v_isShallow ? value : toRaw(value);
        this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
        trackRefValue(this);
        return this._value; // get方法返回的是_value的值
    }
    set value(newVal) {
        newVal = this.__v_isShallow ? newVal : toRaw(newVal);
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal;
            this._value = this.__v_isShallow ? newVal : toReactive(newVal); // set方法调用 toReactive 方法 (关键地方)
            triggerRefValue(this, newVal);
        }
    }
}
```

但是 reactive 定义数据（必须是对象），是直接调用 reactive 方法处理成响应式对象。如果重新赋值，就会丢失原来响应式对象的引用地址，变成一个新的引用地址，这个新的引用地址指向的对象是没有经过 reactive 方法处理的，所以是一个普通对象，而不是响应式对象。


## vue3响应式失效问题 (3) 解构赋值额外问题

问题描述： 现在我们知道，对reactive对象中的常量结构时，拿到的是值而不是地址，所以此时改变这个常量是没有办法触发响应式的。例如
```
const state = reactive({
  name: "aa",
  email: "bb",
  info: {
    age: 19,
  },
});
let { name, info } = state;
const handle = () => {
  console.log("handle");
  name = "changenae";  //此时更改的这个值 name是无法触发响应式的 在dom上显示的话仍然为aa
};
```

有趣的问题来了，但是如果同时进行对响应式对象其他的引用值变化，触发了劫持，更新值的时候，原先的常量值也发生了变化
let { name, info } = state;
const handle = () => {
  console.log("handle");
  name = "changenae";
  info.age = 9999; //这一步执行后 name的值在视图上也更新了！！！ 但是state.name还是aa这可以理解。 但是name变化不理解，暂时只能理解为 当有另外响应式变化的时候，触发了视图更新，此时手动拿到了name到最新值，顺带帮它也更新了
};
 # vue3 源码解析分析
 https://github.com/yixinagqingyuan/vue-next-analysis