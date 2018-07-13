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
        // 获取书本详情信息
        this.getDetail();
        // this.paging();
    }
    Object.defineProperty(Main.prototype,'constructor',{
        enumerable: false,
        value: Main
    });
    Main.prototype = {
        init: function() {
            // 设置localStorage
            var oLoginReg = doc.getElementsByClassName("reg-log")[0],
                searchUrl = window.location.search.split("?")[1],
                value = searchUrl.split("=")[0],
                key = searchUrl.split("=")[1],
                oWrapper = doc.getElementsByClassName("books-list")[0];
            if(window.localStorage.getItem("username")){
                oLoginReg.onclick = null;
                oLoginReg.innerHTML = window.localStorage.getItem("username")
            }
            this.ajaxGet("/web/BookSelectServlet?"+value+"="+key,function(data) {
                console.log(data);
                if(JSON.stringify(data)=="{}"){
                    this.noServerConfirm();
                }
                var count= 0;
                for(var key in data) {
                    count+=1;
                }
                var frag = document.createDocumentFragment(),
                    itemLen = oWrapper.getElementsByTagName("li").length,
                    aItems = oWrapper.querySelectorAll("li");
                if(count>itemLen){
                    console.log(aItems[0]);
                    for(var k=itemLen;k<parseInt(key)+1;k++) {
                        var item = aItems[0].cloneNode(true);
                        frag.appendChild(item);
                    }
                    oWrapper.appendChild(frag);
                }else {
                    var end = count>0?itemLen:itemLen-1,
                        aItems = oWrapper.querySelectorAll("li");
                    for(var k=count;k<end;k++) {
                        oWrapper.removeChild(aItems[k]);
                    }
                }

                for(var key in data) {
                    ele.aImgs[key].src=data[key]["imgUrl"];
                    ele.aTitle[key].innerHTML = data[key]["bookName"];
                    ele.aWriter[key].innerHTML = data[key]["name"]==undefined?"":data[key]["name"];
                    ele.aPart[key].innerHTML = data[key]["part"]==undefined?"":data[key]["part"];
                    ele.aPubName[key].innerHTML = data[key]["pubName"]==undefined?"":data[key]["pubName"];
                    ele.aVersion[key].innerHTML = data[key]["version"];
                    ele.aSmallClassNum[key].innerHTML = data[key]["smallClassName"]==undefined?"":data[key]["smallClassName"];
                    ele.aVipPrice[key].innerHTML = data[key]["vipPrice"];
                    ele.aNovipPrice[key].innerHTML = data[key]["noVipPrice"];
                    // if(data[key]["part"]=="作者"){
                    //     ele.aWriter[key].innerHTML = data[key]["name"];
                    //     ele.aPart[key].innerHTML = "";
                    // }else if(data[key]["part"]=="译者"){
                    //     ele.aWriter[key].innerHTML = "";
                    //     ele.aPart[key].innerHTML = data[key]["name"];
                    // }
                }
            }.bind(this));
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
                    value,
                    oWrapper = doc.getElementsByClassName("books-list")[0],
                    aItems = oWrapper.querySelectorAll("li");
                if(searchItem=="书名"){
                    value="bookName";
                }else if(searchItem=="作者"){
                    value="wtName";
                }else if(searchItem=="出版社") {
                    value="publishing";
                }else if(searchItem=="小类") {
                    value="smallClass";
                }
                this.ajaxGet("/web/BookSelectServlet?"+value+"="+key,function(data) {
                    console.log(data);
                    if(JSON.stringify(data)=="{}"){
                        this.noServerConfirm();
                    }else {
                        var count= 0;
                        for(var key in data) {
                            count+=1;
                        }
                        var frag = document.createDocumentFragment();
                        var itemLen = oWrapper.getElementsByTagName("li").length;
                        if(count>itemLen){
                            for(var k=itemLen;k<parseInt(key)+1;k++) {
                                var item = aItems[0].cloneNode(true);
                                frag.appendChild(item);
                            }
                            oWrapper.appendChild(frag);
                        }else {
                            var end = count>0?itemLen:itemLen-1;
                            for(var k=count;k<end;k++) {
                                oWrapper.removeChild(aItems[k]);
                            }
                        }
                        // 重新获取结点
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
                            // 书item
                            aItems: doc.querySelectorAll(".books-list>li"),
                            // 书名
                            aTitle: doc.querySelectorAll(".infos h3.bookName"),
                            // 书版本
                            aVersion: doc.querySelectorAll(".infos .version"),

                        };
                        for(var key in data) {
                            ele.aImgs[key].src=data[key]["imgUrl"];
                            ele.aTitle[key].innerHTML = data[key]["bookName"];
                            ele.aWriter[key].innerHTML = data[key]["name"]==undefined?"":data[key]["name"];
                            ele.aPart[key].innerHTML = data[key]["part"]==undefined?"":data[key]["part"];
                            ele.aPubName[key].innerHTML = data[key]["pubName"]==undefined?"":data[key]["pubName"];
                            ele.aVersion[key].innerHTML = data[key]["version"];
                            ele.aSmallClassNum[key].innerHTML = data[key]["smallClassName"]==undefined?"":data[key]["smallClassName"];
                            ele.aVipPrice[key].innerHTML = data[key]["vipPrice"];
                            ele.aNovipPrice[key].innerHTML = data[key]["noVipPrice"];
                            // if(data[key]["part"]=="作者"){
                            //     ele.aWriter[key].innerHTML = data[key]["name"];
                            //     ele.aPart[key].innerHTML = "";
                            // }else if(data[key]["part"]=="译者"){
                            //     ele.aWriter[key].innerHTML = "";
                            //     ele.aPart[key].innerHTML = data[key]["name"];
                            // }
                        }
                        for(var i=0,len=ele.aItems.length;i<len;i++) {
                            (function(i) {
                                ele.aItems[i].onclick = function() {
                                    console.log(i);
                                    var book = encodeURI(ele.aTitle[i].innerHTML),
                                        version = encodeURI(ele.aVersion[i].innerHTML);
                                    window.location.href="../detail/detail.html?book="+book+"&version="+version;
                                }
                            })(i);
                        }
                    }
                }.bind(this));
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
                        console.log(i);
                        var book = encodeURI(ele.aTitle[i].innerHTML),
                            version = encodeURI(ele.aVersion[i].innerHTML);
                        window.location.href="../detail/detail.html?book="+book+"&version="+version;
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
                aSmallClassWrapper: doc.querySelectorAll(".banner-nav>li ul")
            };
            var oWrapper = doc.getElementsByClassName("books-list")[0],
                aItems = oWrapper.querySelectorAll("li");
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
                            this.ajaxGet("/web/BookSelectServlet?smallClass="+sendData,function(data) {
                                console.log(data);
                                if(JSON.stringify(data)=="{}"){
                                    this.noServerConfirm();
                                }else {
                                    // 渲染主页所有书本数据
                                var count= 0;
                                for(var key in data) {
                                    count+=1;
                                }
                                var frag = document.createDocumentFragment();
                                var itemLen = oWrapper.querySelectorAll("li").length;
                                if(count>itemLen){
                                    for(var k=itemLen;k<parseInt(key)+1;k++) {
                                        var item = aItems[0].cloneNode(true);
                                        frag.appendChild(item);
                                    }
                                    oWrapper.appendChild(frag);
                                }else {
                                    var end = count>0?itemLen:itemLen-1;
                                    aItems = oWrapper.querySelectorAll("li");
                                    for(var k=count;k<end;k++) {
                                        oWrapper.removeChild(aItems[k]);
                                    }
                                }
                                // 重新获取结点
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
                                    // 书item
                                    aItems: doc.querySelectorAll(".books-list>li"),
                                    // 书名
                                    aTitle: doc.querySelectorAll(".infos h3.bookName"),
                                    // 书版本
                                    aVersion: doc.querySelectorAll(".infos .version"),

                                };
                                    for(var i in data) {
                                        var key = parseInt(i);
                                        if(data[key]["imgUrl"]) {
                                            ele.aImgs[key].src=data[key]["imgUrl"];
                                        }
                                        ele.aTitle[key].innerHTML = data[key]["bookName"]==undefined?"":data[key]["bookName"];
                                        ele.aWriter[key].innerHTML = data[key]["name"]==undefined?"":data[key]["name"];
                                        ele.aPart[key].innerHTML = data[key]["part"]==undefined?"":data[key]["part"];
                                        ele.aPubName[key].innerHTML = data[key]["pubName"]==undefined?"":data[key]["pubName"];
                                        ele.aVersion[key].innerHTML = data[key]["version"];
                                        ele.aSmallClassNum[key].innerHTML = data[key]["smallClassName"]==undefined?"":data[key]["smallClassName"];
                                        ele.aVipPrice[key].innerHTML = data[key]["vipPrice"];
                                        ele.aNovipPrice[key].innerHTML = data[key]["noVipPrice"];
                                        // if(data[key]["part"]=="作者"){
                                        //     ele.aWriter[key].innerHTML = data[key]["name"];
                                        //     ele.aPart[key].innerHTML = "";
                                        // }else if(data[key]["part"]=="译者"){
                                        //     ele.aWriter[key].innerHTML = "";
                                        //     ele.aPart[key].innerHTML = data[key]["name"];
                                        // }
                                    }
                                    for(var i=0,len=ele.aItems.length;i<len;i++) {
                                        (function(i) {
                                            ele.aItems[i].onclick = function() {
                                                var book = encodeURI(ele.aTitle[i].innerHTML),
                                                    version = encodeURI(ele.aVersion[i].innerHTML);
                                                window.location.href="../detail/detail.html?book="+book+"&version="+version;
                                            }
                                        })(i);
                                    }
                                }
                            }.bind(this))       
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
                    window.location.href="../user/user.html?user="+sendDate;
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
                if(main.scrollTop>0) {
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
                var speed = 10;
                var heightDead = document.documentElement.scrollHeight-736;
                if(main.scrollTop<=heightDead) {
                    main.scrollTop+=main.scrollTop+speed;
                    timer = requestAnimationFrame(bottom);
                    speed*2;
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
            for(var i=1,len = ele.aPoints.length-1;i<len;i++) {
                (function(i) {
                    ele.aPoints[i].onclick = function() {
                        for(var j=1,len3=ele.aPoints.length-1;j<len3;j++) {
                            ele.aPoints[j].style.cssText= "background-color:#fff;color:#777;";
                        }
                        ele.aPoints[i].style.cssText = "background-color:rgb(148,168,222);color:#fff";
                        this.ajaxGet("BookSelectAllServlet?page="+(i-1),function(data) {
                            console.log(data);
                            if(JSON.stringify(data)=="{}"){
                                this.noServerConfirm();
                            }
                            for(var key in data) {
                                fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassNum"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                            }
                        }.bind(this));
                        // 左页
                        ele.aPoints[0].onclick = function() {
                            var oLeft = i!==1?i-1:len-1;
                            for(var k=1,len1=ele.aPoints.length-1;k<len1;k++) {
                                ele.aPoints[k].style.cssText= "background-color:#fff;color:#777;";
                            }
                            ele.aPoints[oLeft].style.cssText = "background-color:rgb(148,168,222);color:#fff";
                            this.ajaxGet("BookSelectAllServlet?page="+(oLeft-1),function(data) {
                                console.log(data);
                                if(JSON.stringify(data)=="{}"){
                                    this.noServerConfirm();
                                }
                                for(var key in data) {
                                    fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassNum"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                                }
                            }.bind(this));
                            i= i!==1?i-1:len-1;
                        }.bind(this);
                        // 右页
                        ele.aPoints[len].onclick = function() {
                            var oRight = i!==len-1?i+1:1;
                            for(var j=1,len2=ele.aPoints.length-1;j<len2;j++) {
                                    ele.aPoints[j].style.cssText= "background-color:#fff;color:#777;";
                                }
                                ele.aPoints[oRight].style.cssText = "background-color:rgb(148,168,222);color:#fff";
                                this.ajaxGet("BookSelectAllServlet?page="+(oRight-1),function(data) {
                                    console.log(data);
                                    if(JSON.stringify(data)=="{}"){
                                        this.noServerConfirm();
                                    }
                                    for(var key in data) {
                                        fillData(key,data[key]["imgUrl"],data[key]["bookName"],data[key]["name"],data[key]["part"],data[key]["pubName"],data[key]["version"],data[key]["smallClassNum"],data[key]["vipPrice"],data[key]["noVipPrice"]);
                                    }
                                }.bind(this));
                                i= i!==len-1?i+1:1;
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
        ajaxGet: function(url,callback) {
            var xmlhttp;
            try{
                xmlhttp = new XMLHttpRequest();
            }catch(e){
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState==4&&xmlhttp.status==200) {
                    var data = JSON.parse(xmlhttp.response);
                    callback&&callback(data);
                }
            }
            xmlhttp.open("GET",url,true);
            xmlhttp.send();
        }
    };
    var main = new Main();
    
})(document,window)