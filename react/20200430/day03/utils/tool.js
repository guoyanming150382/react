//工具函数包
// 将xml数据转换成js对象
const {parseString}=require('xml2js')
const {writeFile,readFile} = require('fs')
module.exports={
	getUserDataAsync(req){
		return new Promise((resolve,reject)=>{
			let xmlData=''
			req.on('data',data=>{
				// 当流式数据传递过来时，会触发当前事件，会将数据注入到回调函数中
				// 读取的数据时buffer，需要转换成字符串
				xmlData+=data.toString()
			}).on('end',()=>{
				resolve(xmlData)
			})
		})
	},
	parseXMLAsync(xmlData){
		return new Promise((resolve,reject)=>{
			parseString(xmlData,{trim:true},(err,data)=>{
				if(!err){
					resolve(data)
				}else{
					reject('parseXMLAsync有问题'+err)
				}
			})
		})
	},
	formatMessage(jsData){
		let message={}
		// 获取xml对象
		var jsData=jsData.xml
		// 判断数据是否是一个对象
		if(typeof jsData==='object'){
			// 遍历对象
			for(let key in jsData){
				message[key]=jsData[key][0]
				// 获取属性的值
				// let value=jsData[key]
				// // 过滤空的数据
				// if(Array.isArray(value) && value>0){
				// 	// 将合法的数据复制到message对象上
				// 	message[key]=value[0]
				// }
			}
		}
		return message
	}
	// 封装writeFile和readFile
	// writeFileAsync(data,fileName){
	// 	data = JSON.stringify(data)
	// 	return new Promise((resolve,reject)=>{
	// 		writeFile(fileName,data,err=>{
	// 			if(!err){
	// 				resolve()
	// 			}else{
	// 				reject('writeFileAsync出问题了'+err)
	// 			}
	// 		})
	// 	})
	// },
	// readFileAsync(fileName){
	// 	return new Promise((resolve,reject)=>{
	// 		readFile(fileName,(err,data)=>{
	// 			if(!err){
	// 				data = JSON.parse(data)
	// 				resolve(data)
	// 			}else{
	// 				reject('readFileAsync出问题了'+err)
	// 			}
	// 		})
	// 	})
	// }
}