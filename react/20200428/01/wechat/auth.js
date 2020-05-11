const { config }=require('../config')

module.exports=()=>{
	return (req,res,next)=>{
		console.log(req.query)
		const {signature,echostr,timestamp,nonce} = req.query
		const {token} = config

		// 排序组合在一起
		const arr=[timestamp,nonce,token]
		const arrSort = arr.sort()
		console.log(arrSort)
		const str = arr.join('')
		const sha1Str = sha1(str)
		if(sha1Str==signature){
			console.log(111,sha1Str)
			res.send(echostr)
		}else{
			res.end('error')
		}
	}
}