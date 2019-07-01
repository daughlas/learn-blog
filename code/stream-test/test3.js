const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname, 'data.txt')
const fileName2 = path.resolve(__dirname, 'data-bak.txt')

const readStream = fs.createReadStream(fileName1)
const writeStream = fs.createWriteStream(fileName2)

readStream.pipe(writeStream)
let line = 0
readStream.on('data', () => {
  console.log(`${line++}次`)
})
readStream.on('end', () => {
  console.log('拷贝完成')
})