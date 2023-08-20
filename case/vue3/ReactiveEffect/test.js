let activeEffect = null;
class ReactiveEffect {
    constructor(fn) {
        this.fn = fn;
        this.deps = [];
    }

    run() {
        activeEffect = this;
        this.fn();
        activeEffect = null;
    }
}

// 创建一个副作用函数
function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
}

// 创建一个响应式对象
function reactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            // 依赖收集
            console.log('target, key', target, key)
            track(target, key);
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value);
            // 依赖触发
            trigger(target, key);

            return res;
        }
    });
}

// 依赖收集
const targetMap = new WeakMap();
function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = new Set()));
        }
        if (!dep.has(activeEffect)) {
            dep.add(activeEffect);
            // activeEffect.deps.push(dep);
        }
        console.log(targetMap)
        console.log(activeEffect)
    }
}

// 依赖触发
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const dep = depsMap.get(key);
    if (dep) {
        dep.forEach((effect) => {
            effect.run();
        });
    }
}

