//获取accesstoken
const {appID,appsecret}=require('../config')
const rp=require('request-promise-native')
const {writeFile,readFile} = require('fs')
const menu=require('./menu')
// const {writeFileAsync,readFileAsync} =require('../utils/tools')

class Wechat{
	constructor(){

	}

	getAccessToken(){
		const url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
		return new Promise((resolve,reject)=>{
			rp({method:'GET',url,json:true}).then(res=>{
				console.log(res)
				res.expires_in=Date.now()+(res.expires_in-300)*1000
				resolve(res)
			}).catch(err=>{
				console.log(err)
				reject(err)
			})
		})
		
	}
	saveAccessToken(accessToken){
		accessToken = JSON.stringify(accessToken)
		return new Promise((resolve,reject)=>{
			writeFile('./accessToken.txt',accessToken,err=>{
				if(!err){
					resolve()
				}else{
					reject('saveAccessToken出问题了'+err)
				}
			})
		})
	}
	readAccessToken(){
		return new Promise((resolve,reject)=>{
			readFile('./accessToken.txt',(err,data)=>{
				if(!err){
					data = JSON.parse(data)
					resolve(data)
				}else{
					reject('readAccessToken出问题了'+err)
				}
			})
		})
	}
	isValidAccessToken(data){
		// 检测传入的参数是否有效
		if(!data && data.access_token && !data.expires_in){
			// 代表access_token无效
			return false
		}
		// 检测是否在有效期内
		if(data.expires_in<Date.now()){
			// 代表过期了
			return false
		}else{
			// 代表没有过期
			return true
		}
	}
	// 获取没有过期的access_token
	fetchAccessToken(){
		// 优化冗余处理
		if(this.access_token && this.expires_in && this.isValidAccessToken(this)){
			// 说明之前保存过access_token，并且是有效的,直接使用
			return Promise.resolve({
				access_token:this.access_token,
				expires_in:this.expires_in
			})
		}
		// 否则
		return this.readAccessToken()
			.then(async res=>{
				// 本地有文件
				// 判断是否过期
				if(this.isValidAccessToken){
					// 有效的
					return Promise.resolve(res)
				}else{
					// 过期了
					// 发送请求获取access_token(getAccessToken)
					const res=await this.getAccessToken()
					await this.saveAccessToken(res)
					// resolve(res)
					return Promise.resolve(res)
				}
			}).catch(async err=>{
				// 本地无文件
				// 发送请求获取access_token(getAccessToken)
				const res=await this.getAccessToken()
				await this.saveAccessToken(res)
				return Promise.resolve(res)
			}).then(res=>{
				// 将access_token挂载到this上
				this.access_token=res.access_token
				this.expires_in=res.expires_in
				// 返回res包装一层promise对象
				return Promise.resolve(res)
			})
	}


	//用来获取jsapi_ticket
	getTicket(){
		// 获取access_token
		return new Promise(async (resolve,reject)=>{
			const data = await this.fetchAccessToken()
			console.log('access_token',data.access_token)
			const url=`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data.access_token}&type=jsapi`
	
			rp({method:'GET',url,json:true}).then(res=>{
				resolve({
					ticket:res.ticket,
					expires_in:Date.now()+(res.expires_in-300)*1000})
			}).catch(err=>{
				console.log(err)
				reject(err)
			})
		})
	}
	saveTicket(ticket){
		ticket = JSON.stringify(ticket)
		return new Promise((resolve,reject)=>{
			writeFile('./ticket.txt',ticket,err=>{
				if(!err){
					console.log('文件保存成功')
					resolve()
				}else{
					reject('saveTicket出问题了'+err)
				}
			})
		})
	}
	readTicket(){
		return new Promise((resolve,reject)=>{
			readFile('./ticket.txt',(err,data)=>{
				if(!err){
					console.log('文件保存成功')
					data = JSON.parse(data)
					resolve(data)
				}else{
					reject('readTicket出问题了'+err)
				}
			})
		})
	}
	isValidTicket(data){
		// 检测传入的参数是否有效
		if(!data && data.ticket && !data.expires_in){
			// 代表ticket无效
			return false
		}
		// 检测是否在有效期内
		if(data.expires_in<Date.now()){
			// 代表过期了
			return false
		}else{
			// 代表没有过期
			return true
		}
	}
	// 获取没有过期的access_token
	fetchTicket(){
		// 优化冗余处理
		if(this.ticket && this.ticket_expires_in && this.isValidTicket(this)){
			// 说明之前保存过ticket，并且是有效的,直接使用
			return Promise.resolve({
				ticket:this.ticket,
				expires_in:this.expires_in
			})
		}
		return this.readTicket()
			.then(async res=>{
				// 本地有文件
				// 判断是否过期
				if(this.isValidTicket){
					// 有效的
					return Promise.resolve(res)
				}else{
					// 过期了
					// 发送请求获取access_token(getTicket)
					const res=await this.getTicket()
					await this.saveTicket(res)
					// resolve(res)
					return Promise.resolve(res)
				}
			}).catch(async err=>{
				// 本地无文件
				// 发送请求获取ticket(getTicket)
				const res=await this.getTicket()
				await this.saveTicket(res)
				return Promise.resolve(res)
			}).then(res=>{
				// 将ticket挂载到this上
				this.ticket=res.ticket
				this.ticket_expires_in=res.expires_in
				// 返回res包装一层promise对象
				return Promise.resolve(res)
			})
	}



// 创建菜单
	createMenu(menu){
		return new Promise(async (resolve,reject)=>{
			try{
				const data = await this.fetchAccessToken()
				const url=`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`
				// 发送请求
				const result = await rp({method:'POST',url,json:true,body:menu})
				resolve(result)
			}catch(e){
				reject('createMenu出了问题:'+e)
			}
		})
	}
	// 删除菜单
	deleteMenu(){
		return new Promise(async (resolve,reject)=>{
			try{
				const data = await this.fetchAccessToken()
				const url=`https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`
				const result = await rp({ method:'GET',url,json:true})
				resolve(result)
			}catch(e){
				reject('deleteMenu出了问题:'+e)
			}
		})
	}
}


	const w=new Wechat()
	w.fetchTicket().then(res=>{
		console.log('ticket',res)
	})


// 测试
// (async ()=>{
// 	const w=new Wechat()

// 	// 删除之前定义的菜单
// 	let result = await w.deleteMenu()
// 	// console.log(result)
// 	// 创建新的菜单
// 	result = await w.createMenu(menu)
// 	// console.log(result)
// 	const data = await w.fetchTicket()
// 	console.log(data)
// })()

module.exports=Wechat
// const w=new Wechat()
// w.createMenu(menu)
// w.fetchAccessToken()
// w.getAccessToken()
// new Promise((resolve,reject)=>{
// 	w.readAccessToken().then(res=>{
// 		// 本地有文件
// 		// 判断是否过期
// 		if(w.isValidAccessToken){
// 			// 有效的
// 			resolve(res)
// 		}else{
// 			// 过期了
// 			// 发送请求获取access_token(getAccessToken)
// 			w.getAccessToken().then(res=>{
// 				w.saveAccessToken(res).then(()=>{
// 					resolve(res)
// 				}).catch(err=>{
// 					reject(err)
// 				})
// 			})
// 		}
// 	}).catch(err=>{
// 		// 本地无文件
// 		// 发送请求获取access_token(getAccessToken)
// 		w.getAccessToken().then(res=>{
// 			w.saveAccessToken(res).then(()=>{
// 				resolve(res)
// 			}).catch(err=>{
// 				reject(err)
// 			})
// 		})
// 	})
// }).then(res=>{
// 	console.log(res)
// })
