
# vue 中tsx写法
## v-if 实现

```
          {this.showLogo ? (
            <div class="logo" onClick={this.goHome}>
              <img src={this.logo} />
            </div>
          ) : null}

          最后的这边null 也可以替换为 <></>
```
## 插槽

### 具名插槽
子组件

```
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "Test",
    render() {
        return (
            <>
                <span>I'm Child</span>
                { this.$slots.default?.() }
                { this.$slots.header?.() }
            </>
        )
    }
})


```

父组件

```
import { defineComponent } from 'vue'
import TestComponent from './TestComponent'

export default defineComponent({
    name: "Test",
    components: {
        TestComponent
    },
    render() {
        return (
            <TestComponent v-slots={{
                default: () => (
                    <>这是默认插槽</>
                ),
                header: () => (
                    <>这是header插槽</>
                )
            }}>
            </TestComponent>
        )
    }
})


```

### 作用域插槽
子组件

```
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "Test",
    setup() {
        return {
            value: {
                name: 'xzw'
            }
        }
    },
    render() {
        return (
            <>
                <span>I'm Child</span>
                { this.$slots.content?.(this.value) }
            </>
        )
    }
})

```
父组件

```
import { defineComponent } from 'vue'
import TestComponent from './TestComponent'

export default defineComponent({
    name: "Test",
    components: {
        TestComponent
    },
    render() {
        return (
            <TestComponent v-slots={{
                content: scope => (
                    <>{scope.name}</>
                )
            }}>
            </TestComponent>
        )
    }
})

```