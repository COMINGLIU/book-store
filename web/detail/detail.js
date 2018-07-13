(function(document,window) {
    var doc = document;
    var ele = {
        // 图片
        oBookImg: doc.querySelector(".left .img img"),
        //书名
        oBookName: doc.querySelector(".bookName"),
        //版本号
        oVersion: doc.querySelector(".version"),
        // 作者
        oName: doc.querySelector(".name"),
        // 翻译者
        oPart:doc.querySelector(".part"),
        // 出版社
        oPubName: doc.querySelector(".pubName"),
        // 出版社编号
        oPubNum: doc.querySelector(".pubNum"),
        // 会员价
        oVipPrice: doc.querySelector(".vipPrice"),
        // 非会员价
        oNoVipPrice: doc.querySelector(".noVipPrice"),
        // 购买btn
        oBuyBtn: doc.querySelector("button.buy"),
        // 购买数量
        oBuyN: doc.getElementsByName("buyN")[0],
        // 购买表单
        oBuyInfo: doc.querySelector(".right li:last-child"),
        // 确认
        oConfirm: doc.getElementsByClassName("confirm")[0],
        // 确认框
        oOrderInfo: doc.getElementById("orderInfo"),
        // 确认购买按钮
        oSubmitBtn: doc.getElementsByName("submit")[0],
        // 取消购买按钮
        oResetBtn: doc.getElementsByName("reset")[0],
        // 个人中心按钮
        oUser: doc.querySelector(".user"),
        // 登录注册按钮
        oLogRegBtn: doc.querySelector(".reg-log"),
        // 弹窗
        oPop:doc.getElementById("pop")
    };
    // console.log(ele.obuyN);
    function Detail() {
        // 初始化
        this.init();
        // 关于购买
        this.aboutBuy();
        //切换到个人中心
        this.checkToUser();
    }
    Object.defineProperty(Detail.prototype,'constructor',{
        enumerable: false,
        value: Detail
    });
    Detail.prototype = {
        // 初始化请求（填满数据）
        init: function() {
            // 设置localStorage
            var oLoginReg = doc.getElementsByClassName("reg-log")[0];
            var search = window.location.search.split("?")[1],
                book = decodeURI(search.split("&")[0].split("=")[1]),
                version = decodeURI(search.split("&")[1].split("=")[1]);
            var ele = {
                // 图片
                oBookImg: doc.querySelector(".left .img img"),
                // 书籍编号
                oBookNum: doc.querySelector(".bookNum"),
                //书名
                oBookName: doc.querySelector(".bookName"),
                //版本号
                oVersion: doc.querySelector(".version"),
                // 作者
                oName: doc.querySelector(".name"),
                // 翻译者
                oPart:doc.querySelector(".part"),
                // 出版社
                oPubName: doc.querySelector(".pubName"),
                // 出版社编号
                oPubNum: doc.querySelector(".pubNum"),
                // 会员价
                oVipPrice: doc.querySelector(".vipPrice"),
                // 非会员价
                oNoVipPrice: doc.querySelector(".noVipPrice")
            }
            // &&oLoginReg.innerHTML!="登陆/注册"
            if(window.localStorage.getItem("username")){
                oLoginReg.onclick = null;
                var sendData = window.localStorage.getItem("username");
                oLoginReg.innerHTML = sendData;
                // 发送请求查看是否是会员
                this.ajaxGet("/web/BuyerUserServlet?isVip="+sendData,function(data) {
                    console.log(data);
                    var data = JSON.parse(data);
                    var user = document.querySelector(".user");
                    switch(data["isVip"]) {
                        case "是":
                            user.innerHTML="至尊会员";
                            user.style.color ="rgb(235,251,255)";
                            break;
                        case "否":
                            user.innerHTML="个人中心";
                            break;
                    }
                })
            }
            
            this.ajaxGet("/web/BookDetailServlet?book="+book+"&version="+version,function(data){
                var data = JSON.parse(data);
                console.log(data);
                ele.oBookImg.src=data["imgUrl"];
                ele.oBookNum.innerHTML = data["bookNum"];
                ele.oBookName.innerHTML = data["bookName"];
                ele.oVersion.innerHTML = data["version"];
                ele.oPart.innerHTML =data["part"];
                ele.oName.innerHTML = data["name"];
                ele.oPubName.innerHTML = data["pubName"];
                ele.oPubNum.innerHTML = data["smallClassName"];
                ele.oVipPrice.innerHTML = data["vipPrice"];
                ele.oNoVipPrice.innerHTML = data["noVipPrice"];
            }); 
        },
        // 点击购买
        aboutBuy: function() {
            var fee = doc.querySelector(".fee span");
            // 订单提示
            var orderYes = doc.getElementById("orderYes");
            //打开购买信息 
            ele.oBuyBtn.onclick = function() {
                ele.oBuyInfo.style.height= "24px";
            };
            // 确认购买
            ele.oConfirm.onclick = function() {
                if(ele.oLogRegBtn.innerHTML!=="登陆/注册") {
                    ele.oOrderInfo.style.height = "200px";
                }else {
                    ele.oPop.style.cssText = "height:280px;border: 15px rgba(255,255,255,.5) solid;border-radius: 10px;";
                }
            }.bind(this);
            // 取消购买
            ele.oResetBtn.onclick = function() {
                ele.oOrderInfo.style.height = "0";
            };
            ele.oSubmitBtn.onclick = function(e) {
                e=e||window.e;
                if(e.preventDefault) {
                    e.preventDefault();
                }else {
                    e.returnValue=false;
                }
                var buyerNum = window.localStorage.getItem("buyerNum"),
                    bookNum = doc.querySelector(".bookNum").innerHTML,
                    bookCount = ele.oBuyN.value,
                    buyingPrice = doc.querySelector(".fee span").innerHTML.split("=")[1];
                this.ajaxGet("/web/OrderInsertServlet?buyerNum="+buyerNum+"&bookNum="+bookNum+"&bookCount="+bookCount,function(data){
                    console.log(data);
                    switch(data) {
                        case "success":
                            ele.oResetBtn.onclick=null;
                            ele.oSubmitBtn.onclick=null;
                            ele.oOrderInfo.innerHTML = "提交订单成功,请在个人中心查看";
                            openOrderInfo(ele.oOrderInfo,"0");
                            break;
                        default: 
                            ele.oResetBtn.onclick=null;
                            ele.oSubmitBtn.onclick=null;
                            ele.oOrderInfo.innerHTML = "提交订单失败";
                            openOrderInfo(ele.oOrderInfo,"0");
                            break;
                    }
                    this.ajaxGet("/web/BuyerLeverUpServlet?buyerNum="+buyerNum,function(data) {
                        data = parseInt(data);
                        var sum = 500-data;
                        console.log(data);
                        if(data<=0) {
                            alert("您已在本店消费额已超过500元，共"+sum+"元整,，恭喜成为本店至尊会员，享受至尊优惠！");
                        }else{
                            alert("您已在本店消费满"+sum+"元,还差"+data+"元即可成为本店至尊会员,享受至尊优惠，加油哦！");
                        }
                    })
                })
            }.bind(this);
            // 给oBuyN绑定事件监听
            var handle = function(e) {
                e = e||window.e;
                switch(e.type) {
                    case "click": 
                        feeChange();
                        break;
                    case "change":
                        feeChange();
                        break;
                    case "keyup":
                        feeChange();
                        break;
                }
            };
            ele.oBuyN.onclick = handle;
            ele.oBuyN.onchange = handle;
            ele.oBuyN.onkeyup = handle;
            
            // 改变金额
            function feeChange(){
                if(parseInt(ele.oBuyN.value)<1){
                    alert("请输入0以上数据");
                }
                if(ele.oUser.innerHTML =="至尊会员"){
                    var perFee = ele.oVipPrice.innerHTML,
                        number = ele.oBuyN.value;
                    fee.innerHTML = perFee+" x "+number+" = "+ (perFee*number).toFixed(2) + " (会员价)";
                }else {
                    var perFee = ele.oNoVipPrice.innerHTML,
                        number = ele.oBuyN.value;
                    fee.innerHTML = perFee+" x "+number+" = "+(perFee*number).toFixed(2)+ " (非会员价)";
                }
            }
            function openOrderInfo(obj,hei) {
                var timer = setTimeout(function() {    
                    obj.style.height = hei;
                },1000)
                return function() {
                    clearTimeout(timer);
                }
            }
        },
        // 切换到个人中心
        checkToUser: function() {
            if(ele.oUser!==null) {
                ele.oUser.onclick = function() {
                    if(ele.oLogRegBtn.innerHTML!="登陆/注册") {
                        var  sendData = window.localStorage.getItem("username");
                        if(sendData) {
                            window.location.href="../user/user.html?user="+sendData;
                        }
                        
                    }else {
                        ele.oPop.style.cssText = "height:280px;border: 15px rgba(255,255,255,.5) solid;border-radius: 10px;";
                    }
                }
            }
        },
        
        ajaxGet: function(url,callback){
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
    };
    var detail = new Detail();

})(document,window)