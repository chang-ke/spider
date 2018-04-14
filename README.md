> 前言，此文章仅作教学用途，如果有人拿去干别的事情，我概不负责，如果该文章侵害到了掘金社区的利益，请膜法小编立刻联系我删除.

最近闲来无聊，逛了好几天掘金，想想自己假如掘金这么久了，一篇文章都没发过，遂想写个爬虫教程吧，目标就是掘金，嘿嘿

本文用到的三个工具为
* cheerio：jQuery语法，帮助你在非浏览器环境下解析网页用的
* qs 序列化成url的查询字符串，（不知道说没说对...）例：{a:1,b2} => a=1&b=2
* request 一个封装好的好用的请求库

开始我是尝试直接请求掘金首页，然后用cheerio解析，然后拿到网页继续干活的。。可是事情并没有这么简单，通过这个方法爬取的网页跟我们正常浏览的首页不一样（有可能是我哪姿势不对）
没办法，只能从接口出发了

首先打开网页版掘金, 然后打开chrome的network,查看相关请求

![](https://user-gold-cdn.xitu.io/2018/4/14/162c3d9ca409ea48?w=1046&h=398&f=png&s=72005)
咦！recommend？推荐？好了，进去一看，果然是首页热门文章，但是。。。
![](https://user-gold-cdn.xitu.io/2018/4/14/162c3dc66d10d341?w=1045&h=572&f=png&s=88459)
请求参数suid是什么？查看请求调用堆栈，，再看源码，emmmm 源码已经被混淆压缩了
![](https://user-gold-cdn.xitu.io/2018/4/14/162c3df2208f4cdd?w=483&h=378&f=png&s=36793)

这可怎么办？我没有登陆
查看完所有请求响应都没看到跟suid有关的，这可咋整？

直接进入请求网址，再更改suid，发现随便更改都可以得到相应
但是。。。这并没有什么用啊！就10条信息我爬你个小杰瑞？

没办法了，只能老套路了。先登陆再说

为了防止页面跳转后登陆请求消失，需要先勾选Preserve log，使页面跳转后前面的请求不会消失

差点忘打码了，qwq
![](https://user-gold-cdn.xitu.io/2018/4/14/162c3e7c1a492c27?w=1046&h=933&f=png&s=170709)
我是使用邮箱注册的，可能使用其它账号注册的接口会不一样
```
  let data = await request.create({
    url: 'https://juejin.im/auth/type/email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: '155com', password: 'cfdsd.'}) //账号密码
  });
```
直接一个请求搞定，得到如下相应，问题的关键就在于cookie
![](https://user-gold-cdn.xitu.io/2018/4/14/162c3ebfafa690e6?w=749&h=464&f=png&s=60910)

好了，接下来该找接口了，点击最新，发现network多了下面这个请求，其响应数据就是最新板块的文章

![](https://user-gold-cdn.xitu.io/2018/4/14/162c3ee876f720c2?w=1049&h=926&f=png&s=152225)
相关参数有来源，设备id，用户id，token等，其中最重要的就是token，id什么的随便改两个字符好像也没问题，但是token错了它会报illegal token，请求方法错了，就算参数对了也会报missing src。

当你看到token的时候，你会发现，哪都找不到这个数据，就算是登陆响应里面也没有。当然刚开始好像是有，我也忘了我当时token是复制网页的还是直接用的请求响应cookie里面的了

反正最后你是直接找不到它了

当你仔细看第5张图的时候，你会发现这auth后面这串字符是多么的熟悉，没错，它就是你们常用的base64编码
打开相关网站，解码

![](https://user-gold-cdn.xitu.io/2018/4/14/162c3f825fb36fa2?w=831&h=413&f=png&s=29254)

答案呼之欲出啊，最重要的三个参数全在这了，那么问题来了，node如何解析base64编码呢？

一行代码解决，buffer对象本身提供了base64的解码功能，最后调用toString方法，转成字符串，最后parse得到对象
```
  const cookie = data.headers['set-cookie'];
  const encodeToken = cookie[0]
    .split(';')[0]
    .split('=')[1];
  const decodeToken = JSON.parse(new Buffer(encodeToken, 'base64').toString())
```
有了token，你就可以随心所欲的爬了，爬图片？主题？标题？文章内容？都欧克
```
const {token, clientId, userId} = require('./user.json');  //这里我将相关数据写入了json文件中
const querystring = qs.stringify({
  src: 'web',
  uid: userId,
  device_id: clientId,
  token: token,
  limit: 20,
  category: 'all',
  recomment: 1
});
const data = await request.get({
  url: `https://timeline-merger-ms.juejin.im/v1/get_entry_by_timeline?${querystring}`,
  headers: {
    host: 'timeline-merger-ms.juejin.im',
    referer: 'https://juejin.im/timeline?sort=comment'
  }
});
```
全部代码[]()
当然，我没有使用数据库来保存数据，这只是教大家爬取原理

最后，爬虫需节制，小心被封哦，还有，我要吐槽一句编辑器，居然不支持粘贴图片？？？