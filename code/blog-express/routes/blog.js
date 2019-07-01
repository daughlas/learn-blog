var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel} = require('../model/resModel')
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog 
} = require('../controller/blog')

const loginCheck = require('../middleware/login-check')

router.get('/list', function(req, res, next) {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  // 管理员界面 
  if (req.query.isadmin) {
    // 未登录
    if (req.session.username == null) {
      res.json(
        new ErrorModel('未登录')
      )
      return
    }
    // 强制从 session 中拿当前用户的用户名
    author = req.session.username
  }
  const result = getList(author, keyword)
  return result.then(listData => {
     res.json(
      new SuccessModel(listData)
     ) 
  })
});

router.get('/detail', function(req, res, next) {
  const result = getDetail(req.query.id)
    return result.then(data => {
      res.json(new SuccessModel(data))
    })
});

router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
    res.json(
      new SuccessModel(data)
    )
  })
})

router.post('/update', loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body)
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel())
      return
    }
    res.json(new ErrorModel('更新博客失败'))
  })
})

router.post('/del', loginCheck, (req, res, next) => {
  const author = req.session.username
  const result = delBlog(req.query.id, author)
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel())
      return
    }
    res.json(new ErrorModel('删除博客失败'))
  })
})

module.exports = router;