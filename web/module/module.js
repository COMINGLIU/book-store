(function(document,window) {
    var doc = document;
    function Module() {
        // 关于弹窗
        this.aboutPop();
        // 关于注册表
        this.aboutReg();
        // 退出登陆
        this.launch();
    }
    Object.defineProperty(Module.prototype,'Constructor',{
        enumerable: false,
        value: Module
    });
    Module.prototype = {
        // 设置默认登陆账号
        loginMoren: function(obj1,obj2) {
            if(window.localStorage.getItem("username")&&window.localStorage.getItem("pass")) {
                obj1.value = window.localStorage.getItem("username");
                obj2.value = window.localStorage.getItem("pass");
            }
        },
        // 退出登陆
        launch: function() {
            var launchBtn = doc.getElementsByClassName("launch")[0],
                oRegLog=doc.querySelector(".reg-log");
                oPop=doc.getElementById("pop"),
                // 用户名
                oName=document.getElementsByName("name")[0],
                // 密码
                oPass=document.getElementsByName("pass")[0];
            if(launchBtn) {
                launchBtn.onclick = function() {
                    window.localStorage.removeItem("username");
                    oRegLog.innerHTML = "登陆/注册";
                    if(oRegLog.innerHTML=="登陆/注册") {
                        oRegLog.onclick = function() {
                            oPop.style.cssText = "height:280px;border: 15px rgba(255,255,255,.5) solid;border-radius: 10px;";
                            this.loginMoren(oName,oPass);
                        }.bind(this)
                    }
                }.bind(this);
            }
        },
        // 关于登录注册弹窗
        aboutPop: function() {
            var ele = {
                // 弹窗
                oPop:doc.getElementById("pop"),
                // 弹窗关闭键
                aPopCloseBtn:doc.querySelectorAll(".close"),
                // 注册框
                oReg: doc.querySelector("#reg"),
                // 注册按钮
                oRegBtn: doc.getElementsByName("reg")[0],
                // 注册取消按钮
                oCancel: doc.getElementsByName("cancel")[0],
                // 用户名
                oName: document.getElementsByName("name")[0],
                // 密码
                oPass: document.getElementsByName("pass")[0],
            };
            // 出现登陆注册
            var oRegLog=doc.querySelector(".reg-log");
            if(oRegLog!=null&&oRegLog.innerHTML=="登陆/注册") {
                oRegLog.onclick = function() {
                    ele.oPop.style.cssText = "height:280px;border: 15px rgba(255,255,255,.5) solid;border-radius: 10px;";
                    this.loginMoren(ele.oName,ele.oPass);
                }.bind(this)
            }
            // 关于登陆注册框
            if(ele.oPop) {
                // 关闭登陆注册框
                for(var i=0;i<2;i++) {
                    (function(i) {
                        ele.aPopCloseBtn[i].onclick = function() {
                            ele.oPop.style.height = "0";
                            ele.oPop.style.border = "0";
                            ele.oReg.style.height = "0";
                            ele.oReg.style.border = "0";    
                        };
                    })(i);
                }
                // 打开注册框，关闭登录框
                ele.oRegBtn.onclick = function() {
                    ele.oPop.style.height = "0";
                    ele.oPop.style.border = "0";
                    ele.oReg.style.cssText = "height:550px;border: 15px rgba(255,255,255,.5) solid;border-radius: 10px;";
                };
                // 点击取消注册按钮
                ele.oCancel.onclick = function() {
                    ele.oReg.style.height = "0";
                    ele.oReg.style.border = "0";
                }
            }
        },
        // 注册确认密码
        aboutReg: function() {
            var ele = {
                // 登录注册按钮
                oLogRegBtn: doc.querySelector(".reg-log"),
                // 注册框
                oReg: doc.querySelector("#reg"),
            }
            if(ele.oLogRegBtn!==null) {
                var oRegSub = doc.querySelector("#reg .password"),
                    oRegSubAgain = doc.querySelector("#reg .passAgain"),
                    oRegProp = doc.getElementsByClassName("prompt")[0];
                oRegSubAgain.onchange = function() {
                    var sub1 = oRegSub.value,
                        sub2 = oRegSubAgain.value;
                    if(sub1!==sub2) {
                        oRegProp.style.display = "block";
                    }else {
                        oRegProp.style.display = "none";
                    }
                }
                if(oRegSubAgain.value!=="") {
                    oRegSub.onchange = function() {
                        var sub1 = oRegSub.value,
                            sub2 = oRegSubAgain.value;
                        if(sub1!==sub2) {
                            oRegProp.style.display = "block";
                        }else {
                            oRegProp.style.display = "none";
                        }
                    }
                }
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
                if(xmlhttp.readystate==4&&xmlhttp.status==200) {
                    var data = xmlhttp.response;
                    callback&&callback(data);
                }
            }
            xmlhttp.open("GET",url,true);
            xmlhttp.send();
        }
    };
    var module = new Module();
})(document,window);