// 引入express
const express=require('express')

// 创建app应用对象
const app=express()


const auth=require('./wechat/auth')

/*
	1 微信服务器要知道开发者服务器是哪个
	  测试号管理页面填写url开发者地址
	     使用ngrok内网穿透，将本地端口开启的服务映射成外往
	     ngrok  http  3333
	  填写token
	     参与微信签名加密的一个参数
	2 开发者服务器-验证消息是不是来自于微信服务器
*/


//接受处理所有消息
app.use(auth())

app.listen(3333,()=>console.log('server ok'))
