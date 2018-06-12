function getHTTPObject(){
	"use strict"; //注意使用严格模式
	var xhr;
	//使用主流的XMLHttpRequest通信服务器对象
	if(window.XMLHttpRequest){
	    xhr = new window.XMLHttpRequest();
	//如果是老版本ie，则只支持Active对象
	} else if(window.ActiveXObject){
	    xhr = new window.ActiveXObject("Msxml2.XMLHTTP");
	}
	//将通信服务器对象返回
	return xhr;
}

