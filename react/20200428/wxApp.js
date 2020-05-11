const express =require('express')
const sha1 =require('sha1')

const app=new express()

const config={
	token:"huanghe",
	appID:"wxe17f55f4a856fdeb",
	appsecret:"8df3d4fbbc430b8219edf7ee70eb4d7e"
}

app.use((req,res,next)=>{
	console.log("数据",req.query)

	const { signature, echostr, timestamp,nonce}=req.query
	const {token}=config

	
})



app.listen(8000,'127.0.0.1')