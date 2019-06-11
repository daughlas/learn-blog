const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

// // 读取文件内容
// fs.readFile(fileName, (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   // buffer to string， data 是二进制类型
//   console.log(data.toString())
// })


// // 写入文件
// const content = '这是新泻入的内容\n'
// const opt = {
//   flag: 'a', // 追加写入，append。覆盖写入用 ‘w'，覆盖
// }
// fs.writeFile(fileName, content, opt, (err) => {
//   if (err) {
//     console.error(err)
//     return
//   }
// })

// 判断文件是否存在
fs.exists(fileName + '1', (exist) => {
  console.log('exist', exist)
})