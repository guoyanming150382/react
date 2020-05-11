// 引入express
const express=require('express')


// 创建app应用对象
const app=express()

// 引入路由器模块
const router=require('./router')

/*
	1 微信服务器要知道开发者服务器是哪个
	  测试号管理页面填写url开发者地址
	     使用ngrok内网穿透，将本地端口开启的服务映射成外往
	     ngrok  http  3333
	  填写token
	     参与微信签名加密的一个参数
	2 开发者服务器-验证消息是不是来自于微信服务器
*/
// 配置模板资源目录
app.set('views',__dirname+'/views')
// 配置模板引擎
app.set('view engine','ejs')


// 应用路由器
app.use(router)  //路径路由




app.listen(3333,()=>console.log('server ok'))
