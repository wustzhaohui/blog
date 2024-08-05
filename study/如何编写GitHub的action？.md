# 什么是GitHub Actions

> GitHub Actions 是一种持续集成和持续交付 (CI/CD) 平台，可用于自动执行生成、测试和部署管道。 您可以创建工作流程来构建和测试存储库的每个拉取请求，或将合并的拉取请求部署到生产环境。
>
> GitHub Actions 不仅仅是 DevOps，还允许您在存储库中发生其他事件时运行工作流程。 例如，您可以运行工作流程，以便在有人在您的存储库中创建新问题时自动添加相应的标签。
>
> GitHub 提供 Linux、Windows 和 macOS 虚拟机来运行工作流程，或者您可以在自己的数据中心或云基础架构中托管自己的自托管运行器。

什么意思呢？就是GitHub官方给我们提供了一些 Linux、Windows 和 macOS 虚拟机来执行我们的脚本。这些脚本可以根据一些条件来触发，你可以利用这些脚本来完成项目的打包，测试或者部署的工作。

## 有了它我们能干嘛呢？

有了它我们能干啥呢？有了它我们能干的东西就多了。比如最近我自己写了一个开源组件库，我更新内容之后。需要先打包，然后执行更新版本号操作之后最后发布到[npm](https://www.npmjs.com/)。其实无非就是如下一些命令

```node
/*
* 执行打包操作
*/
npm run build

/*
*执行更新版本号操作
*这里我使用的是第三方的库来帮忙操作standard-version
*/
npx standard-version
//或者也可以用原生的npm命令来执行
npm version patch
// 发布到npm
npm publish
```

注意关于[standard-version](https://www.npmjs.com/package/standard-version)和[npm version](https://docs.npmjs.com/cli/v8/commands/npm-version/)可点击链接查看完整解释。我使用npm version patch是用来更新版本号的第三位。

在你执行完最后一个命令 npm publish之后，你大概率就会收到请求超时的提示。当然如果你发版频繁的话呢，你会不停的手动执行如上的命令。有什么好的解决方案呢？

### 使用action自动脚本

话不多说我直接把我的脚本贴上来。

```yaml
# This workflow will run tests using node and then publish a package to GitHub Packages when a release is created
# For more information see: https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages

name: Publish Package to npmjs

on:
  push:
    branches: 
       - main
    tags:
       - '*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18.x
          registry-url: https://registry.npmjs.org/
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
          
      - name: Build
        run: |
         npm ci
         npm run build
         
      - name: Create tag and push to Git
        run: |
         git config user.email "little_hui@foxmail.com"
         git config user.name "eric_chao"
         npm run release
         git push --follow-tags origin main
      - name: Publish To NPM
        run: npm publish

```

如上就是我的action配置文件。

第一个字段name没什么可讲的，就是个名称。

### on 就是触发的条件



