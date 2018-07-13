(function(window,document) {
    var doc = document;
    var ele = {
        // 表格body
        oTbody: doc.querySelector("tbody"),
        // 表格所有行
        aTr: doc.querySelectorAll("tbody tr"),
        // 多选框
        aCheckBox: doc.querySelectorAll("tbody tr td:last-child input"),
        // 分页按钮
        aBtns: doc.querySelectorAll("ul.btns li")
    };
    // console.log();
    function IsVip() {
        this.init();
        // this.delItem();
    }
    Object.defineProperty(IsVip.prototype,"constructor",{
        enumerable: false,
        value: IsVip
    });
    IsVip.prototype = {
        init: function() {
            var vipItem = doc.querySelectorAll("tbody tr");
            this.ajaxGet("/web/BuyerListServlet?vip=0",function(data) {
                data = JSON.parse(data);
                console.log(data);
                for(var key in data) {
                    var i = parseInt(key);
                    var aBuyerNums = vipItem[key].getElementsByTagName("td")[0],
                            aBuyerNames = vipItem[key].getElementsByTagName("td")[1],
                            aBuyerTels = vipItem[key].getElementsByTagName("td")[2],
                            aBuyerEmail = vipItem[key].getElementsByTagName("td")[3],
                            aBuyerAddr = vipItem[key].getElementsByTagName("td")[4];
                    aBuyerNums.innerHTML = data[key]["buyerNum"];
                    aBuyerNames.innerHTML = data[key]["buyerName"];
                    aBuyerTels.innerHTML = data[key]["buyerTel"];
                    aBuyerEmail.innerHTML = data[key]["buyerEmail"];
                    aBuyerAddr.innerHTML = data[key]["buyerAdder"];
                }
            })  
            for(var i=0,len=ele.aBtns.length;i<len;i++) {
                (function(i) {
                    ele.aBtns[i].onclick = function() {
                        var sendData = ele.aBtns[i].innerHTML;
                        this.ajaxGet("/web/BuyerListServlet?vip="+sendData,function(data) {
                            window.sessionStorage.setItem("vip"+sendData,data);
                            data = JSON.parse(data);
                            console.log(data);
                            for(var key in data) {
                                var i = parseInt(key);
                                var aBuyerNums = vipItem[key].getElementsByTagName("td")[0],
                                    aBuyerNames = vipItem[key].getElementsByTagName("td")[1],
                                    aBuyerTels = vipItem[key].getElementsByTagName("td")[2],
                                    aBuyerEmail = vipItem[key].getElementsByTagName("td")[3],
                                    aBuyerAddr = vipItem[key].getElementsByTagName("td")[4];
                                aBuyerNums.innerHTML = data[key]["buyerNum"];
                                aBuyerNames.innerHTML = data[key]["buyerName"];
                                aBuyerTels.innerHTML = data[key]["buyerTel"];
                                aBuyerEmail.innerHTML = data[key]["buyerEmail"];
                                aBuyerAddr.innerHTML = data[key]["buyerAdder"];
                            }
                        }) 
                    }.bind(this)
                }).call(this,i)
            }
        },
        // 挑出选择的多选框
        checkBox: function() {
            var delArr = [];
            for(var i=0,len=ele.aCheckBox.length;i<len;i++) {
                (function(i) {
                    if(ele.aCheckBox[i].checked) {
                        var delItem = ele.aCheckBox[i].parentNode.parentNode;
                        var delText = delItem.firstElementChild;
                        var sendData = delText.innerHTML;
                        // 删除结点
                        ele.aCheckBox[i].checked=false;
                        ele.oTbody.removeChild(delItem);
                        // 删除数据库数据
                        delArr.push(sendData);
                    }
                }).call(this,i);
            }
            return delArr;
        },
        // 删除
        delItem: function() {
            var delBtn = doc.querySelector("ul.btns li:last-child");
            var sendData="";
            delBtn.onclick = function() {
                var arr = this.checkBox();
                for(var i=0,len=arr.length;i<len;i++) {
                    if(i==0){
                        sendData+="orderNum="+ arr[i];
                    }else {
                        sendData+="&orderNum="+ arr[i];
                    }
                }
                console.log(sendData);
                this.ajaxGet("/web/OrderDeleteServlet?"+sendData,function(data) {
                    console.log(data);
                })
                sendData="";
            }.bind(this)
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
    var isVip = new IsVip();
})(window,document)