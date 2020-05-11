const {appID,appsecret}=require('../config')
//const rp=require('request-promise-native')   // 服务端发送请求
const axios=require('axios')
const {writeFile,readFile} = require('fs')   //这个意思是把获取到的accesstoken存储在文件里面


class Wechat{
	constructor(){}
	getAccessToken(){
		const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
		return new Promise((resolve,reject)=>{
			axios.get(url).then(res=>{  // 获取access_token
				console.log(res.data)
				console.log('expires_in时间',res.data.expires_in)
				//这个时间是距离5分钟过期时间
				res.data.expires_in=Date.now()+(res.expires_in-300)*1000
				resolve(res.data)
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
					console.log('文件保存成功')
					resolve()
				}else{
					reject('saveAccessToken出问题了'+err)
				}
			})
		})
	}
}

const w=new Wechat()
w.getAccessToken().then(res=>{
	w.saveAccessToken(res).then(()=>{
		resolve(res)
	}).catch(err=>{
		reject(err)
	})
})

