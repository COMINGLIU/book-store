(function() {
	/*
	*method: 请求方法
	*url:请求域名
	*data:请求数据
	*callback:执行关于data的函数
	*/ 
	function ajax(method,url,data,callback) {
		var xhr;
		try {
			xhr = new XMLHttpRequest();
		}catch(e) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		//如果data存在
		if((typeof data).toLowerCase() === "object"&&data!=null) {
			var str="";
			for(var key in data) {
				// 用enCodeURI转码
				str += key+"="+enCodeURI(data[key])+"&";
			}
			str = str.substr(0,str.length-1);
		}
		// 如果data是个对象需要遍历
		// 如果使用的get方法，需要data拼接
		if(method.toLowerCase()==="get") {
			url = url + "?" + str;
		}
		xhr.open(method,url,true);
		if(method.toLowerCase()==="get") {
			xhr.send();
		}else {
			xhr.setRequestHeader("Content-Type","applx-www-form-urlencoded");
			xhr.send(str);
		}
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4&&xhr.status==200) {
				var data = xhr.responseText;
				callback&&callback(data);
			}
		}
	}
})();