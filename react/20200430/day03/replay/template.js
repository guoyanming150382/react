/*
	加工处理最终回复用户消息的模板
*/
module.exports = options=>{
	let replayMessage=`<xml>
		<ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
	  <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
	  <CreateTime>${options.createTime}</CreateTime>
	  <MsgType><![CDATA[${options.msgType}]]></MsgType>`
	if(options.msgType==='text'){
		replayMessage+=`
		  <Content><![CDATA[${options.content}]]></Content>
		`		
	}else if(options.msgType==='image'){
		replayMessage+=`
		  <Image>
		    <MediaId><![CDATA[${options.mediaId}]]></MediaId>
		  </Image>`	
	}else if(options.msgType==='voice'){
		replayMessage+=`
			<Voice>
		    <MediaId><![CDATA[${options.mediaId}]]></MediaId>
		  </Voice>
		`
	}else if(options.msgType==='video'){
		replayMessage+=`
			<Video>
		    <MediaId><![CDATA[${options.mediaId}]]></MediaId>
		    <Title><![CDATA[${options.title}]]></Title>
		    <Description><![CDATA[${options.description}]]></Description>
		  </Video>
		`
	}else if(options.msgType==='music'){
		replayMessage+=`<Music>
	    <Title><![CDATA[${options.title}]]></Title>
	    <Description><![CDATA[${options.description}]]></Description>
	    <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
	    <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
	    <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
	  </Music>`
	}else if(options.msgType==='news'){
		replayMessage+=`
		<ArticleCount>${options.content.length}</ArticleCount>
		<Articles>`
	  options.content.forEach(item=>{
	  	replayMessage+=`<item>
	      <Title><![CDATA[${item.title}]]></Title>
	      <Description><![CDATA[${item.description}]]></Description>
	      <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
	      <Url><![CDATA[${item.url}]]></Url>
	    </item>`
	  })
	  replayMessage+=`</Articles>`
	}
	replayMessage+='</xml>'
	// 最终回复给用户的xml数据
	return replayMessage
}