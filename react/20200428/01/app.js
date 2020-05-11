// 引入express
const express=require('express')
// 创建app应用对象
const app=express()
const sha1=require('sha1')

const auth=require('./wechat/auth')


app.use(auth())

app.listen(8001,'127.0.0.1')
