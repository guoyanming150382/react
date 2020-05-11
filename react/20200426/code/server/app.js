const express=require('express')
const app=new express()


app.get('/list',function(req,res){
	var list=[
		'马云','马华腾','周鸿祎'
	]
	res.json(list)
})

app.listen(8001,'127.0.0.1')
