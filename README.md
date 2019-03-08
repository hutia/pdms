# Personal Document Management System

## 项目说明
名称：  个人文档管理系统
用途：  用于个人的资料、信息管理
环境：  基于 Electron、React、Ant.Design、TypeScript、NeDB 搭建
设计原则：
    1. 轻量化，无需安装、无需其他支持包
    2. 个人使用原则，无需登录
    3. 允许对指定数据加密以保护数据，但无权限控制
    4. 允许对资料定义标签，便于快速搜索
    5. 高度可定制


## 初始化过程备忘

1. 创建项目
    > yarn create react-app antd-demo --typescript

2. 引入所需的包
    > yarn add antd nedb

3. 建立 electron 入口文件 `/main.js`

4. 弹出
    > yarn eject

5. 修改以下文件
    * `/package.json`
    * `/tsconfig.json`
    * `/scripts/start.js`
    * `/scripts/build.js`
    * `/config/paths.js`
    * `/config/webpack.config.js`

6. 开发过程
    > yarn start

7. 打包
    > yarn build