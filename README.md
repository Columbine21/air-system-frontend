# air-system-frontend

> A Vue.js project

## Introduction

-   路由配置 （通过 src/router/index.js 配置）

    我们整个 `air-system-frontend` 目前涉及三个界面：`Home` ,`Admin`, `User` 分别 http://localhost:8081/#/，http://localhost:8081/#/amdin， http://localhost:8081/#/users 三个网址。

-   三个界面分别由 /src/pages 的文件夹(home | admin | users)中的 ‘xxx.vue’  文件直接得到，对应组件放在(home | admin | users)的 component 文件夹内。

-   /static/mock 文件夹中放入前端单独调试是用于测试的文件（如test.json）

    -   注：/static 文件夹下的所有文件可用通过 浏览器中相应网址访问，而其余位置不能访问。

        -   eg. http://localhost:8081/static/mock/test.json 看到相应内容。

        -   已经配置了相应代理将/api/xxx 转发到 /static/mock/ 。(config/index.js 中配置 proxyTable)

            ```javascript
            proxyTable: {
              '/api': {
                target: 'http://localhost:8081',
                  pathRewrite: {
                    '^/api': '/static/mock'
                  }
              }
            },
            ```

-   Node_modules: 安装所需的第三方库（无需改动）

-   /src/assets/styles/ （需要的 css 资源文件）

    -   /src/assets/styles/iconfont 📁 存放从https://www.iconfont.cn/下载的相应的字体（.eot .svg .ttf .woff）并将iconfont.css 放入 /src/assets/styles 📁
    -   /src/assets/styles/border.css 在main.js中通过 import 'styles/border.css' 引入解决手机二倍屏显示 1px 像素问题 
    -   /src/assets/styles/reset.css 在main.js中通过 import 'styles/reset.css'引入解决传统手机适配样式问题。
    -   /src/assets/styles/variables.styl 中定义样式中共用的变量。（比如两个页面需要同样的背景色，在variables.sytl中 \$bgColor = #00bcd4, 然后在相应文件中@import '~styles/variables'后设置background: \$bgColor 即可多组件共用相同变量）

-   本前端代码技术栈：vue（框架）

     / stylus（css样式） / vuex （存储） / axios （网络请求）

     / vue-awesome-swiper（轮播图）/ better-scroll (上下拉动)

    以上均可直接通过进入相应文件夹后执行 npm install 自动安装。

-   快速开始调试（见build setup）

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
