# air-system-frontend

> A Vue.js project

## Introduction

-   路由配置 （通过 src/router/index.js 配置）

    我们整个 `air-system-frontend` 目前涉及三个界面：`Home` ,`Admin`, `User` 分别对应 http://localhost:8081/#/，http://localhost:8081/#/amdin， http://localhost:8081/#/users 三个网址。

-   三个界面分别由 /src/pages 的文件夹(home | admin | users)中的 ‘xxx.vue’  文件直接得到，对应组件放在(home | admin | users)的 components 文件夹内。

-   /static/mock 文件夹中放入前端单独调试是用于测试的文件（如test.json）

    -   注：/static 文件夹下的所有文件可用通过 浏览器中相应网址访问，而其余位置不能访问。

        -   eg. http://localhost:8081/static/mock/test.json 看到相应内容。

        -   已经配置了相应代理将/api/xxx 转发到 /static/mock/ 。(config/index.js 中配置 proxyTable)

        -   目前将static/mock 加入了gitignore 中，后续添加的文件将不会同步到仓库中。
        
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

    -   /src/assets/styles/iconfont 📁 存放从https://www.iconfont.cn/下载的相应的字体（.eot .svg .ttf .woff）并将iconfont.css 放入 /src/assets/styles 📁 （**Todo**）
    -   /src/assets/styles/border.css 在main.js中通过 import 'styles/border.css' 引入解决手机二倍屏显示 1px 像素问题 
    -   /src/assets/styles/reset.css 在main.js中通过 import 'styles/reset.css'引入解决传统手机适配样式问题。
    -   /src/assets/styles/variables.styl 中定义样式中共用的变量。（比如两个页面需要同样的背景色，在variables.sytl中 \$bgColor = #00bcd4, 然后在相应文件中@import '~styles/variables'后设置background: \$bgColor 即可多组件共用相同变量）

-   本前端代码技术栈：vue（框架）

     / stylus（css样式） / vuex （存储） / axios （网络请求）

     / vue-awesome-swiper（轮播图）/ better-scroll (上下拉动).   ......

     以上均可直接通过进入相应文件夹后执行 npm install 自动安装。

-   快速开始调试（见build setup）

## Frontend-backend Interface

-   登陆前后端接口 （**<u>1</u>**）：

    -   前端 Post 请求 ：相应的 url body 内容包含：
        -   1.  username: String 2. password: String 3. userType: String
        -   返回结构：ret_code 代表成功失败。{UserInfo: { name: defaultName(房间名/管理员名), avaterUrl: defaultUrl（管理员头像url）}}

-   注册前后端接口（**<u>2</u>**）：

    -   前端 Post 请求 ：相应的 url body 内容包含：
        -   1.  username: String 2. password: String 3. userType: String
        -   返回结构：ret_code 代表成功失败。

-   admin 前后端接口：

    -   admin 在mounted 方法时

        -   请求主控数据 StateRequest Post/Get 方法 无需参数（**<u>3</u>**）
            -   返回结果：主控全部状态：服务器时间，是否开启空调，温度，风速
        -   请求所有从控数据 GetAllSlaveState Post/Get 方法 无需参数（**<u>4</u>**）
            -   返回结果：ret_code 代表成功失败，
            -   返回结果：`[{RoomId: String, currentTem: Integer, SpeedMode: String, History: [{begin: string, end: string, setTem, setMode, Cost}, ..., {}], SecurityLevel: String}, ... ]`

    -   Setting 开启/关闭 空调 应用button（**<u>5</u>**）

        -   Post 请求： 参数：Poweron : boolean 
        -   返回：ret_code 代表成功失败

    -   Setting 设置模式 （**<u>6</u>**）

        -   Post 请求：参数：设定温度，设定风速
        -   返回：ret_code 代表成功失败

    -   Inspect 点击 fresh button  （同（**<u>4</u>**）复用接口函数）

        -   请求所有从控数据 GetAllSlaveState Post/Get 方法 无需参数
            -   返回结果：ret_code 代表成功失败，
            -   返回结果：`[{RoomId: String, currentTem: Integer, SpeedMode: String, History: [{begin: string, end: string, setTem, setMode, Cost}, ..., {}], SecurityLevel: String}, ... ]`

    -   Statistic 点击 查询 (**<u>7</u>**)

        -   Post 请求：RoomID + 查询内容（枚举 房间温度/房间功率/房间计费）+ 起始时间 + 统计范围（枚举：Day/Week/Month）
        -   返回结果：时间段内 总计收益 （计费标准：可以写死在前端 ）+ echarts 图标所需内容

        ```json
        chartOption: {
          title: {
            text: '一周气温变化'
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }]
        }
        ```

-   users 前后端接口：

    -   user 关闭请求（**<u>8</u>**）
            -   返回结果：ret_code 代表成功失败，
    
    -   user 更新状态（**<u>9</u>**）
            -   参数：roomT
            -   返回结果：ret_code 代表成功失败
            -   返回结果：interval_ms，刷新频率

    -   user 设置参数请求（**<u>10</u>**）
            -   参数：setTemp，setWind
            -   返回结果：ret_code 代表成功失败

        user 计费list请求（**<u>11</u>**）
            -   返回结果： 时间list + 房间计费list

            ```json
            data: {
              timelist: ['5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00'],
              datalist: [0, 1.2, 1.8, 2.1, 2.3, 2.3, 2.3, 2.5, 2.9]
            }
            ```
            
          或者这样：

            ```json
            data: {
              timelist: [0, 10, 20, 30, 40, 50, 60, 70, 80],
              datalist: [0, 1.2, 1.8, 2.1, 2.3, 2.3, 2.3, 2.5, 2.9]
            }
            ```
            
          （timelist这个 我也没想好怎么整）






## How to contribute 

首先可以使用 `git branch -r` 查看远程分支：这里应该有yzq-dev/master/（zfh-dev 分支）

使用 git checkout -b zfh-dev （创建个人dev分支）

在个人能够使用npm run dev 跑通后可以`git checkout master` `git merge xxx-dev` 

应该注意：在开发之前应使用 `git pull origin master:xxx-dev` 拉取最近branch进行开发。

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
