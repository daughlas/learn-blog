const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    author = escape(author)
    sql += `and author=${author}`
  }
  if (keyword) {
    let slice = escape(`%${keyword}% `)
    sql += `and title like ${slice} `
  }
  sql += `order by createtime desc;`
  return exec(sql)
}

const getDetail = (id) => {
  id = escape(id)
  let sql = `select * from blogs where id=${id}`
  // 只有一个元素，也会返回一个数组
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含 title content author 属性
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))
  const author = escape(blogData.author)
  const createTime = Date.now()
  const sql = `
      insert into blogs (title, content, createtime, author)
      values (${title}, ${content}, ${createTime}, ${author})`
  console.log(sql)
  /*
  OkPacket {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 5,
    serverStatus: 2,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0 }
  */
  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData ={}) => {
  // id 是更新博客的id
  // blogData 是一个博客对象，包含 title， content 属性
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))
  id = escape(id)
  const sql = `
    update blogs set title=${title},content=${content} where id=${id};
  `

  return exec(sql).then(updateData => {
    /*
      OkPacket {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 5,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0 
      }
    */
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })

  return false
}

const delBlog = (id, author) => {
  id = escape(id)
  author = escape(author)
  const sql =`delete from blogs where id=${id} and author=${author}`
  return exec(sql).then(delData => {
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}