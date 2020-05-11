/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let baseUrl = ''; 
let routerMode = 'hash';
let imgBaseUrl = '';


if (process.env.NODE_ENV == 'development') {
	baseUrl = '//localhost:8001';
    imgBaseUrl = '//localhost:8001/public/img/';

}else if(process.env.NODE_ENV == 'production'){
//	baseUrl = '//elm.cangdu.org';
	baseUrl = '//localhost:8001';
//  imgBaseUrl = '//elm.cangdu.org/img/';
    imgBaseUrl = '//localhost:8001/public/img/';
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl,
}