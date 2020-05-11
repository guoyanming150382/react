/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */
let baseUrl = '';
let routerMode = 'hash';
let baseImgPath;

if(process.env.NODE_ENV == 'development') {
	//	baseUrl = '';
	//  baseImgPath = '/img/';
	baseUrl = '//localhost:8001';
	baseImgPath = '//localhost/public/img/';
} else {
	//	baseUrl = '//elm.cangdu.org';
	baseUrl = '//localhost:8001';
	//  baseImgPath = '//elm.cangdu.org/img/';
	baseImgPath = '//localhost/public/img/';
}

export {
	baseUrl,
	routerMode,
	baseImgPath
}