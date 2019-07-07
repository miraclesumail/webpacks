export class Observer {
    constructor(value, key) {
        this.key = key;
        this.value = value; 
        this.removeFn = this.walk(this.value);
        console.log(this.removeFn);
    }

    walk(value) {
        // 递归遍历value的属性
        let fn;
        Object.keys(value).forEach((key) => {
            if(key == this.key)
               fn = defineReactive(value, key, value[key])
        })
        return fn;
    }
}

function observe (value) {
    if (typeof value === 'object' && !Array.isArray(value)) {
        value = new Observer(value)
    }
}

export class Watcher {
    constructor(vm, cb, expOrFn) {
        this.vm = vm;
        this.cb = cb;
        this.getter = expOrFn;
        this.value = this.get();
    }

    get() {
        Dep.target = this;
        const value = this.vm[this.getter]
        Dep.target = null;
        return value;
    }

    update() {
        this.run();
    }

    run() {
        const value = this.get();
        if(value != this.value) {
            const oldValue = this.value;
            this.value = value;
            this.cb.call(this.vm, oldValue, value);
        }
    }
}

class Dep {
    constructor() {
        this.subs = []
    }

    addSub (sub) {
        this.subs.push(sub)
    }

    remove () {
        this.subs = [];
    } 

    notify () {
        const subs = this.subs.slice()
        subs.forEach((sub) => {
            sub && sub.update() // 视图更新
        })
    }
}

function defineReactive(obj, key ,val) {
    let dep = new Dep() // 毕竟要使用Dep的方法
    let childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            if(Dep.target) {
                dep.addSub(Dep.target)
            }
            return val
        },
        set(newVal) {
            val = newVal
            childOb = observe(val)
            dep.notify() // 因为数据改变了，我们就通知Dep
        }
    })
    console.log('你妈个院子');
    return () => {
        dep.remove();
    }
}

export class ObserveState {
    constructor(state, key, cb) {
        this.key = key;
        this.Observer = new Observer(state, key);
        new Watcher(state, cb, key);
    }

    addListener(cb) {
        new Watcher(state, cb, this.key);
    }

    clearListeners() {
        this.Observer.removeFn();
    }
}
