(function(window,document) {
    var doc = document;
    var ele = {
        oTbody: doc.querySelector("tbody"),
        aTr: doc.querySelectorAll("tbody tr"),
        // 多选框
        aCheckBox: doc.querySelectorAll("tbody tr td:last-child input"),
        // 分页按钮
        aBtns: doc.querySelectorAll("ul.btns li")
    };
    function BooksM() {
        //查看库存
        this.init();
        //删除库存
        this.delItem();
    }
    Object.defineProperty(BooksM.prototype,"constructor",{
        enumerable: false,
        value: BooksM
    });
    BooksM.prototype = {
        //查看库存
        init: function() {
            if(window.sessionStorage.getItem("bookAllManager0")) {
                console.log("bookAllManager0存在");
                var dataT,data;
                dataT = window.sessionStorage.getItem("bookAllManager0");
                data = JSON.parse(dataT);
                for(var key in data) {
                    var i = parseInt(key);
                    var aTd = ele.aTr[i].getElementsByTagName("td");
                    aTd[0].innerHTML=data[i]["bookName"];
                    aTd[1].innerHTML=data[i]["name"];
                    aTd[2].innerHTML=data[i]["part"];
                    aTd[3].innerHTML=data[i]["version"];
                    aTd[4].innerHTML=data[i]["smallClassNum"];
                    aTd[5].innerHTML=data[i]["vipPrice"];
                    aTd[6].innerHTML=data[i]["noVipPrice"];
                    aTd[7].innerHTML= data[i]["pubName"];
                }
            }else {
                this.ajaxGet("/web/BookSelectAllServlet?bookAllManager=0",function(data) {
                    window.sessionStorage.setItem("bookAllManager0",data);
                    data = JSON.parse(data);
                    console.log(data);
                    for(var key in data) {
                        var i = parseInt(key);
                        var aTd = ele.aTr[i].getElementsByTagName("td");
                        aTd[0].innerHTML=data[i]["bookName"];
                        aTd[1].innerHTML=data[i]["name"];
                        aTd[2].innerHTML=data[i]["part"];
                        aTd[3].innerHTML=data[i]["version"];
                        aTd[4].innerHTML=data[i]["smallClassNum"];
                        aTd[5].innerHTML=data[i]["vipPrice"];
                        aTd[6].innerHTML=data[i]["noVipPrice"];
                        aTd[7].innerHTML= data[i]["pubName"];
                    }
                })  
            }
            for(var i=0,len=ele.aBtns.length;i<len;i++) {
                (function(i) {
                    ele.aBtns[i].onclick = function() {
                        var sendData = ele.aBtns[i].innerHTML;
                        if(window.sessionStorage.getItem("bookAllManager"+sendData)) {
                            console.log("bookAllManager"+sendData+"存在");
                            var dataT,data;
                            dataT = window.sessionStorage.getItem("bookAllManager"+sendData);
                            data = JSON.parse(dataT);
                            for(var key in data) {
                                var j = parseInt(key);
                                var aTd = ele.aTr[j].getElementsByTagName("td");
                                aTd[0].innerHTML=data[j]["bookName"];
                                aTd[1].innerHTML=data[j]["name"];
                                aTd[2].innerHTML=data[j]["part"];
                                aTd[3].innerHTML=data[j]["version"];
                                aTd[4].innerHTML=data[j]["smallClassNum"];
                                aTd[5].innerHTML=data[j]["vipPrice"];
                                aTd[6].innerHTML=data[j]["noVipPrice"];
                                aTd[7].innerHTML= data[j]["pubName"];
                            }
                        }else {
                            this.ajaxGet("/web/BookSelectServlet?bookAllManager="+sendData,function(data) {
                                window.sessionStorage.setItem("bookAllManager"+sendData,data);
                                data = JSON.parse(data);
                                console.log(data);
                                for(var key in data) {
                                    var j = parseInt(key);
                                    var aTd = ele.aTr[j].getElementsByTagName("td");
                                    aTd[0].innerHTML=data[j]["bookName"];
                                    aTd[1].innerHTML=data[j]["name"];
                                    aTd[2].innerHTML=data[j]["part"];
                                    aTd[3].innerHTML=data[j]["version"];
                                    aTd[4].innerHTML=data[j]["smallClassNum"];
                                    aTd[5].innerHTML=data[j]["vipPrice"];
                                    aTd[6].innerHTML=data[j]["noVipPrice"];
                                    aTd[7].innerHTML= data[j]["pubName"];
                                }
                            }) 
                        }
                    }.bind(this)
                }).call(this,i)
            }
        },
        // 挑出选择的多选框
        checkBox: function() {
            var arr=[];
            for(var i=0,len=ele.aCheckBox.length;i<len;i++) {
                (function(i) {
                    if(ele.aCheckBox[i].checked) {
                        var delItem = ele.aCheckBox[i].parentNode.parentNode;
                        var delText = delItem.firstElementChild;
                        var sendData = delText.innerHTML;
                        arr.push(sendData);
                    }
                }).call(this,i);
            }
            return arr;
        },
        // 删除
        delItem: function() {
            var delBtn = doc.querySelector("ul.btns li:last-child");
            var sendData="";

            delBtn.onclick = function() {
                var arr = this.checkBox();
                for(var i=0,len=arr.length;i<len;i++) {
                    if(i==0){
                        sendData+="bookNum="+ arr[i];
                    }else {
                        sendData+="&bookNum="+ arr[i];
                    }
                }
                console.log(sendData);
                this.ajaxGet("/web/BookDeleteServlet?"+sendData,function(data) {
                    console.log(data);
                    switch(data) {
                        case "删除成功":
                            alert("删除成功");
                            break;
                        default: 
                            alert("删除失败");
                            break;
                    }
                })
            }.bind(this)
        },
        // 查询书籍出版社信息
        getBookPubDetail: function() {
            var aPubNum = doc.querySelectorAll("td:nth-child(8)");
            for(var i=0,len=aPubNum.length;i<len;i++) {
                (function(i) {
                    aPubNum[i].onclick = function() {
                        var sendData = encodeURI(this.innerHTML);
                        window.location.href="updateBook.html?bookNum="+sendData;
                    }
                })(i);
            }
        },
        ajaxGet: function(url,callback) {
            var xmlhttp;
            try{
                xmlhttp = new XMLHttpRequest();
            }catch(e){
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState==4&&xmlhttp.status==200) {
                    var data = xmlhttp.response;
                    callback&&callback(data);
                }
            }
            xmlhttp.open("GET",url,true);
            xmlhttp.send();
        }
    }
    var booksM = new BooksM();
})(window,document)