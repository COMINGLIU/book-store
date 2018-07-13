(function(window,document) {
    var doc = document;
    var ele = {
        // 切换条目
        aCheckBtns: doc.querySelectorAll("#content .left>ul>li"),
        // 隐藏的条目
        aHidden: doc.querySelectorAll("#content .left>ul>li ul"),
        // 隐藏的条目下的li
        aHiddenLis: doc.querySelectorAll("#content .left>ul>li ul li"),
        // 右边切换框
        aDisplay: doc.querySelector("#content .right"),
        //ifame
        oIframe: doc.querySelector("iframe"),
    };
    // console.log(ele.aCheckBtns);
    function All() {
        this.check();
    }
    Object.defineProperty(All.prototype,'constructor',{
        enumerable: false,
        value: All
    });
    All.prototype = {
        // 点击切换条目
        check: function() {
            var count=0;
            for(var i=0,len = ele.aCheckBtns.length;i<len;i++) {
                (function(i) {
                    ele.aCheckBtns[i].onclick = function() {
                        if(i==0){
                            ele.oIframe.src = "vip/vip.html";
                        }else if(i==1) {
                            ele.oIframe.src = "orderList/orderList.html";
                        }
                        ele.aCheckBtns[i].style.backgroundColor = "rgb(88,99,157)";
                        for(var k=0,len3=ele.aCheckBtns.length;k<len3;k++) {
                            ele.aCheckBtns[k].style.height = "40px";
                        }
                        ele.aCheckBtns[i].style.height = "auto"; 
                        this.clearColor("rgb(88,99,157)","rgb(138,149,213)",ele.aCheckBtns,i);
                    }.bind(this);
                    var aLis = ele.aCheckBtns[i].getElementsByTagName("li");
                    for(var j=0,len2=aLis.length;j<len2;j++) {
                        (function(j) {
                            aLis[j].onclick = function(e) {
                                e=e||window.e;
                                if(e.stopPropagation) {
                                    e.stopPropagation();
                                }else {
                                    e.returnValue = false;
                                }
                                this.clearColor("rgb(138,149,213)","rgb(108,119,177)",aLis,j);
                                if(i==2){
                                    ele.oIframe.src = "booksM/"+aLis[j].innerHTML+".html";    
                                }else if(i==3) {
                                    ele.oIframe.src = "search/"+aLis[j].innerHTML+".html";    
                                }
                            }.bind(this)
                        }).call(this,j);
                    }
                }).call(this,i)
            }
        },
        clearColor: function(oldColor,clickColor,obj,key) {
            for(var i=0,len=obj.length;i<len;i++) {
                obj[i].style.backgroundColor = oldColor;
            }
            obj[key].style.backgroundColor = clickColor;
        },
        ajaxGet: function(url,callback) {
            var xmlhttp;
            try{
                xmlhttp = new XMLHttpRequest();
            }catch(e){
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readystate==4&&xmlhttp.status==200) {
                    var data = xmlhttp.response;
                    callback&&callback(data);
                }
            }
            xmlhttp.open("GET",url,true);
            xmlhttp.send();
        }
    };
    var adminMain = new All();
})(window,document);