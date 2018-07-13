(function(window,document) {
    var doc = document;
    var ele = {
        oTbody: doc.querySelector("tbody"),
        aTr: doc.querySelectorAll("tbody tr"),
        // 多选框
        aCheckBox: doc.querySelectorAll("tbody tr td:last-child input"),
        aBtns: doc.querySelectorAll(".btns li")
    }
    function OrderList() {
        this.init();
        this.delItem();
        this.paging();
    }
    Object.defineProperty(OrderList.prototype,"constructor",{
        enumerable: false,
        value: OrderList
    });
    OrderList.prototype = {
        init: function() {
            this.ajaxGet("/web/OrderFindAllServlet?order=0",function(data) {
                data = JSON.parse(data);
                // 填写代码
                for(var i in data) {
                    var key = parseInt(i);
                    if(key>=9) {
                        break;
                    } else {
                        var aTds = ele.aTr[key].getElementsByTagName("td");
                        // 水号
                        aTds[0].innerHTML = data[i]["orderNum"];
                        // 书籍编号
                        aTds[1].innerHTML = data[i]["bookNum"];
                        // 数量
                        aTds[2].innerHTML = data[i]["bookCount"];
                        // 总金额
                        aTds[3].innerHTML = data[i]["buyingPrice"];
                        // 日期
                        aTds[4].innerHTML = data[i]["orderDate"];
                        // 买家编号
                        aTds[5].innerHTML = data[i]["buyerNum"];
                    }
                }
            });
        },
        // 分页
        paging:function() {
            var aimKey = 0;
            var sendData = 0;
            for(var i=0,len=7;i<len;i++) {
                (function(i) {
                    if(i==0||i==6) {
                        ele.aBtns[i].onclick = function() {
                            switch(i){
                                case 0:
                                    sendData = aimKey-1<0?0:aimKey-1;
                                    aimKey-=1;
                                    break;
                                case 6:
                                    sendData = aimKey+1;
                                    aimKey+=1;
                                    break;
                            }
                            this.ajaxGet("/web/OrderFindAllServlet?order="+sendData,function(data) {
                                data = JSON.parse(data);
                                console.log(data);
                                for(var k in data) {
                                    var key = parseInt(k);
                                    if(key>=9) {
                                        break;
                                    } else {
                                        var aTds = ele.aTr[key].getElementsByTagName("td");
                                        // 水号
                                        aTds[0].innerHTML = data[k]["orderNum"];
                                        // 书籍编号
                                        aTds[1].innerHTML = data[k]["bookNum"];
                                        // 数量
                                        aTds[2].innerHTML = data[k]["bookCount"];
                                        // 总金额
                                        aTds[3].innerHTML = data[k]["buyingPrice"];
                                        // 日期
                                        aTds[4].innerHTML = data[k]["orderDate"];
                                        // 买家编号
                                        aTds[5].innerHTML = data[k]["buyerNum"];
                                    }
                                }
                            }) 
                        }.bind(this)
                    }else{
                        ele.aBtns[i].onclick = function() {
                            aimKey = i;
                            sendData = parseInt(ele.aBtns[i].innerHTML)-1;
                            this.ajaxGet("/web/OrderFindAllServlet?order="+sendData,function(data) {
                                data = JSON.parse(data);
                                console.log(data);
                                for(var k in data) {
                                    var key = parseInt(k);
                                    if(key>=9) {
                                        break;
                                    } else {
                                        var aTds = ele.aTr[key].getElementsByTagName("td");
                                        // 水号
                                        aTds[0].innerHTML = data[k]["orderNum"];
                                        // 书籍编号
                                        aTds[1].innerHTML = data[k]["bookNum"];
                                        // 数量
                                        aTds[2].innerHTML = data[k]["bookCount"];
                                        // 总金额
                                        aTds[3].innerHTML = data[k]["buyingPrice"];
                                        // 日期
                                        aTds[4].innerHTML = data[k]["orderDate"];
                                        // 买家编号
                                        aTds[5].innerHTML = data[k]["buyerNum"];
                                    }
                                }
                            }) 
                        }.bind(this)
                    }
                }).call(this,i)
            }
        },
        // 挑出选择的多选框
        checkBox: function() {
            var delArr=[];
            for(var i=0,len=ele.aCheckBox.length;i<len;i++) {
                (function(i) {
                    if(ele.aCheckBox[i].checked) {
                        var delItem = ele.aCheckBox[i].parentNode.parentNode;
                        var delText = delItem.firstElementChild;
                        var sendData = delText.innerHTML;
                        delArr.push(sendData);
                        // 删除数据库数据
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
                    switch(data) {
                        case "success delete order":
                            alert("删除成功");
                            history.go(0);
                            break;
                        default: 
                            alert("删除失败");
                            break;
                    }
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
    var orderList = new OrderList();
})(window,document)