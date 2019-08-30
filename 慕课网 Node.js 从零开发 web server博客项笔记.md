# 慕课网 Node.js 从零开发 web server博客项笔记

## 第 1 章 课程介绍

## 第 2 章 Node.js 介绍

### 下载和安装

### Node.js 和 JS 的区别

#### ECMAScript

* 定义了语法，写 javascript 和 Node.js 都必须遵守
* 变量定义，循环，判断，函数
* 原型和原型链，作用域和闭包，异步
* 不能操作 DOM，不能监听 click 事件，不能发送 ajax 请求
* 不能处理 http 请求，不能操作文件
* 只有 ECMAScript，几乎做不了任何实际的项目

#### Javascript

* 使用了 ECMAScript 语法规范，外加 Web API，缺一不可
* DOM 操作，BOM 操作，事件绑定，Ajax 等
* 两者结合，才能完成浏览器端的任何操作

#### Node.js

* 使用了 ECMAScript 语法规范，外加 Node.js API，缺一不可
* 处理 http， 处理文件等，具体参考 http://nodejs.cn/api
* 两者结合，才能完成 server 端的任何操作

#### 总结

* ECMAScript 是语法规范
* Node.js = ECMAScript + Node.js API
* 前端 JS = ECMAScript + Web API

### commonjs 模块化

a.js

```js
function add(a, b) {
    return a + b
}
module.expors = add
```



b.js

```js
const add = require('./a')
cosnt sum = add(10, 20)
```

c.js

```
function add(a, b) {
    return a + b
}
function mul(a, b) {
    return a * b
}
module.expors = {
	add,
	mul
}
```

d.js

```js
const { add, mul } = require('./c.js')
const sum = add (100, 200)
const result = mul(10, 20)
console.log(sum, result)
```

#### 引用第三方标准

`npm init -y`

`npm install loadash --save`

```js
const _ = require('lodash)
const arr = _.concat([1, 2], 3)
console.log('arr...', arr)
```

### Node.js debugger

方式：vs code debugger

`mkdir debugger-test`

`cd debugger-test`

`npm init -y`

`touch index.js`

vs code debug 的时候，会找到 package.json 里边 main 指向的主文件开始调试

```js
const http = require('http')

const server = http.crateServer((req, res) => {
  res.writehead(200, {'content-type': 'text/html'})
  res.end('<h1>Hello world!</h1>')
})

server.listen(300, () => {
  console.log('listening on 3000 port')
})
```



### server 端和前端的区别

* 服务稳定性
* 考虑内存和 CPU （优化和拓展）
* 日志记录
* 安全
* 集群和服务拆分

#### 服务稳定性

* server 端可能会遭受各种恶意攻击和误操作
* 单个客户端可以意外挂掉，但是服务端不能
* PM2 进程守候（程序挂掉，自动重启）

#### 考虑 CPU 和内存（优化、拓展）

* 客户端独占一个浏览器，内存和 CPU 都不是问题
* server 端要承载很多请求，CPU 和 内存都是稀缺资源
* 课程后面会讲解使用 stream 写日志，使用 redis 存 session

#### 日志记录

* 前端也会参与写日志，但知识日志的发起方，不关心后续
* server 端要记录日志、存储日志、分析日志，前端不关心
* 可以使用多种日志记录方式

#### 安全

* server 端要随时准备接收各种恶意攻击，前端则少很多
* 如：越权操作，数据库攻击等
* 理解登录验证，预防 xss 攻击 和 sql 注入

#### 集群和服务拆分

* 产品发展速度快，流量可能会迅速增加
* 如何通过拓展机器和服务拆分来承载大流量



## 第 3 章 项目介绍

### 项目需求分析

#### 项目步骤

定目标，定需求，定UI设计，定技术方案，开发，联调、测试、上线、分析统计结果评估

#### 目标

* 开发一个博客系统，具有博客的基本功能

#### 需求

* 首页，作者主页，博客详情页
* 登陆页
* 管理中心，新建页，编辑页

### 技术方案

* 数据如何存储
  * 博客
  * 用户
* 如何与前端对接，即接口设计
  * /api/blog/list，get，author 和 keyword
  * /api/blog/detail，get，id
  * /api/blog/new，post，新增内容
  * /api/blog/update， post，id，更新内容
  * /api/blog/del，post，id
  * /api/user/login，post，用户名和密码
* 登录
  * 业界有统一的解决方案，一般不用重新设计



## 第 4 章 开发博客项目之接口

### 4-1 http-概述

#### 本章内容

* Node.js 如何处理 http 请求
* 搭建开发环境
* 开发接口（暂时不连数据库，暂时不考虑登录）

#### 从输入 URL 到现显示页面发生了什么

1. DNS 解析，建立 TCP 连接，发送 http 请求
   1. 先看缓存
   2. 没有缓存再去查找
   3. 三次握手
      1. 客户端询问服务器，你是否可用
      2. 服务器回复客户端，我可用
      3. 客户端告诉服务器，我知道了，我即将访问
2. server 接收到 http 请求，处理，并返回
3. 客户端接收到返回数据，处理数据（如渲染页面，执行 js） 

### 4-2 处理get请求

解析 query string

* get 请求，即客户端向 server 端获取数据，如查询博客列表
* 通过 querystring 来传递数据，如a.html?a=100&b=200
* 浏览器直接访问地址，发送 get 请求

```
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
	console.log(req.method)
	const url = req.url
	req.query = querystring.parse(url.split('?')[1])
  res.end(JSON.stringify(req.query))
})

server.listen(8000)
```

### 4-3 处理post请求

```
const http = require('http')

const server = http.createServer((req, res) => {
	if (req.method !== 'POST') {
		console.log('不是 post 请求')
		return;
	}
	console.log('content-type', req.headers['content-type'])
	let postData = ''
	req.on('data', chunk => {
		postData += chunk.toString()
	})
	req.on('end' () => {
		console.log(postData)
		res.end('hello world')
	})
})

server.listen(8000, () => {
  console.log('listening port 8000')
})
```

### 4-4 处理http请求的综合示例

```js
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
	 const method = req.method
	 const url = req.url
	 const path = url.split('?')[0]
	 const query = querystring.parse(url.split('?')[1])
	 
	 // 设置返回格式为 JSON，返回的字符串到底是什么格式的，可以是 JSON， text/html 或者二进制字符串
	 res.setHeader('Content-type', 'application/json')
  
  // 返回的数据
  const resData = {
    method,
    url,
    path,
    query
  }
  // 返回
  if (method === 'GET') {
    res.end(
    	JSON.stringify(resData)
    )
  }
  if (method === 'POST') {
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      resData.postData = postData
      res.end(
        JSON.stringify(resData)
      )
    })
  }
})

server.listen(8000, () => {
  console.log('listening port 8000')
})
```

### 4-5 搭建开发环境

使用 nodemon 监测文件变化，自动重启 node

使用 cross-env 设置环境变量，兼容 mac，linux 和 windows

### 4-6 初始化路由

开发接口的第一步

根据之前技术方案的设计，作出路由

目前阶段：返回假数据，将路由和数据处理分离，以符合设计原则

### 4-7 开发路由（博客列表路由）_1
### 4-8 开发路由（博客详情路由）
### 4-9 开发路由（处理 POSTData）
### 4-10 开发路由（新建和更新博客路由）
### 4-11 开发路由（删除博客路由和登录路由）



## 第五章 开发博客项目的数据存储

### 5-1 MySQL 简介

https://dev.mysql.com/downloads/mysql/

https://dev.mysql.com/downloads/workbench/



### 5-2 数据库操作（创建和增、删、查、更新）

#### 建库

* 创建 myblog 数据库，`CREATE SCHEMA 'myblog';`
* 执行 `show databases; `查询

#### 建表

![image-20190521131659928](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190521131659928.png)

![image-20190521131747841](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190521131747841.png)

```
CREATE TABLE `myblog`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `realname` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`));
```

```
CREATE TABLE `myblog`.`blogs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(50) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `create` BIGINT(20) NOT NULL DEFAULT 0,
  `author` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`));

```

#### 表操作

`use myblog;`

`-- show tables;`

##### 插入

```
insert into users (username, `password`, realname) values ('zhangsan', '123', '张三');
```

##### 查询

查所有的列

`-- select * from users; `

查看指定的列

`-- select id, username from users;`

按照单个条件查询

`-- select id, username from users where username='zhangsan';`

按照多个条件查询

`-- select id, username from users where username='zhangsan' and password='123';`

`-- select id, username from users where username='zhangsan' or password='123';`

like 语句，模糊查询

`-- select id, username from users where username like '%zhang%';`

排序

`-- select id, username from users where username='zhangsan' or password='123' order by id desc;`

##### 更新

`update users set realname='李四2' where realname'李四'; `

解决一下问题

`SET SQL_SAFE_UPDATES = 0`

##### 删除

`delete from users where username='lisi';`

开发中删除操作，一般是加一个状态的

```sql
ALTER TABLE `myblog`.`users` 
ADD COLUMN `state` INT NOT NULL DEFAULT 1 AFTER `realname`;
```

`select * from users where state='1';`

`update users set state='0' where username='lisi'` 

不等于 `state <> '0'`

 

### 5-4 Node.js 操作 MySQL

* 封装：将其封装为系统可用的工具，配置数据库，线上限制某些操作
* 使用：让 API 直接操作数据库，不再使用假数据
* select 语句返回的都是数组
* update, delete, insert返回的如下

```
{
    fieldCount: 0,
    affectedRows: 1,
    insertId: 5,
    serverStatus: 2,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0
}
```



## 第六章 登录

### 6-1 介绍

* 核心：
  * 登陆校验：进入管理中心，删除博客，更新博客，新增博客必须登陆之后操作
  * 登录信息的存储：用户名等信息

* cookie 和 session
* session 写入 redis（内存数据库）
* 开发登陆功能，和前端联调（用到 nginx 反向代理）

### 6-2 cookie 介绍

#### 什么是 cookie

* 存储在浏览器的一段字符串（最大 5kb）
* 跨域不共享
* 格式入k1=v1;k2=v2;k3=v3;因此可以存储结构化数据
* 每次发送 http 请求，会将请求域的 cookie 一起发送给 server
* server 端可以修改 cookie 的值并返回给浏览器
* 浏览器中也可以通过 javascript 修改 cookie（有限制，server 端锁死）

#### javascript 操作 cookie，浏览器中查看 cookie

##### javascript 查看 cookie 的三种方式

* 浏览器中的 Network

* 浏览器中的 Application
* `document.cookie`

##### javascript 查看、修改 cookie （有限制）

追加

```
document.cookie = 'k1=100';
document.cookie = 'k2=200';
```

#### server 端操作cookie，实现登录验证 

* 查看 cookie
* 修改 cookie
* 实现登录验证



### session

* 用 cookie 实现登录，会暴露 username， 很危险

* 解决：cookie 中存储 userid，server 端 对应 username
* 如何实现 session



### 6-8 从 session 到 redis

当前设置 session 还是有问题，初级的解决方法是放在 sessionData 这样一个变量里边，放在 nodejs 进程内存中

 进程内存有限，访问量过大，session 就会过大，内存就会暴增

正式线上运行是多线程，进程之间内存无法共享

![image-20190603171307235](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190603171307235.png)



stack 栈，基础类型变量，数字，布尔类型变量

heap 堆，引用类型，数组、对象、函数存在这儿，session 存在这儿，session 越多 heap 就会越高，越来越高，进程就崩了。

操作系统会限制一个进程的最大可用内存，Node.js 在 32 位系统中有1.6 Ghz 的内存 限制，在 64 位的系统中有 3 G 的内存限制。

![image-20190603171621574](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190603171621574.png)



![image-20190603171709827](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190603171709827.png)

服务器环境下 Node.js 都是分多个进程来跑的

#### redis

* 内存数据库
* web server 最常用的缓存数据库，数据存放在内存中

* 相比于 mysql，访问速度快
* 但是成本更高，可存储的数量个小
* 断电丢失数据



#### redis 解决方案

* 将 web server 和 redis 拆分成两个单独的服务
* 双方都是独立的，都是可拓展的
* 包括 mysql，也是一个单独的服务



#### 为何 session 使合用 redis

* session 访问频率，对性能要求极高，前置操作，所有请求都要请求 session
* session 可以不考虑断电丢失数据的问题
* session 数据量不会太大



#### 为何网站数据不适合用 redis

* 操作频率不太高（相比于 session 操作）
* 断电不能丢失数据，必须保留
* 数据量太大，内存成本太高



### 6-9 redis 介绍

#### 安装 redis

`brew install redis`

`redis-server`

`redis-cli`

#### 使用 redis

`set myname lvjiawen`

`get myname`

`keys *`

`del myname`

#### 总结

* 为何要用 redis，不用redis 会出现什么问题？
* redis 适合什么场景？mysql 适合什么场景？

### 6-10 Node.js 链接 redis

index.js

`npm i redis --save`

```js
const redis = require('redis')


// 创建客户端
const redisClient = redis.creareClient(6379, '127.0.0.1')
redisClient.on('error', err => {
  console.error(err)
})

// 测试
redisClient.set('myname', 'zhangsan2', redis.print)
redisClient.get('myname', (err, val) => {
  if (err) {
    console.error(err)
    return
  }
  console.log( 'val ', val) 
  redisClient.quit()
})
```



### 6-14 前端联调

* 登录功能以来 cookie，必须浏览器来联调
* cookie 跨域不共享，前端和 server 必须同域
* 需要用到 nignx 做代理，让前端后端同域



### 6-15 nginx 介绍

* 高性能的 web 服务器，开源免费
* 一般用于做静态服务、负载均衡（本课程用不到）
* 反向代理（本科用到）



客户端能够控制的代理，叫正向代理

客户端不能控制的代理，叫反向代理



配置文件位置：

windows： C:\nginx\conf\nginx.conf

Mac: /usr/local/etc/nginx/nginx.conf



#### nginx 命令

* 测试配置文件格式是否正确 `nginx -t`
* 启动 `nginx`
* 重启 `nginx -s reload`
* 停止 `nginx -s stop`

* 打开配置文件 `sudo vi /usr/local/etc/nginx/nginx.conf`
* 修改第三行 `worker_processes 2;` 多核可以启动多个进程
* 修改 server 

```
server {
	listen      8080;
	...
	# location / {
	# ...	
	# }
	location / {
		proxy_pass http://localhost:8001;
	}
	
	location /api/ {
		proxy_pass http://localhost:8000;
		proxy_set_header Host $host;
	}
}
```



`:wq` 保存



### 6-16 登录-总结

* cookie 是什么？ session 是什么？如何实现登录？
* redis 在这里扮演的角色？有什么核心价值
* nginx 的反向代理配置？联调中的作用



## 第 7 章 博客项目值日志

### 7-1 日志基础

**QPS** 每秒访问量 query per seconds

日志包括：

* 访问日志，access log，server 最重要的日志
* 自定义日志，包括自定义事件、错误记录等



技能：

* Node.js 文件操作，Node.js stream（server 端要节省使用 CPU 和内存）
* 日志功能的开发和使用
* 日志文件拆分（例如每天一个文件  ）
* 日志内容分析



日志为什么放在文件中？

* 要有表结构，多表联动查询才用 mysql

* 文件大，性能要求不高，redis 不能放



### 7-2 Node.js 文件操作

### 7-3 stream 介绍

#### IO 操作的性能瓶颈

* IO（in-out 输入输出） 包括"网络IO" 和"文件IO"
* 相比于 CPU 计算和内存读写，IO 的突出特点就是"慢"
* 如何在有限的硬件资源下提高 IO 的操作效率？stream



代码示例

```js
const http = require('http')
const server = http.createServer((req, res) => {
	if (req.method==='POST') {
		let result = ''
		req.on('data', (chunk) => {
			result += chunk.toString()
		})
		req.on('end', () => {
			res.end('OK')
		})
	}
})
server.listen(8000)
```

### 7-7 拆分日志

* 日志内容慢慢积累，放在一个文件夹不好处理

* 按时间划分日志文件，入 2019-02-10.access.log

* 实现方式：linux、macOS 的 crontab 命令，即定时任务

#### crontab

* 设置定时任务，格式：\*\*\*\** command，第一个 \* 是分钟，第二个 \* 是小时（1-24），第三个是日期，第四个十月份，第五个是星期几
* 将 access.log 拷贝并重命名为 2019-02-10.access.log
* 清空 access.log 文件，继续积累日志

`crontab -e` 新建

`* 0 * * *  sh /Users/lvjiawen/Desktop/my-blog/code/blog-1/src/utils/copy.sh`

`crontab -l`查看



#### 日志分析

* 针对 access.log 日志，分析chrome 的占比
* 日志是按行存储的，一行就是一条日志
* 使用 Node.js 的 readline，基于 stream，效率很高



## 安全

* sql 注入：窃取数据库内容
* XSS 攻击：窃取前端 cookie 内容
* 密码加密：保障用户信息安全（重要！）
* server 端攻击方式非常多，预防手段也非常多，这里记录常见的、能通过 web server （Node.js）层面预防的，有些攻击需要硬件和服务来支持（需要OP 支持），如 DDOS 

### 8-1 开始和 sql 注入

* 最原始、最简单的攻击，从有了 web2.0（允许用户提交信息）就有了 SQL 注入攻击
* 攻击方式：输入一个 SQL 片段，最终拼接成一段攻击代码
* 预防措施：使用 MySQL 的 escape 函数处理输入内容即可
* 输入`' — `，利用 SQL 的 ``--` 注释语句
* 输入`';delete from users; --  ` 删除用户表

### 8-2 xss 攻击

* 前端同学最熟悉的攻击方式，但 server 端更应该掌握
* 攻击方式：在页面展示内容中参杂 js 代码，以获取网页信息
* 预防措施： 转换生成 js 的特殊符号

转换特殊符号

```
& => &amp;
< => &lt;
> => &gt;
" => &quot;
' => &#x27;
/ => &#x2F;
```

`<script>alert(document.cookie)</script>`

`npm install xss --save`

### 8-3 密码加密和总结

* 用户名和密码是最不应该泄漏的用户信息
* 危害：获取用户名和密码，再去尝试登录其他系统
* 预防措施，将密码加密

```
const crypto = require('crypto')

// 密钥
const SECRET_KEY = 'WJiol_8776#'

// md5 加密
function md5(content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`
  return md5(str)
}

module.exports = {
  genPassword
}
```



##  第 9 章 不使用框架开发 server 统一总结

### 开发了那些模块，完整的流程

* 处理 http 接口（路由、method、path、query、req.body）
* 连接数据库
* 实现登录
* 安全（mysql 注入、xss、密码加密）
* 日志
* 上线



![image-20190616125743411](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190616125743411.png)

### 用到了哪些核心的知识点

* http、Node.js 处理http、处理路由、MySQL
* cookie、session、redis、nginx 反向代理
* SQL 注入、XSS 攻击、加密
* 日志、stream、contrab、readline
* 线上环境的知识点

### 回顾 server 和前端的区别

* 服务稳定性
* 内存 CPU性能永远不够（优化、拓展）
* 日志记录
* 安全（包括登录验证）
* 集群和服务拆分（设计已支持）

### 下一步

* 不实用框架开发，从 0 开始，关注底层 API

* 很琐碎、很复杂，没有标准可依，很容易将代码写乱

* 适合学习，但是不适合应用，接下来开始 express 和 koa2



## 第 10 章 使用 express 重构博客项目

### express 介绍

express 是 Node.js 最常用的 web server 框架

#### 什么框架

* 封装基本的 API 和工具，让开发者去关心业务
*  框架有一定的流程和标准，能形成解决方案

#### 安装

`npm install express-generator -g`

#### express 总结

- 初始化代码中，各个插件的作用
- 思考各个插件的实现原理
- 处理 get 和 post 请求
- express 如何处理路由

- app.use 到底是怎么回事？
- 中间件使用过程中，代码中 next 参数是什么？

### 10-8 express 处理 session

* 使用 express-session 和 connect-redis
* req.sexsion 保存登录信息，登录校验做成 express 中间件

### 10-12 介绍 morgan

* access log 记录，直接使用脚手架推荐的 morgan
* 自定义日志使用 console.log 和 console.error 即可
* 日志文件拆分、日志内容分析

### 10-14 express 中间件原理

* app.use 用来注册中间件，先收集起来
* 遇到 http 请求，根据 path 和 method 判断触发那些
* 实现 next 机制，即上一个通过 next 触发下一个

### 10-15 中间件代码实现

```js
const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
	constructor() {
		// 存放中间件的列表
		this.routes = {
			all: [], // app.use(...)
			get: [], // app.get(...)
			post: [] // app.post(...)
		}
	}
  
  register(path) {
    const info = {}
    if (typeof path === 'string') {
      info.path = path
      // 从第二个参数开始，转换为数组，存入 stack
      info.stack = slice.call(arguments, 1)
    } else {
      info.path = '/'
      // 从第二个参数开始，转换为数组，存入 stack
      info.stack = slice.call(arguments, 0)
    }
    return info
  }
	
	use() {
    // TODO 为什么不能直接写
		const info = this.register.apply(this, arguments)
    this.routes.all.push(info)
	}
	
	get() {
		// TODO 为什么不能直接写
		const info = this.register.apply(this, arguments)
    this.routes.get.push(info)
	}
	
	post() {
		// TODO 为什么不能直接写
		const info = this.register.apply(this, arguments)
    this.routes.post.push(info)
	}
  
  match(method, url) {
    let stack = []
    if (url == '/favicon.icon') {
      return stack
    }
    
    // 获取 routes
    let currentRoutes = []
    currentRoutes = currentRoutes.concat(this.routes.all)
    currentRoutes = currentRoutes.concat(this.routes[method])
    currentsRoutes.forEach(routeInfo => {
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack)
      }
    })
    return stack
  }
  
  // 核心的 next 机制
  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个匹配的中间件
      const middleware = stack.shift()
      if (middleware) {
      	// 执行中间件函数  
        middleware(req, res, next)
      }
		}
    next()
  }
  
  callback() {
    return (req, res) => {
      res.json = (data) => {
        res.setHeader('Content-type', 'application/json')
        res.end(
        	JSON.stringify(data)
        )
			}
      const url = req.url
      const method = req.method.toLowerCase()
      
      const resultList = this.match(method, url)
      this.handle(req, res, resultList)
    }
  }
	
	listen(...args) {
		const server = http.createServer(this.callback())
    server.listen(...args)
	}
}

// 工厂函数
module.exports = () => {
	return new LikeExpress()
}
```



## 第 11 章 使用 Koa2 重构博客项目

### async / await 语法介绍

 ```
const fs = require('fs')
const path = require('path')

// 用 promise 获取文件内容
function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
      const fullFileName = path.resolve(__dirname, 'files', fileName)
      fs.readFile(fullFileName, (err, data) => {
          if (err) {
              reject(err)
              return
          }
          resolve(
              JSON.parse(data.toString())
          )
      })
  })
  return promise
}

async function readFileData() {
  // 同步写法
  try {
      const aData = await getFileContent('a.json')
      console.log('a data', aData)
      const bData = await getFileContent(aData.next)
      console.log('b data', bData)
      const cData = await getFileContent(bData.next)
      console.log('c data', cData)
  } catch (err) {
      console.error(err)
  }
}

readFileData()
 ```



- await 后面可以追加 promise 对象，获取 resolve 的值

- await 必须包裹在 async 函数里面
- async 函数执行返回的也是一个 promise 对象
- try-catch 截获 promise 中 reject 的值



### Koa 2 简介

- express 中间件是异步回调， Koa2 原生支持 async / await
- 新开发框架和系统，都开始觊觎 koa2，例如 egg.js
- express 虽然未过时，但是 koa2 肯定是未来的趋势

#### Koa 2 安装

`npm install koa-generator -g`

#### Koa 2 路由介绍

```
router.prefix('/users')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
```



#### 中间件机制

切入点：

* app.use 是什么
* next 是什么

#### 分析

* app.use 用来注册中间件，先收集起来
* 实现 next 机制，即上一个通过 next 出发下一个
* （不涉及 method 和 path 的判断）

### Koa 2 中间件原理

洋葱圈模型

```
const http = require('http')

// 组合中间件
function compose(middlewareList) {
  return function (ctx) {
    // 关于各种中间件调用的逻辑
    function dispatch(i) {
      const fn = middlewareList[i]
      try {
        return Promise.resolve( // 防止传入的不是 Promise 函数
          fn(ctx, dispatch.bind(null, i+1)) // 本身就是 Promise 函数
        )
      } catch(err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}

class LikeKoa2 {
  constructor() {
    this.middlewareList = []
  }

  use(fn) {
    this.middlewareList.push(fn)
    return this
  }

  createContext(req, res) {
    const ctx = {
      req,
      res
    }
    return ctx
  }

  handleRequest(ctx, fn) {
    return fn(ctx)
  }

  callback() {
    const fn = compose(this.middlewareList)
    return (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = LikeKoa2
```



### koa2 总结

* 使用 async 和 await 的好处
* koa2 的使用，以及如何操作 session redis 日志
* koa2 中间件的使用和原理

### 预习

* 上线
* 如何实现线上服务稳定性？PM2 是什么
* nginx 在线上环境还扮演了什么重要的角色



## 上线与配置

## 开始

### 线上环境

* 服务器稳定性
* 充分利用服务器硬件资源，以便提高性能
* 线上日志记录（访问日志，自定义日志，错误日志）

### PM2

* 进程守护，系统崩溃自动重启
* 启动多进程，充分利用 CPU 和内存
* 自带日志记录功能

#### PM2 介绍

##### 下载安装

`npm install pm2 -g`

`pm2 --version`

##### 基本使用

启动 `cross-env NODE_ENV=production pm2 start app.js`

查看 `pm2 list`

##### 核心价值

* 进程守护
* 多进程启动
* 线上日志记录

##### 常用命令

`pm2 start …` 可以跟配置文件作为参数

`pm2 list` 程序列表

`pm2 restart ${appName|/${id}`  重启进程

`pm2 stop ${appName|/${id} `停止

`pm2 delete ${appName|/${id}` 删除

`pm2 info ${appName|/${id} ` 信息

`pm2 log ${appName|/${id} ` 日志

`pm2 monit ${appName|/${id}` 监控

### PM2 进程守护

pm2 遇到进程崩溃，会自动重启

### PM2 配置和日志记录

#### 配置

* 新建 PM2 配置文件（包括进程数量，日志文件目录等）

pm2.config.json

```
{
  "name": "pm2-test-server",
  "script": "app.js",
  "watch": true, // 是否监听文件变化
  "ignore_watch": [
    "node_modules",
    "logs"
  ],
  "error_file": "logs/err.log",
  "out_file": "logs/out.log",
  "log_date_format": "YYYY-MM-DD HH:mm:ss"
}
```



* 修改 PM2 启动命令，重启
* 访问 server，检查日志文件的内容（日志记录是否生效）

### PM2 多进程

#### 为何使用多进程

![image-20190628101837144](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190628101837144.png)

* 单个进程的内存是受到限制的
* 一个进程无法利用机器的全部内存
* 多进程能够充分利用 CPU 多核的优势

#### 多进程和 redis

多个进程的 session 无法共享

![image-20190628102048890](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190628102048890.png)

使用redis 解决

![image-20190628102123289](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190628102123289.png)

pm2 会自动在寻找空闲进程进行负载均衡



## 总结

![image-20190628103112542](/Users/lvjiawen/Library/Application Support/typora-user-images/image-20190628103112542.png)

