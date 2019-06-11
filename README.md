
## 接口设计
|描述|接口|方法|url 参数|备注|
|:---|:---|:---|:---|:---|
|获取博客列表|/api/blog/list|get|author, keyword|参数为空的话，则不进行查询过滤|
|获取一篇博客的内容|/api/blog/detail|get|id||
|新增一篇博客|/api/blog/new|post||postData 中有新增的信息|
|更新一篇博客|/api/blog/update|post|id|postData 中有更新的内容|
|删除一篇博客|/api/blog/del|post|id||
|登录|/api/user/login|post||postData中有用户名和密码|


## 开发
* 打开 redis， `redis-server`
