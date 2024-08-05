# 如何创建一个 react 项目并完成相关配置

## 使用脚手架创建一个 react+typescript 的项目

```javascript
npx create-react-app 'own-project'  --template typescript
```

注意以上命令是创建一个文件夹为'own-project'的项目

### 配置 less-loader

在项目下运行 `yarn eject` 或者 `npm run eject`

然后在 config 文件夹下生成的文件修改`webpack.config.js`

在该文件下查找 `sass-loader`,找到有分别定义 test 为`sassRegex`和`sassModuleRegex`的，找到他们的定义并复制一份.更改`sass-loader`改为`less-loader`，将`sassModuleRegex`改为`lessModuleRegex`。在该 rules 下也拷贝一份。将`sass-loader`改为`less-loader`，将`sassModuleRegex`改为`lessModuleRegex`。自此 less-loader 就配置完成了。

#### 在启动的时候如果报错 `Inline JavaScript is not enabled. Is it set in your options?`的话就得去配置 less-loader

-   找到 config 文件夹下面的`webpack.config.js`文件修改`getStyleLoaders`方法

```
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
                    sourceMap: true
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

### 配置全局 src 绝对路径

为了在一个 ts 文件中引用其他文件的时候不用大量使用`../../../`类似的操作。官方推出可以在根目录下配置一个`tsconfig.json`在`compilerOptions`下配置`baseUrl`为`src`



# 踩坑日记

## Q: 路由明明修改了但是页面的UI没有更新
A: 解决方案有2

1: 使用`BrowserRouter`添加`forceRefresh={true}`属性
2: 使用`Router`来渲染路由

备注：在添加`basename`的时候有所区别。在1的时候可以直接在该组件属性添加，但是该属性是强制重新加载页面。添加在`redux`的数据会丢失使用2的时候需要在定义`history`的时候执行`createBrowserHistory`的时候将`basename`传入进去



