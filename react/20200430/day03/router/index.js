//引入express模块
const express=require('express')
// 获取router
const Router = express.Router
// const ejs=require('ejs')
const sha1=require('sha1')

// const auth=require('./wechat/auth')
const replay=require('../replay')
// 引入wechat
const Wechat=require('../wechat/wechat')

const {url}=require('../config')

// 创建路由器对象
const router=new Router()
const wechatApi=new Wechat()

router.get('/search',async (req,res)=>{
	/*
		生成js-sdk
		1组合参与签名的四个参数jsapi_ticket(临时票据,noncestr(随机字符串)timestamp(时间戳)url(当前服务器地址))
		2将其进行字典排序，以&拼接在一起
		3进行sha1加密 最终生成signature
	*/
		// 1组合参与签名的四个参数jsapi_ticket(临时票据,noncestr(随机字符串)timestamp(时间戳)url(当前服务器地址))

	// 获取随机字符串
	const noncestr=Math.random().toString().split('.')[1]

	// 时间戳
	const timestamp=Date.now()
	// 获取票据
	const {ticket}=await wechatApi.fetchTicket()
	const arr=[
		`jsapi_ticket=${ticket}`,
		`noncestr=${noncestr}`,
		`timestamp=${timestamp}`,
		`url=${url}/search`,
	]
		// 2将其进行字典排序，以&拼接在一起
		const str=arr.sort().join('&')
		console.log(str)  //xxx=xxx&xxx=xxx&xxx=xxx
		const signature=sha1(str)
	res.render('search',{
		signature,
		noncestr,
		timestamp
	})
})


//接受处理所有消息
router.use(replay())



// 导出
module.exports=router