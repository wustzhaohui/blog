# 理一理关于ES5和ES6的继承相关[博客]

## ES5的继承 - 原型链继承

### 使用ES5实现一个简单的继承

```javascript
function Parent() {
    this.type = 'parent';
}
Parent.prototype.getType = function() {
    return this.type;
}
function Child(a, b) {
    this.a = a;
    this.b = b;
}
Child.prototype = new Parent();
const c = new Child(3,4)
console.log(c.getType()); // parent
console.log(c instanceof Parent); // true
console.log(c instanceof Child);  // true
console.log(c.prototype === Parent._proto_); // true
```

- 创建两个构造函数`Parent`和`Child`。
- 将`Parent`的实例赋值给到`Child`的原型，从而实现将`Parent`的所有属性和方法继承到`Child`上
- 通过`instanceof`可以查看到实例`c`同时是`Parent`和`Child`的实例。
- 最后一次打印也很好的印证了继承的相关思想

在创建一个构造函数的实例的时候，一般浏览器会主动在实例上添加一个`_proto_`属性。该属性指向构造函数的实例。故不难理解最后一次的打印为什么是`true`了。

**需要注意的是，在es5中使用构造函数创建对象的时候。该构造函数与普通的构造函数并没有说什么区别。我们定义的构造函数是可以直接执行的。所以首字母大写一般为了区分普通函数。**

## ES6实现继承 - class关键字

### 使用class关键字实现一个继承

es6提出了class关键字用于定义类的概念。

```javascript
class Food {
    constructor() {
        this.name = 'food'
    }
    getName() {
        return this.name;
    }
}

class Vegetable extends Food {
    constructor() {
        super();
    }
}

const v = new Vegetable();
console.log(v.getName()); //  food
```

- 在ES6中我们实现一个继承需要借助`extends`关键字，并必须在`Food`类的构造方法中去执行super()方法来实现继承`Food`的属性和方法。

### 关于super关键字的用法

以上例子我们可以看到在继承中使用super作为方法调用，接下来我们看看super关于对象的用法

```javascript
class Food {
    constructor() {
        this.name = 'food';
        this.sex = 'male';
    }
    getName() {
        return this.name;
    }
    getNames() {
        return this.sex;
    }
}
Food.getType = () => {
    return 'is parent';
}
class Vegetable extends Food {
    constructor(sex) {
        super();
        this.sex = sex;
        console.log(super.getName()); // food
        console.log(super.getNames()); // famale
    }
    getType() {
        console.log(super.getType()) // 报错
    }
    static getParentType() {
        console.log(super.getType())
    }
}

const v = new Vegetable('famale'); // food
v.getType();// 这句话执行之后会报错
Vegetable.getParentType(); // is parent
```

- 从上面的例子中可以看到在我们创建一个`Vegetable`的实例的时候直接打印了父类的方法`getName`。
- 可以总结下关于super的两个用法的区别，在作为方法调用的时候是用来将父级类的所有方法和属性挂到子类中相当于父类的`constructor`，当作为对象使用的时候。在普通方法中super指向的父类的原型对象在静态方法中使用指向的是父类本身。实际上就是一句话，super指向的是父类的原型对象而非父类本身。
- 当使用super之后父类的this指向子类的this。通过打印` console.log(super.getNames())`可以看出此特性。
- `super`只能在`constructor`中调用方法，否则就会报错。

