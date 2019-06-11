const http = require('http')
const path = require('path')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const fileName = path.resolve(__dirname, 'data.txt')
    const stream = fs.createReadStream(fileName)
    stream.pipe(res)
  }
})
server.listen(8000)