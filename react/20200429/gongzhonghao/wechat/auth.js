/*验证服务器有效性模块*/

const sha1=require('sha1')

const config=require('../config')
const {getUserDataAsync,parseXMLAsync,formatMessage}=require('../utils/tool')



module.exports=()=>{
	return async (req,res,next)=>{
		const {signature,echostr,timestamp,nonce} = req.query
		const {token} = config

		// 排序组合在一起
		const arr=[timestamp,nonce,token]
		const arrSort = arr.sort()
		const str = arr.join('')
		const sha1Str = sha1(str)
		
		// 在配置页面点击提交按钮，微信会给你发送一个get请求
		console.log('发送方法:'+req.method)
		if(req.method==='GET'){
			if(sha1Str==signature){
				console.log(111,sha1Str)
				res.send(echostr)
			}else{
				res.end('error')
			}
		}else if(req.method==='POST'){
			// 微信服务器会把用户发送的数据以post请求的方式发到开发者服务器上
			// 验证消息来自微信服务器
			if(sha1Str!==signature){
				// 说明消息不是微信服务器
				res.end('error')
			}else{
//				console.log('这里执行了')
				// 接受请求体中的数据,流式数据
				const xmlData=await getUserDataAsync(req)
//				console.log('这里是你发送的信息',xmlData)
				/*
				<xml>
					<ToUserName><![CDATA[gh_6b905e9d6022]]></ToUserName>
					<FromUserName><![CDATA[oMsd91vNVClliE23wsoW3BZi6eqU]]></FromUserName>
					<CreateTime>1588142017</CreateTime>
					<MsgType><![CDATA[text]]></MsgType>
					<Content><![CDATA[哈哈]]></Content>
					<MsgId>22736723797095151</MsgId>
				</xml> 
				*/
				const jsData=await parseXMLAsync(xmlData)
//				console.log(jsData)
				
				const message=formatMessage(jsData)
				console.log(message)
			}
		}else{
			res.end('error')
		}
	}
}