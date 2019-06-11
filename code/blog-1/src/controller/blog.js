const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`
  }
  sql += `order by createtime desc;`
  return exec(sql)
}

const getDetail = (id) => {
  let sql = `select * from blogs where id='${id}'`
  // 只有一个元素，也会返回一个数组
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含 title content author 属性
  const title = blogData.title
  const content = blogData.content
  const author = blogData.author
  const createTime = Date.now()
  const sql = `
      insert into blogs (title, content, createtime, author)
      values ('${title}', '${content}', ${createTime}, '${author}')`
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
  const title = blogData.title
  const content = blogData.content
  const sql = `
    update blogs set title='${title}',content='${content}' where id=${id};
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
  // id 就是要删除博客的 id
  const sql =`delete from blogs where id=${id} and author='${author}'`
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