## require为什么会报错呢？看看🤔面官方的解释

> CJS 的 Node API 已经被废弃。当调用 `require('vite')` 时，将会记录一个废弃警告。你应该更新你的文件或框架来导入 Vite 的 ESM 构建。
>
> 在一个基础的 Vite 项目中，请确保：
>
> 1. `vite.config.js` 配置文件的内容使用 ESM 语法。
> 2. 最近的 `package.json` 文件中有 `"type": "module"`，或者使用 `.mjs`/`.mts` 扩展名，例如 `vite.config.mjs` 或者 `.vite.config.mts`。
>
> 对于其他项目，有几种常见的方法：
>
> - **配置 ESM 为默认，如果需要则选择 CJS：** 在项目 `package.json` 中添加 `"type": "module"`。所有 `*.js` 文件现在都被解释为 ESM，并且需要使用 ESM 语法。你可以将一个文件重命名为 `.cjs` 扩展名来继续使用 CJS。
> - **保持 CJS 为默认，如果需要则选择 ESM：** 如果项目 `package.json` 没有 `"type": "module"`，所有 `*.js` 文件都被解释为 CJS。你可以将一个文件重命名为 `.mjs` 扩展名来使用 ESM。
> - **动态导入 Vite：** 如果你需要继续使用 CJS，你可以使用 `import('vite')` 动态导入 Vite。这要求你的代码必须在一个 `async` 上下文中编写，但是由于 Vite 的 API 大多是异步的，所以应该还是可以管理的。
>
> 查看 [排错指南](https://cn.vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated) 获取更多信息。

## 设置src目录别名

和`webpack`一样，在项目引入静态资源的时候我们也可以直接使用`@`作为指向`src`的目录。[官方文档](https://webpack.docschina.org/configuration/resolve#resolvealias)

在webpack中我们需要这么配置⬇️

```tsx
const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/'),
      '@': path.resolve(__dirname, 'src/'),
    },
  },
};
```

通过以上的配置，如果我们需要访问到`src/utilities/index.ts`文件可以直接简写成`Utilities/index.ts`，我们想要访问到`src`下的文件的话可以直接使用`@`来直接指向`src`目录。

在`vite`中中可以这么配置⬇️。[官方文档](https://cn.vitejs.dev/config/shared-options.html#resolve-alias)

```tsx
{
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
```

同`webpack`上例子🌰一样使用。

## 接下来 试试如何在项目中正确的使用静态资源引入

可以去看下Vite官方源于[静态资源](https://cn.vitejs.dev/guide/assets.html)的的解释。

vite官方关于静态资源引入分为如下几点

- 将资源引入为 URL

  - [显式 URL 引入](https://cn.vitejs.dev/guide/assets.html#explicit-url-imports)

  - [将资源引入为字符串](https://cn.vitejs.dev/guide/assets.html#importing-asset-as-string)

  - [导入脚本作为 Worker](https://cn.vitejs.dev/guide/assets.html#importing-script-as-a-worker)
  - [public 目录](https://cn.vitejs.dev/guide/assets.html#the-public-directory)

- [new URL(url, import.meta.url)](https://cn.vitejs.dev/guide/assets.html#new-url-url-import-meta-url)

## 常用的静态资源引入

以上是官方给到的解释，我们在配置完成`@`的别名之后，想要访问`src`目录下的文件都可以直接`import xxx from '@/xx'`

在引入静态图片的时候，可以直接这么写⬇️。



### 文件放在`src/assets/images`文件夹

```tsx
import img1 from '@/assets/images/xxx.jpg'

// 使用的时候可以直接
<img :src="img1" />
  
// 当然在官方文档中我们也可以显示的引入为url
  import img1 from '@/assets/images/xxx.jpg?url'
// 使用同上
```

大多数我们引入静态文件都可以直接使用如上写法。

### 文件放在public文件夹

如果你将文件放在public文件夹需要注意⚠️以下几点

> - 不会被源码引用（例如 `robots.txt`）
> - 必须保持原有文件名（没有经过 hash）
> - ...或者你压根不想引入该资源，只是想得到其 URL。

如果你没有配置 [`publicDir`](https://cn.vitejs.dev/config/shared-options.html#publicdir)默认访问路径为`<root>/public`，比如你放在pulic的根目录的一个文件名称为`img.png`。访问的时候可以直接`/img.png`就可以访问到。



## 我遇到的问题

我的场景是在`vue3`中封装📦一个组件，我需要动态设置组件内部的一个`dom`的背景图片。

我的做法是将需要使用到的背景图片文件统一重命名，然后使用该图片的时候配置一个文件名`props`就可以访问到。定义一个对象来赋值给到需要更改背景图片的`dom`。⬇️

```
<div :style="style"></div>

const style = {
    background: `url(/src/assets/images/${props.fileName})`
}
```

如上写法在`dev`环境没有任何问题，但是在生产环节找不到地址了。



一脸懵逼的我开始排查。打包后找不到绝地地址`/src/assets/xxx`，打包之后根目录只有一个`assets`文件夹所以找不到。



解决方案如下⬇️

```tsx
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

至此完美解决。



