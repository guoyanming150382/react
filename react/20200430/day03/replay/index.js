/*验证服务器有效性模块*/

const sha1=require('sha1')

const config=require('../config')

const {getUserDataAsync,parseXMLAsync,formatMessage}=require('../utils/tool')
const template=require('./template')
const reply=require('./reply')


module.exports=()=>{
	return async (req,res,next)=>{
		// 微信服务器提交的参数
		const {signature,echostr,timestamp,nonce} = req.query
		const {token} = config
		const sha1Str=sha1([timestamp,nonce,token].sort().join(''))

		// if(sha1Str==signature){
		// 	console.log(1111111111111)
		// 	// 如果一样说明来自于微信服务器，返回echostr给微信服务器
		// 	res.send(echostr)
		// }else{
		// 	// 如果不一样说明不是微信服务器，返回error
		// 	res.end('error')
		// }
		/*
			微信服务器回发送两种类型的消息给开发者服务器
			1 get
			 -验证服务器的有效性
			2 post
			 -微信服务器会将用户发送的数据以post请求的
			  方式转发到开发者服务器上
		*/
		if(req.method==='GET'){
			if(sha1Str===signature){
				// console.log('ok',req.query)
				res.send(echostr)
			}else{
				console.log('error',req.query)
				res.end('error')
			}
		}else if(req.method==='POST'){
			// 微信服务器会把用户发送的数据以post请求的方式发到开发者服务器上
			// 验证消息来自微信服务器
			if(sha1Str!==signature){
				// 说明消息不是微信服务器
				res.end('error')
			}
			// console.log(req.query)
			// 接受请求体中的数据,流式数据
			const xmlData=await getUserDataAsync(req)
			// console.log(xmlData)
			/*<xml>
			<ToUserName><![CDATA[gh_6b905e9d6022]]></ToUserName>
			<FromUserName><![CDATA[oMsd91tpy4wmXL9XQNBOtJEgZEAg]]></FromUserName>
			<CreateTime>1580868349</CreateTime>
			<MsgType><![CDATA[text]]></MsgType>
			<Content><![CDATA[哈哈]]></Content>
			<MsgId>22632592309727080</MsgId>
			</xml>*/
			// 将xml解析为一个js对象
			const jsData=await parseXMLAsync(xmlData)
			console.log(jsData)
			/*{ xml:
		   { ToUserName: [ 'gh_6b905e9d6022' ],
		     FromUserName: [ 'oMsd91tpy4wmXL9XQNBOtJEgZEAg' ],
		     CreateTime: [ '1580869809' ],
		     MsgType: [ 'text' ],
		     Content: [ '尽力了' ],
		     MsgId: [ '22632615363361651' ] } }
			*/
			// 格式化数据
			
			const message=formatMessage(jsData)
			console.log('message',message)
			

			// 简单的自动回复，回复文本内容
			// 判断用户发送的是否是文本消息
			
			const options=reply(message)
			
			// 最终回复用户的消息
			// let replayMessage=`<xml>
			//   <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
			//   <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
			//   <CreateTime>${Date.now()}</CreateTime>
			//   <MsgType><![CDATA[text]]></MsgType>
			//   <Content><![CDATA[${content}]]></Content>
			// </xml>`
			const replayMessage= template(options)
			console.log('replayMessage',replayMessage)
			// 返回响应给微信服务器
			res.send(replayMessage)

			// 如果开发者服务器没有返回响应给微信服务器，
			// 微信服务器会发送三次请求
			// res.end('')

		}else{
			res.end('error')
		}
	}
}

