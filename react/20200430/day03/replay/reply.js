/*
	处理用户发送的消息类型和内容
*/
module.exports=(message)=>{
	let options={
		toUserName:message.FromUserName,
		fromUserName:message.ToUserName,
		createTime:Date.now(),
		msgType:'text'
	}
	let content=''
	if(message.MsgType==='text'){
		// 判断用户发送的消息内容
		if(message.Content==='1'){
			content='大吉大利,今晚吃鸡'
		}else if(message.Content==='2'){
			content='落地成双'
		}else if(message.Content.match('爱')){//半匹配
			content='我爱你'
		}else{

		}
	}else if(message.MsgType==='voice'){
		options.msgType='voice'
		options.mediaId=message.MediaId
		console.log(message.Recognition)
	}else if(message.msgType==='event'){
		if(message.Event==='subscribe'){
			// 用户订阅事件
			content='欢迎您关注电影公众号\n'+'回复首页看到电影预告片\n'+'回复热门看热门\n'+'回复文本查看指定的电影信息\n'+'回复语音看电影信息\n'+'点菜单进行回复'
			
		}else if(message.Event==='unsubscribe'){
			// 用户取消订阅事件
			console.log('无情取关')
		}else if(message.Event==='CLICK'){
			content='你可以按照以下提是进行操作\n'+'欢迎您关注电影公众号\n'+'回复首页看到电影预告片\n'+'回复热门看热门\n'+'回复文本查看指定的电影信息\n'+'回复语音看电影信息\n'+'点菜单进行回复'
			// content=`您点击了按钮:${message.EventKey}
		}
	}
	options.content=content
	return options
}