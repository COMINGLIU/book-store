(function(window,document) {
    var doc = document;
    var ele = {
        // username
        oUsername: doc.querySelector(".username span"),
        // 购买记录总表
        oPurchaseTable: doc.querySelector("ul.items"),
        // 购买记录列 purchase record
        aPurchaseRecs: doc.querySelector("ul.items").getElementsByTagName("li"),
        //删除按钮
        aDelBtns: doc.querySelectorAll(".del"),
        // 昵称
        oBuyerName: doc.getElementsByClassName("buyerName")[0],
        // 电话号码
        oBuyerTel: doc.getElementsByClassName("buyerTel")[0],
        // 邮箱
        oBuyerEmail: doc.getElementsByClassName("buyerEmail")[0],
        // 地址
        oBuyerAddr: doc.getElementsByClassName("buyerAddr")[0],
        // 是否是会员
        oIsVip: doc.getElementsByClassName("isVip")[0],
        // 用户编号
        oBuyerNum: doc.getElementsByClassName("buyerNum")[0],
        // 订单盒子
        oOrderItemUl: doc.querySelector("ul.items"),
        // 订单项目
        oOrderItemItem: doc.querySelectorAll("ul.items li"),
        // 订单图片
        aOrderImgs: doc.querySelectorAll(".img img"),
        // 订单书籍名
        aOrderBookName: doc.querySelectorAll(".bookName"),
        // 订单数量
        aOrderBookCount: doc.querySelectorAll("span.bookCount"),
        // 订单日期
        aOrderDate: doc.querySelectorAll("span.orderDate"),
        // 订单金额
        aOrderBuyingPrice: doc.querySelectorAll("span.buyingPrice")
    };
    function User() {
        // 获取个人信息
        this.init();
        // 修改个人订单列表
        this.updateUserInfo();
    }
    Object.defineProperty(User.prototype,'constructor',{
        enumerable: false,
        value: User
    });
    User.prototype = {
        // init
        init: function() {
            var user = window.location.search.split("=")[1];
            this.ajaxGet("/web/BuyerUserServlet?user="+user,function(data){
                var data = JSON.parse(data);
                console.log(data);
                ele.oUsername.innerHTML = data["buyerName"];
                ele.oBuyerName.innerHTML = data["buyerName"];
                ele.oBuyerTel.innerHTML = data["buyerTel"];
                ele.oBuyerEmail.innerHTML = data["buyerEmail"];
                ele.oBuyerAddr.innerHTML = data["buyerAddr"];
                ele.oBuyerNum.innerHTML = data["buyerNum"];
                if(data["isVip"]=="是"){
                    ele.oIsVip.innerHTML="至尊会员";
                }else {
                    ele.oIsVip.innerHTML="非会员";
                }
                var sendData = data["buyerNum"];
                this.ajaxGet("/web/OrderSelectServlet?buyerNum="+sendData,function(data) {
                    window.sessionStorage.setItem("buyerInfo",data);
                    var data = JSON.parse(data);
                    console.log(data);
                    var dataCount = 0;
                    var bigLen = ele.oOrderItemItem.length;
                    for(var key in data) {
                        dataCount+=1;
                    }
                    if(dataCount<bigLen) {
                        for(var i=dataCount;i<bigLen;i++) {
                            ele.aDelBtns[i].onclick = null;
                            ele.oOrderItemUl.removeChild(ele.oOrderItemItem[i]);
                        }
                    }else {
                        for(var i=bigLen;i<dataCount;i++) {
                            var addItem = ele.oOrderItemItem[0].cloneNode(true);
                            ele.oOrderItemUl.appendChild(addItem);
                        }
                    }
                    // 重新获取数据
                    // 订单图片
                    var aOrderImgs = doc.querySelectorAll(".img img"),
                        // 订单书籍名
                        aOrderBookName = doc.querySelectorAll(".bookName"),
                        // 订单数量
                        aOrderBookCount = doc.querySelectorAll("span.bookCount"),
                        // 订单日期
                        aOrderDate = doc.querySelectorAll("span.orderDate"),
                        // 订单金额
                        aOrderBuyingPrice = doc.querySelectorAll("span.buyingPrice"),
                        // 删除按钮
                        aDelBtns= doc.querySelectorAll(".del"),
                        // 删除项
                        aDelItem = ele.oPurchaseTable.querySelectorAll("li");
                    for(key in data) {
                        var i=parseInt(key);
                        if(data[key]["imgUrl"]) {
                            aOrderImgs[i].src=data[key]["imgUrl"];    
                        }
                        aOrderBookName[i].innerHTML=data[key]["bookName"];
                        aOrderBookCount[i].innerHTML = data[key]["bookCount"];
                        aOrderDate[i].innerHTML = data[key]["orderDate"];
                        aOrderBuyingPrice[i].innerHTML = data[key]["buyingPrice"];
                    }
                    // 删除订单（需要用到data[orderNum]）
                    for(var i=0,len=aDelBtns.length;i<len;i++) {
                        (function(i) {
                            aDelBtns[i].onclick = function() {
                                aDelBtns[i].onclick = null;
                                ele.oPurchaseTable.removeChild(aDelItem[i]);
                                this.ajaxGet("/web/OrderDeleteServlet?orderNum="+data[i]["orderNum"],function(data) {
                                    console.log(data);
                                });
                            }.bind(this)
                        }).call(this,i);
                    }
                }.bind(this))
            }.bind(this))
        },
        // 修改个人信息
        updateUserInfo: function() {
            var updBtn = doc.querySelector("#content .left p:last-child"),
                infoList = doc.querySelectorAll("#content .left p"),
                count=0;
            updBtn.onclick = function() {
                count+=1;
                if(count%2!=0) {
                    for(var i=1;i<8;i+=2){
                        var tempValue = infoList[i].innerHTML;
                        if(i==3){
                            infoList[i].innerHTML = "<input type='text' value='"+tempValue+"' required='true' pattern='^1[3|4|5|8]\d{9}$'>";
                        }else if(i==5){
                            infoList[i].innerHTML = "<input type='text' value='"+tempValue+"' required='true' pattern='^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$'>";
                        }else {
                            infoList[i].innerHTML = "<input type='text' value='"+tempValue+"' required='true'>";
                        }
                    }
                    updBtn.innerHTML = "确定修改";
                }else {
                    var updInput = doc.querySelectorAll("#content .left input");
                    var userNum = doc.getElementsByClassName("buyerNum")[0];
                    var key = 0;
                    var sendData = "";
                    for(var i=1;i<8;i+=2) {
                        var tempValue = updInput[key].value;
                        sendData+=updInput[key].parentNode.className+"="+tempValue+"&";
                        infoList[i].innerHTML = tempValue;
                        key+=1;
                    }

                    sendData+=userNum.className+"="+userNum.innerHTML;
                    console.log(sendData);
                    updBtn.innerHTML = "修改信息";
                    this.ajaxGet("/web/BuyerUpdateServlet?"+sendData,function(data) {
                        console.log(data);
                        if(data=="success"){
                            alert("修改成功！");
                        }
                    })
                }
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
    var user = new User();
})(window,document)