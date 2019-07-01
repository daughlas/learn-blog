const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fullFileName = path.resolve(__dirname, '../', '../', 'logs', 'access.log')

// 创建 readStream
const readStream = fs.createReadStream(fullFileName)

// 创建 readline 对象
const rl = readline.createInterface({
  input: readStream
})

let chromeNum = 0
let totalNum = 0

// 开始逐行读取
rl.on('line', lineData => {
  if (!lineData) {
    return
  }

  totalNum++
  const arr = lineData.split(' -- ')
  if (arr[2].indexOf('Chrome') > 0) {
    chromeNum++
  }
})

rl.on('close', () => {
  console.log('chrome 占比：' + chromeNum/totalNum)
})