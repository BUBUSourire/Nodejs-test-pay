var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  console.log('HTTP路径为\n' + path)
  if (path == '/') {
    var string = fs.readFileSync('./index.html', 'utf8')
    var amount = fs.readFileSync('./db', 'utf8')//同步读取db这个文件，其中内容的值是100，类型是字符串
    string = string.replace('&&amount&&', amount)//&&amount&&为占位符
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path == '/style.css') {
    var string = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css')
    response.write(string)
    response.end()
  } else if (path == '/main.js') {
    var string = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.write(string)
    response.end()
  } else if (path === '/pay') {
    var amount = fs.readFileSync('./db', 'utf8')//读取当前数据库中存储的数据
    var newAmount = amount - 1//amount是字符串类型，-1后自动转成数字类型
    //模拟支付失败
    if (Math.random() > 0.5) {
      fs.writeFileSync('./db', newAmount)//将newAmount存到db中
      response.setHeader('Content-Type', 'application/javascript')
      response.statusCode = 200//返回状态码200告知浏览器请求可以，从而告知用户支付成功
      response.write(`
      ${query.callback}.call(undefined,'success')
      `)//*********此处解耦，后端将前端传的参数放在call前面********
    } else {
      response.statusCode = 400//同理反之
      response.write('fail')
    }
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('找不到对应的路径，需自行修改 index.js')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
