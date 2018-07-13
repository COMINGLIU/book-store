(function(document,window) {
    var doc = document;
    var ele= {
        //图片
        aImgs: doc.querySelectorAll(".img img"),
        // 书名
        aTitle: doc.querySelectorAll(".infos h3.bookName"),
        // 书作者
        aWriter: doc.querySelectorAll(".infos .writer"),
        //书译者
        aPart: doc.querySelectorAll((".infos .part")),
        // 书出版社名字
        aPubName: doc.querySelectorAll(".infos .pubName"),
        // 书版本
        aVersion: doc.querySelectorAll(".infos .version"),
        // 书类型
        aSmallClassNum: doc.querySelectorAll(".infos .smallClassNum"),
        // 书vip价格
        aVipPrice: doc.querySelectorAll(".infos .vipPrice"),
        // 书非vip价格
        aNovipPrice: doc.querySelectorAll(".infos .noVipPrice"),
        // 搜索失败
        oNoServer: doc.getElementById("noServer"),
    };
    function Main() {
        this.init();
        // 切换到个人中心
        this.checkToUser();
        // 获取书本详情信息
        this.getDetail();
        // 点击小类
        this.getSmallClass();
        // 点击大类
        // this.getBigClass();
        // 置顶
        this.toTop();
        // 置底
        this.topBottom();
        // 搜索框
        this.openSearch();
        //分页
        this.paging(),
        // 关闭轮播
        this.closeBanner()
    }
    Object.defineProperty(Main.prototype,'constructor',{
        enumerable: false,
        value: Main
    });
    Main.prototype = {
        init: function() {
            // 设置localStorage
            var oLoginReg = doc.getElementsByClassName("reg-log")[0];
            if(window.localStorage.getItem("username")){
                oLoginReg.onclick = null;
                oLoginReg.innerHTML = window.localStorage.getItem("username")
            }
            // 加载首页数据
            if(window.sessionStorage.getItem("bookAll0")) {
                var dataTemp,data;
                console.log("bookAll0存在");
                dataTemp = window.sessionStorage.getItem("bookAll0");  
                data = JSON.parse(dataTemp);
                for(var key in data) {
                    ele.aImgs[key].src=data[key]["imgUrl"];
                    ele.aTitle[key].innerHTML = data[key]["bookName"];
                    ele.aWriter[key].innerHTML = data[key]["name"];
                    ele.aPart[key].innerHTML = data[key]["part"];
                    ele.aPubName[key].innerHTML = data[key]["pubName"];
                    ele.aVersion[key].innerHTML = data[key]["version"];
                    ele.aSmallClassNum[key].innerHTML = data[key]["smallClassName"];
                    ele.aVipPrice[key].innerHTML = data[key]["vipPrice"];
                    ele.aNovipPrice[key].innerHTML = data[key]["noVipPrice"];
                }
            }else{
                this.ajaxGet("BookSelectAllServlet?page=0",function(data) {
                    this.sessionSet("bookAll0",data);
                    data = JSON.parse(data);
                    console.log(data);
                    for(var key in data) {
                        ele.aImgs[key].src=data[key]["imgUrl"];
                        ele.aTitle[key].innerHTML = data[key]["bookName"];
                        ele.aWriter[key].innerHTML = data[key]["name"];
                        ele.aPart[key].innerHTML = data[key]["part"];
                        ele.aPubName[key].innerHTML = data[key]["pubName"];
                        ele.aVersion[key].innerHTML = data[key]["version"];
                        ele.aSmallClassNum[key].innerHTML = data[key]["smallClassName"];
                        ele.aVipPrice[key].innerHTML = data[key]["vipPrice"];
                        ele.aNovipPrice[key].innerHTML = data[key]["noVipPrice"];
                    }
                }.bind(this));
            }
        },
        closeBanner: function() {
            var oBannerCloseBtn = doc.querySelector(".code"),
                oBanner = doc.getElementById("banner"),
                oBannerNav = doc.getElementsByClassName("banner-nav")[0],
                open = false;
            oBannerCloseBtn.onclick = function() {
                if(open==false) {
                    oBanner.style.height = "0";
                    oBannerCloseBtn.style.cssText = "background-color:rgba(179,190,245,.5);color:#fff";
                    oBannerCloseBtn.innerHTML = "open";
                    oBannerNav.style.opacity = "0";
                    open = true;
                }else {
                    oBanner.style.height = "400px";
                    oBannerCloseBtn.style.cssText = "background-color: rgba(255,255,255,.5);color:#fff;border: 8px rgba(255,255,255,.2) solid;";
                    oBannerCloseBtn.innerHTML = "close";
                    oBannerNav.style.opacity = "1";
                    open = false;
                }
                
            }

        },
        // 搜索失败提示
        noServerConfirm: function() {
            ele.oNoServer.style.height = "100px";
            var timer = setTimeout(function(){
                ele.oNoServer.style.height = "0";
            },3000)
            return function() {
                clearTimeout(timer);
            }
        },
        // 关于搜索框
        openSearch: function() {
            // 搜索框
            var oSearchBox= doc.querySelector(".searchBox"),
                // 搜索选择框
                oSearchClass = doc.querySelector(".searchClass"),
                // 搜索选择项目
                aSearchChoice = doc.querySelectorAll(".searchClass li"),
                // 搜索框默认
                oPlaceholder = doc.querySelector(".placeholder");
            // 聚焦搜索框出现搜索项
            oSearchBox.onfocus = function() {
                oSearchClass.style.height = "0";
            }
            oPlaceholder.onclick = function() {
                oSearchClass.style.height = "93px";
            }
            // 点击搜索项
            for(var i=0,len=aSearchChoice.length;i<len;i++) {
                (function(i) {
                 aSearchChoice[i].onclick = function() {
                        oPlaceholder.innerHTML = aSearchChoice[i].innerHTML;
                    }
                })(i);
            };
            // 回车发送
            oSearchBox.onchange = function() {
                var searchItem = oPlaceholder.innerHTML,
                    key = encodeURI(oSearchBox.value),
                    value;
                if(searchItem=="书名"){
                    value="bookName";
                }else if(searchItem=="作者"){
                    value="wtName";
                }else if(searchItem=="出版社") {
                    value="publishing";
                }else if(searchItem=="小类"){
                    value="smallClass";
                }
                window.location.href = "searchPage/searchPage.html?"+value+"="+key;
                this.ajaxGet("/web/BookSelectServlet?"+value+"="+key,function(data) {
                    data = JSON.parse(data);
                    console.log(data);
                    if(JSON.stringify(data)=="{}"){
                        this.noServerConfirm();
                    }
                    for(var key in data) {
                        if(parseInt(key)>20){
                            break;
                        }else {
                            ele.aImgs[key].src=data[key]["imgUrl"];
                            ele.aTitle[key].innerHTML = data[key]["bookName"];
                            ele.aWriter[key].innerHTML = data[key]["name"]==undefined?"":data[key]["name"];
                            ele.aPart[key].innerHTML = data[key]["part"]==undefined?"":data[key]["part"];
                            ele.aPubName[key].innerHTML = data[key]["pubName"]==undefined?"":data[key]["pubName"];
                            ele.aVersion[key].innerHTML = data[key]["version"];
                            ele.aSmallClassNum[key].innerHTML = data[key]["smallClassName"]==undefined?"":data[key]["smallClassName"];
                            ele.aVipPrice[key].innerHTML = data[key]["vipPrice"];
                            ele.aNovipPrice[key].innerHTML = data[key]["noVipPrice"];
                        }
                    }
                }.bind(this));
                if(doc.getElementById("banner").clientHeight!==0) {
                    this.down();    
                }
            }.bind(this)
        },
        // 点击书本详情
        getDetail: function(url) {
            var ele = {
                // 书item
                aItems: doc.querySelectorAll(".books-list>li"),
                // 书名
                aTitle: doc.querySelectorAll(".infos h3.bookName"),
                // 书版本
                aVersion: doc.querySelectorAll(".infos .version"),
            };
            for(var i=0,len=ele.aItems.length;i<len;i++) {
                (function(i) {
                    ele.aItems[i].onclick = function() {
                        var book = encodeURI(ele.aTitle[i].innerHTML),
                            version = encodeURI(ele.aVersion[i].innerHTML);
                        window.location.href="detail/detail.html?book="+book+"&version="+version;
                    }
                })(i);
            }
        },
        // 点击大类
        getBigClass: function() {
            var ele = {
                // 大类们
                aBigClass: doc.querySelectorAll(".banner-nav>li"),
            };
            for(var i=0,len=ele.aBigClass.length;i<len;i++) {
                (function(i) {
                    ele.aBigClass[i].onclick = function() {
                        var sendData = ele.aBigClass[i].firstChild.textContent.trim();
                        sendData = encodeURI(sendData);
                        this.ajaxGet("/web/BookSelectServlet?BigClass="+sendData,function() {
                            data = JSON.parse(data);
                            console.log(data);
                        })
                    }.bind(this);
                }).call(this,i)
            }
        },
        // 点击小类(等待确认有哪些类型)
        getSmallClass:function() {
            var ele = {
                aPoints: doc.querySelectorAll("ul.btns li"),
                //图片
                aImgs: doc.querySelectorAll(".img img"),
                // 书名
                aTitle: doc.querySelectorAll(".infos h3.bookName"),
                // 书作者
                aWriter: doc.querySelectorAll(".infos .writer"),
                //书译者
                aPart: doc.querySelectorAll((".infos .part")),
                // 书出版社名字
                aPubName: doc.querySelectorAll(".infos .pubName"),
                // 书版本
                aVersion: doc.querySelectorAll(".infos .version"),
                // 书类型
                aSmallClassNum: doc.querySelectorAll(".infos .smallClassNum"),
                // 书vip价格
                aVipPrice: doc.querySelectorAll(".infos .vipPrice"),
                // 书非vip价格
                aNovipPrice: doc.querySelectorAll(".infos .noVipPrice"),
                // 小类盒子
                aSmallClassWrapper: doc.querySelectorAll(".banner-nav>li ul"),
            };
            for(var i=0,lenB=ele.aSmallClassWrapper.length;i<lenB;i++) {
                for(var j=0,lenS=ele.aSmallClassWrapper[i].querySelectorAll("li").length;j<lenS;j++) {
                    (function(j) {
                        var aSmallClass = ele.aSmallClassWrapper[i].querySelectorAll("li");    
                        aSmallClass[j].onclick = function(e){
                            e=e||window.e;
                            if(e.stopPropagation) {
                                e.stopPropagation();
                            }else {
                                e.cancelBubble = false;
                            }
                            var sendData = encodeURI(aSmallClass[j].innerHTML);
                            window.location.href = "searchPage/searchPage.html?smallClass="+sendData;
                            this.down();                     
                        }.bind(this);
                    }).call(this,j);
                }
            }
        },
        // 关于个人中心
        checkToUser: function() {
            var ele = {
                // 个人中心按钮
                oUser: doc.querySelector(".user"),
                // 登录注册按钮
                oLogRegBtn: doc.querySelector(".reg-log"),
                // 弹窗
                oPop:doc.getElementById("pop")
            };
            ele.oUser.onclick = function() {
                var sendDate = ele.oLogRegBtn.innerHTML
                if(sendDate!="登陆/注册") {
                    window.location.href="user/user.html?user="+sendDate;
                }else {
                    ele.oPop.style.cssText = "height:280px;border: 15px rgba(255,255,255,.5) solid;border-radius: 10px;";
                }
            }
        },
        // to top
        toTop: function() {
            var ele = {
                // to top
                oTop: doc.getElementById("top"),
            };
            ele.oTop.onclick = function() {
                // top();
                this.justTop(5);
            }.bind(this);
           
        },
        // 单纯上移
        justTop: function(speed){
            top();
            function top() {
                var main = document.documentElement;
                var timer = null;
                if(main.scrollTop>200) {
                    main.scrollTop-=main.scrollTop/speed;
                    timer = requestAnimationFrame(top);
                }else {
                    cancelAnimationFrame(timer);
                }
            }
        },
        topBottom: function() {
            var oBottom = doc.getElementById("bot");
            oBottom.onclick = function() {
                bottom();
            }
            function bottom() {
                var main = document.documentElement;
                var timer = null;
                var heightDead = document.documentElement.scrollHeight-736;
                if(main.scrollTop<=heightDead) {
                    main.scrollTop+=main.scrollTop*.4;
                    timer = requestAnimationFrame(bottom);
                }else {
                    cancelAnimationFrame(timer);
                }
            }
        },
        // 查询下移
        down: function() {
            toAim();
            function toAim() {
                var main = document.documentElement;
                var timer = null;
                if(main.scrollTop<350) {
                    main.scrollTop+=50;
                    timer = requestAnimationFrame(toAim);
                }else {
                    cancelAnimationFrame(timer);
                }
            }
        },
        // setCookie
        setLocal: function(username) {
            window.localStorage.setItem("username",username);
        },
        //分页
        paging: function() {
            var ele = {
                aPoints: doc.querySelectorAll("ul.btns li"),
                //图片
                aImgs: doc.querySelectorAll(".img img"),
                // 书名
                aTitle: doc.querySelectorAll(".infos h3.bookName"),
                // 书作者
                aWriter: doc.querySelectorAll(".infos .writer"),
                //书译者
                aPart: doc.querySelectorAll((".infos .part")),
                // 书出版社名字
                aPubName: doc.querySelectorAll(".infos .pubName"),
                // 书版本
                aVersion: doc.querySelectorAll(".infos .version"),
                // 书类型
                aSmallClassNum: doc.querySelectorAll(".infos .smallClassNum"),
                // 书vip价格
                aVipPrice: doc.querySelectorAll(".infos .vipPrice"),
                // 书非vip价格
                aNovipPrice: doc.querySelectorAll(".infos .noVipPrice")
            };
            for(var i=1,len = ele.aPoints.length;i<len;i++) {
                (function(i) {
                    ele.aPoints[i].onclick = function() {
                        for(var j=1,len3=ele.aPoints.length-1;j<len3;j++) {
                            ele.aPoints[j].style.cssText= "background-color:#fff;color:#777;";
                        }
                        ele.aPoints[i].style.cssText = "background-color:rgb(148,168,222);color:#fff";
                        if(window.sessionStorage.getItem("bookAll"+(i-1))) {
                            console.log("bookAll"+(i-1)+"存在");
                            var dataTemp,data;
                            dataTemp = window.sessionStorage.getItem("bookAll"+(i-1));
                            data = JSON.parse(dataTemp);
                            for(var key in data) {
                                fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassName"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                            }
                        }else {
                            this.ajaxGet("BookSelectAllServlet?page="+(i-1),function(data) {
                                window.sessionStorage.setItem("bookAll"+(i-1),data);
                                data = JSON.parse(data);
                                console.log(data);
                                for(var key in data) {
                                    fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassName"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                                }
                            });
                        }
                        // 左页
                        ele.aPoints[0].onclick = function() {
                            var oLeft = i!==1?i-1:len-2;
                            for(var k=1,len1=ele.aPoints.length-1;k<len1;k++) {
                                ele.aPoints[k].style.cssText= "background-color:#fff;color:#777;";
                            }
                            ele.aPoints[oLeft].style.cssText = "background-color:rgb(148,168,222);color:#fff";
                            if(window.sessionStorage.getItem("bookAll"+(oLeft-1))) {
                                console.log("bookAll"+(oLeft-1)+"存在");
                                var dataTemp,data;
                                dataTemp = window.sessionStorage.getItem("bookAll"+(oLeft-1));
                                data = JSON.parse(dataTemp);
                                for(var key in data) {
                                    fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassName"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                                }
                            }else {
                                this.ajaxGet("BookSelectAllServlet?page="+(oLeft-1),function(data) {
                                    window.sessionStorage.setItem("bookAll"+(oLeft-1),data);
                                    data = JSON.parse(data);
                                    console.log(data);
                                    for(var key in data) {
                                        fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassName"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                                    }
                                });
                            }
                            i= i!==1?i-1:len-2;
                        }.bind(this);
                        // 右页
                        ele.aPoints[len-1].onclick = function() {
                            var oRight = i!==len-2?i+1:1;
                            for(var j=1,len2=ele.aPoints.length-1;j<len2;j++) {
                                    ele.aPoints[j].style.cssText= "background-color:#fff;color:#777;";
                                }
                                ele.aPoints[oRight].style.cssText = "background-color:rgb(148,168,222);color:#fff";
                                if(window.sessionStorage.getItem("bookAll"+(oRight-1))) {
                                    console.log("bookAll"+(oRight-1)+"存在");
                                    var dataTemp,data;
                                    dataTemp = window.sessionStorage.getItem("bookAll"+(oRight-1));
                                    data = JSON.parse(dataTemp);
                                    for(var key in data) {
                                        fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassName"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                                    }
                                }else {
                                    this.ajaxGet("BookSelectAllServlet?page="+(oRight-1),function(data) {
                                        window.sessionStorage.setItem("bookAll"+(oRight-1),data);
                                        data = JSON.parse(data);
                                        console.log(data);
                                        for(var key in data) {
                                            fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassName"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                                        }
                                    });
                                }
                                i= i!==len-2?i+1:1;
                        }.bind(this);
                    }.bind(this)
                }).call(this,i);
            }
            
            // 获取css样式
            function getStyle(obj,attr) {
                return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
            }
            // 填充数据
            function fillData(key,a,b,c,d,e,f,g,h,i) {
                ele.aImgs[key].src= a;
                ele.aTitle[key].innerHTML = b;
                ele.aWriter[key].innerHTML = c;
                ele.aPart[key].innerHTML = d;
                ele.aPubName[key].innerHTML = e;
                ele.aVersion[key].innerHTML = f;
                ele.aSmallClassNum[key].innerHTML = g;
                ele.aVipPrice[key].innerHTML = h;
                ele.aNovipPrice[key].innerHTML = i;
            }
        },
        sessionSet: function(nowObj,obj) {
            window.sessionStorage.setItem(nowObj,obj);
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
    };
    var main = new Main();
    
})(document,window)