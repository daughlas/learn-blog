const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog 
} = require('../controller/blog')
const { SuccessModel, ErrorModel } =  require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(
      new ErrorModel('尚未登录')
    )
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id

  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''

    // 管理员界面 
    if (req.query.isadmin) {
      const loginCheckResult = loginCheck(req)
      // 未登录
      if (loginCheckResult) {
        return loginCheckResult
      }
      // 强制从 session 中拿当前用户的用户名
      author = req.session.username
    }

    const result = getList(author, keyword)
    return result.then(listData => {
       return new SuccessModel(listData)
    })
  }

  if (method === 'GET' && req.path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if(method === 'POST' && req.path === '/api/blog/new') {
    // TODO 这个异步代码不会执行的很晚吗
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if(method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const result = updateBlog(id, req.body)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      }
      return new ErrorModel('更新博客失败')
    })
  }

  if(method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const author = req.session.username
    const result = delBlog(id, author)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      }
      return new ErrorModel('删除博客失败')
    })
  }
}

module.exports = handleBlogRouter