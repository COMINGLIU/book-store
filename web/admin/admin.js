(function(window,document) {
    var doc = document;
    var ele = {
        // 登陆按钮
        oRegistBtn: doc.querySelector("li.reg"),
        // 登陆框
        oRegistPop: doc.getElementById("pop"),
        //关闭登陆框按钮
        oRegistClose: doc.querySelector(".close")
    };
    // console.log()
    function Admin() {
        this.aboutRegit();
        // this.logging();
    }
    Object.defineProperty(Admin.prototype,'constructor',{
        enumerable: false,
        value: Admin
    });
    Admin.prototype = {
        // 关于注册
        aboutRegit: function() { 
            ele.oRegistBtn.onclick = function(){
                    ele.oRegistPop.style.cssText = "height:280px;border: 15px rgba(255,255,255,.5) solid;border-radius: 10px;";
            }
            ele.oRegistClose.onclick = function() {
                ele.oRegistPop.style.height = "0";
                ele.oRegistPop.style.border = "0";
            }
        },
        // 登陆
        logging: function() {
            var ele = {
                // 用户名
                oName: doc.getElementsByName("name")[0],
                // 密码
                oPass: doc.getElementsByName("pass")[0],
                // 登陆按钮
                logBtn: doc.getElementById("sub"),
                // form表的呢
                form:doc.getElementsByTagName("form")[0]
            };
            var name = ele.oName.value,
                pass = ele.oPass.value;
            ele.form.onsubmit = function(e) {
                console.log(100);
                e = e||window;
                if(e.stopPropagation) {
                    e.stopPropagation();
                }else {
                    e.returnValue = false;
                }
                ajaxPost("/web/GuanliYuan",{
                    "name":name,
                    "pass":pass
                });
            }
        },
        ajaxPost: function(url,data,callback) {
            var xmlhttp;
            try{
                xmlhttp = new XMLHttpRequest();
            }catch(e){
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("GET",url,true);
            xmlhttp.setRequestHeader("Content-Type","applx-www-form-urlencoded");
            xmlhttp.send(data);
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readystate==4&&xmlhttp.status==200) {
                    var data = xmlhttp.response;
                    callback&&callback(data);
                }
            }
        }
    }
    var admin = new Admin();
})(window,document)