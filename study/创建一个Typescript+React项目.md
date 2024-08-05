# 创建一个Typescript+React项目[笔记]

## 本地环境

操作系统：MacOs11.2

Node版本: v10.22.0

Npm版本：v6.14.8

*因为之前有遇到node版本过高导致一些包依赖有问题，所以我本地node版本不是很高。如果你准备用我的笔记来搭建项目，可以比我这个版本高。但是遇到一些什么问题建议自行去谷歌下～*

## create-react-app脚手架

创建`react`项目和`vue`项目一样，两大框架都有自己的脚手架来帮助你快速创建带有基础功能的项目。因为是第一次接触React和Typescript所以我选用了最简单粗暴的方法就是直接使用脚手架。在你的终端运行如下命令。

```
npx create-react-app 'own-project'  --template typescript
```

**注意该命令是在你终端执行目录创建一个名为own-project的文件夹**

执行该命令结束你会在终端看到如下

```javascript
Success! Created own-project at /Users/zhaohui/own/own-project
Inside that directory, you can run several commands:

  yarn start
    Starts the development server.

  yarn build
    Bundles the app into static files for production.

  yarn test
    Starts the test runner.

  yarn eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd own-project
  yarn start

Happy hacking!
```

上文意思是 - 翻译

- 成功在  `/Users/zhaohui/own/own-project`目录创建项目，进入该目录你可以执行
- `yarn start`执行该命令可以启动dev环境，也就是本地调试环境
- `yarn build`执行该命令可以打包一个生产环节的静态文件
- `yarn test` 执行该命令可以进行自动化测试
- `yarn eject` 移除这个工具，拷贝编译依赖，配置文件和脚本到项目文件夹。如果你执行该命令不能反悔。

我们建议你执行如下命令

```javascript
cd own-project
yarn start
# 开始吧！
```

在看到这个结果之后你就执行上面的命令来启动本地服务了。接下来为了方便项目高度个性化配置，可以在终端执行`yarn eject`，上文中翻译也提到过。该操作是不可逆的，但是一般都会执行这个命令实现自定义一些webpack配置的。

## 文件夹目录

在终端执行 `cd own-project`你会看到如下目录

```markdown
├── README.md
├── config
│   ├── env.js
│   ├── getHttpsConfig.js
│   ├── jest
│   │   ├── babelTransform.js
│   │   ├── cssTransform.js
│   │   └── fileTransform.js
│   ├── modules.js
│   ├── paths.js
│   ├── pnpTs.js
│   ├── webpack.config.js
│   └── webpackDevServer.config.js
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── scripts
│   ├── build.js
│   ├── start.js
│   └── test.js
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts
├── tsconfig.json
└── yarn.lock
```

和vue脚手架一样，我们的源码需要写在`src`目录下，config目录为项目所有的关于webpack的配置。`public`目录为静态文件目录也就是项目打包完成之后的根目录。`script`目录为项目的启动，打包和测试执行的脚本目录。剩下的就是`package.json`文件和`tsconfig.json`文件分别为包管理的配置文件和ts一个配置文件。

## 创建一个搭载ant design框架的后台管理系统

- 安装 [antdesign](https://ant.design/docs/react/introduce-cn)
- 配置[less](http://lesscss.org/features/)
- [设置个性化主题](https://ant.design/docs/react/customize-theme-cn)

### 安装ant design

```javascript
yarn add antd
```

### 配置less

默认是不支持less的，所以我们要手动配置less-loader用来解析我们的.less文件。在 config 文件夹下生成的文件修改`webpack.config.js`

在该文件下查找 `sass-loader`,找到有分别定义 test 为`sassRegex`和`sassModuleRegex`的，找到他们的定义并复制一份.更改`sass-loader`改为`less-loader`，将`sassModuleRegex`改为`lessModuleRegex`。在该 rules 下也拷贝一份。将`sass-loader`改为`less-loader`，将`sassModuleRegex`改为`lessModuleRegex`。自此 less-loader 就配置完成了。

在启动的时候如果报错 `Inline JavaScript is not enabled. Is it set in your options?`的话就得去安装 less-loader

```javascript
yarn add less-loader
```

找到 config 文件夹下面的`webpack.config.js`文件修改`getStyleLoaders`方法

```javascript
if (preProcessor && preProcessor === 'less-loader') {
        loaders.push(
            {
              loader: require.resolve('resolve-url-loader'),
              options: {
                sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                root: paths.appSrc,
              },
            },
            {
              loader: require.resolve(preProcessor),
              options: {
                lessOptions: {
                    javascriptEnabled: true,
                    sourceMap: true,
                    modules: true
                }
              },
            }
          );
    } else if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
```

结束后执行 `yarn start`没有报错。恭喜你，项目的less已经配置完成。

### 设置个性化主题

现在我们可以自行配置项目个性化主题。首先进入项目的入口文件。也就是src目录下的index.tsx文件。我个人使用的是antdesign[官方文档](https://ant.design/docs/react/customize-theme-cn#%E9%85%8D%E7%BD%AE-less-%E5%8F%98%E9%87%8F%E6%96%87%E4%BB%B6)提供的覆盖less文件的方式。

- 配置主题

在src目录下创建一个文件夹，我这边是使用的assets，然后创建以下几个文件夹

```markdown
assets
   images
   styles
   iconfont
```

在styles文件夹创建如下文件

```
styles
    base.less
    variables.less
```

variables.less文件如下,我项目中一些自定义的组件颜色。具体可以去[这里](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)查看所有你需要更改的颜色变量。

```less
// 组件全局颜色
@primary-color: #313777;
@border-radius-base: 4px;
@layout-header-background: #1a1d3b;
@link-color: #313777;
@text-color: #414462;
@black: rgba(0,0,0,.7);
@heading-color:rgba(0,0,0,.65);
@layout-body-background: #fff;
@layout-header-background:#1A1D3B;
@descriptions-bg: rgba(0,0,0,.65);
@table-body-sort-bg: rgba(0,0,0,.65);
```

base.less文件如下

```less

@import '~antd/lib/style/themes/default.less';
@import '~antd/dist/antd.less'; // 引入官方提供的 less 样式入口文件
@import'./variable.less'
```

最后将这个base.less文件引入入口文件。

## 如何访问绝对路径，绝对路径的根目录是src？

可以在tsconfig.json文件中配置如下

```json
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react",
        "strictNullChecks": false,
        "baseUrl": "src"
    },
    "include": ["src"]
}

```

那么在项目中你就可以直接使用src这个根目录寻找文件。比如要找到assets/styles/base.less则不用在需要引入的文件写n个相对路径。直接`import 'assets/styles/base.less'`解决。

## 报错信息及解决

- 在执行yarn start之后会报这个错误

> ```javascript
> ./src/index.tsx
> Error: [BABEL] /Users/zhaohui/own/own-project/src/index.tsx: Cannot find module '@babel/plugin-syntax-jsx' (While processing: "/Users/zhaohui/own/own-project/node_modules/babel-preset-react-app/index.js")
> ```

解决方案：在终端安装报错缺失的包 `yarn add  @babel/plugin-syntax-jsx`

- 在某次重启之后会报如下的错误

> ./src/assets/styles/base.less (./node_modules/css-loader/dist/cjs.js??ref--5-oneOf-8-1!./node_modules/postcss-loader/src??postcss!./node_modules/resolve-url-loader??ref--5-oneOf-8-3!./node_modules/less-loader/dist/cjs.js??ref--5-oneOf-8-4!./src/assets/styles/base.less)
> TypeError: this.getOptions is not a function

解决方案：执行如下命令，报错无非就是less-loader版本过高或者过低。如果报关于less-loader的错误就执行如下命令。

关于这个报错我想多说两句，这个less-loader更新真的很频繁，而且都是夸版本更新的那种。一言不合就api变更。所以咱们项目根目录的`yarn.lock`文件一定记得推送至你的代码管理仓库。

```
yarn remove less-loader
yarn add less-loader@7.1.0
```



谢谢你看到这里，有问题可以在评论区指出。我们一起进步。

作者：赵辉

