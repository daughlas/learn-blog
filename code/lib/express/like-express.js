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
    if (url == '/favicon.ico') {
      return stack
    }
    
    // 获取 routes
    let currentRoutes = []
    currentRoutes = currentRoutes.concat(this.routes.all)
    currentRoutes = currentRoutes.concat(this.routes[method])
    currentRoutes.forEach(routeInfo => {
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack)
      }
    })
    stack.forEach(item => {
      console.log(String(item))
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
        return
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