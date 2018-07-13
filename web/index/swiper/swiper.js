var Run = (function(window,document,e) { 
    /*=============================1.给元素绑定事件的函数===============================*/ 
    var EventUtil = {
        getEvent: function(e) {
            return window.e||e;
        },
        stopPropagation: function(e) {
            if(e.stopPropagation) {
                e.stopPropagation();
            }else {
                e.cancelBubble = true;
            }
        },
        addHandle: function(element,type,fn) {
            if(element.addEventListener) {
                element.addEventListener(type,fn);
            }else if(element.attchEvent) {
                element.attachEvent("on"+type,fn);
            }else {
                element["on"+type] = fn;
            }
        },
        removeHandle: function(element,type,fn) {
            if(element.removeEventListener) {
                element.removeEventListener(type,fn);
            }else if(element.dettachEvent) {
                element.dettachEvent("on"+type,fn);
            }else {
                element["on"+type] = null;
            }
        },
        getTarget: function(e) {
            return e.target||e.srcElement;
        },
        getStyle: function(obj,attr) {
            return getComputedStyle?getComputedStyle(obj)[attr]:obj.currentStyle[attr];
        }
    };
    /*=============================2.给元素绑定事件的函数===============================*/ 

    /*=============================3.随机色函数========================================*/
    function randomColor() {
        var txt = "#";
        var arr = ["rgb(206,180,233)","rgb(200,189,241)","rgb(149,169,222)",
        "rgb(138,149,213)","rgb(179,190,244)","rgb(153,178,226)","rgb(194,176,231)",
        "rgb(132,190,223)"];
        txt = arr[Math.floor(Math.random()*8)];
        return txt;
    }
    /*=============================随机色函数========================================*/

    /*=============================4.创建按钮========================================*/
    /*
    *parentNode:此处表示content，包含ul的容器
    *itemH:图片高度
    */
    function creatBtn(parentNode,itemH) {
        var leftBtn = document.createElement("div"),
            rightBtn = document.createElement("div");
        leftBtn.innerHTML = "<";
        leftBtn.className = "leftBtn btns";
        leftBtn.style.height = itemH*.3 + "px";
        leftBtn.style.lineHeight = itemH*.3 + "px";
        rightBtn.innerHTML = ">";
        rightBtn.className = "rightBtn btns";
        rightBtn.style.height = itemH*.3 + "px";
        rightBtn.style.lineHeight = itemH*.3 + "px";
        parentNode.appendChild(leftBtn);
        parentNode.appendChild(rightBtn);
    }
    /*=============================创建按钮========================================*/

    /*=============================5.创建item函数===================================*/
    function creatItem(num,itemW,itemH){
        var frag = document.createDocumentFragment(),
            frag2 = document.createDocumentFragment(),
            oUl = document.createElement("ul"),
            oPoints = document.createElement("div");
        oUl.style.width = num*itemW + "px";
        oUl.style.height = itemH + "px";
        oUl.style.right = 0;
        oPoints.style.position = "absolute";
        oPoints.className ="points";
        demo.oWrapper.style.width = itemW + "px";
        demo.oWrapper.style.height = itemH + "px";
        for(var i=0;i<num;i++) {
            var item = document.createElement("li"),
                img = document.createElement("img"),
                points = document.createElement("em");
            item.appendChild(img);
            item.style.width = itemW + "px";
            item.style.height = itemH + "px";
            item.style.backgroundColor = randomColor();
            frag.appendChild(item);
            frag2.appendChild(points);
        }
        oUl.appendChild(frag);
        oPoints.appendChild(frag2);
        return {
            oUl: oUl,
            oPoints: oPoints
        };
    }
    /*=============================创建item函数===================================*/
    // 轮播函数
    /*
    *num:轮播图片总数
    *obj:ul
    *itemW:图片宽度
    *leftBtn:左边btn
    *rightBtn: 右边btn
    *btns:两个btn的集合
    *points:小点
    */
    /*=============================6.swipper轮播=======================================*/ 
    function swipper(num,obj,items,leftBtn,rightBtn,btns,points,time) {
        // 目标点
        var key = 0;
        obj.timer = null;
        clearInterval(obj.timer);
        obj.timer = setInterval(setPlaying,3000);
        EventUtil.addHandle(window,"blur",function() {
            clearInterval(obj.timer);
        });
        EventUtil.addHandle(window,"focus",function() {
            obj.timer = setInterval(setPlaying,3000);
        });
        // 自动轮播函数
        function setPlaying() {
            for(var i=0;i<num;i++) {
                items[i].style.opacity = "0";
            }
            items[key].style.opacity = "1";
            setPointColor(key);
            key+=1;
            if(key==num) {
                key=0;
            }
        }
        // 指定切换到某个li
        function setSomeLi(kNum) {
            for(var i=0;i<num;i++) {
                items[i].style.opacity = "0";
            }
            items[kNum].style.opacity = "1";
        }
        // 指定某个point颜色
        function setPointColor(kNum) {
            for(var i=0;i<num;i++) {
                points[i].style.backgroundColor = "rgba(204,204,204,.8)";
            }
            points[kNum].style.backgroundColor = "#333";
        }
        // 查看哪个item透明度为1
        function isNotOpacity() {
            var aim;
            for(var i=0;i<num;i++) {
                if(EventUtil.getStyle(items[i],"opacity") == 1) {
                    aim = i;
                    break;
                }
            }
            return aim;
        }
        
        /*===方法一、使用一个函数实现多个事件===*/    
        // 一次轮播动画是否结束的标志
        btns.end = true;
        // 用于保存btns[0]点击之后的timer目标值以继续执行timer
        btns[0].key = 0;
        // 用于保存btns[1]点击之后的timer目标值以继续执行timer
        btns[1].key = 0;
        //leftBtn所有绑定事件
        var leftBtnFn = function(e) {
            e = EventUtil.getEvent(e);
            switch(e.type) {
                case "mouseenter":
                    clearInterval(obj.timer);
                    break;
                case "mouseleave":
                    key = btns[0].key;
                    obj.timer = setInterval(setPlaying,3000);
                    break;
            }
        };
        // rightBtn所有绑定事件
        var rightBtnFn = function(e) {
            e = EventUtil.getEvent(e);
            switch(e.type) {
                case "mouseenter":
                    clearInterval(obj.timer);
                    break;
                case "mouseleave":
                    key = btns[1].key;
                    obj.timer = setInterval(setPlaying,3000);
                    break;
            }
        };
        btns[0].onmouseenter = leftBtnFn;
        btns[0].onclick = function() {
            if(btns.end) {
                btns.end = false;
                clearInterval(obj.timer);
                var key = isNotOpacity();
                var next = key>0?key-1:num-1;
                setSomeLi(next);
                setPointColor(next);
                EventUtil.addHandle(items[next],"transitionend",function() {
                    btns.end = true;
                });
                btns[0].key = next==num-1?0:next+1;
            }
        }
        btns[0].onmouseleave = leftBtnFn;
        btns[1].onmouseenter = rightBtnFn;
        btns[1].onclick = function() {
            if(btns.end) {
                btns.end = false;
                clearInterval(obj.timer);
                var key = isNotOpacity();
                var next = key<num-1?key+1:0;
                setSomeLi(next);
                setPointColor(next);
                EventUtil.addHandle(items[next],"transitionend",function() {
                    btns.end = true;
                });
                btns[1].key = next==num-1?0:next+1;
            }
        }
        btns[1].onmouseleave = rightBtnFn;
        // point切换事件
        (function() {
            for(let i=0,len=points.length;i<len;i++) {
                points[i].onmouseenter = function() {
                    clearInterval(obj.timer);
                    setSomeLi(i);
                    setPointColor(i);
                };
                points[i].onmouseleave = function() {
                    key = i==num-1?0:i+1;
                    obj.timer = setInterval(setPlaying,3000);
                };
            }
        })();
    }
       /*=============================swipper轮播=======================================*/ 
    /*
    *所需函数：
    *creatItem(num,itemW,itemH)
    *swipper(num,items,itemW)
    */ 
    var demo = {
        // 轮播图默认片总数
        num: 4,
        // 轮播图片默认宽度
        itemW: 300,
        // 轮播图片默认高度
        itemH: 180,
        // 保存所有的li
        items: null,
        // 保存所有的轮播图片
        imgs: null,
        init: function(config){
            // ul所在区域
            this.oWrapper = config.oWrapper;
            this.num = config.num||this.num;
            this.itemW = config.itemW||this.itemW;
            this.itemH = config.itemH||this.itemH;
            creatBtn(this.oWrapper,this.itemH);
            this.imgs = config.imgs||this.imgs;
            // 所有btn
            this.btns = document.querySelectorAll(".btns");
            // 左侧btn
            this.leftBtn = document.querySelector(".leftBtn");
            // 右侧btn
            this.rightBtn = document.querySelector(".rightBtn");
            // 创建ul、li、img
            this.oWrapper.appendChild(creatItem(this.num,this.itemW,this.itemH).oUl);
            this.oWrapper.appendChild(creatItem(this.num,this.itemW,this.itemH).oPoints)
            // 获取ul
            this.oUl = document.querySelector("#banner ul");
            // 获取所有li
            this.oLis = document.querySelectorAll("#banner ul li");
            // 获取points
            this.oPoints = document.querySelectorAll(".points em");
            // 轮播实现
            swipper(this.num,this.oUl,this.oLis,this.leftBtn,this.rightBtn,this.btns,this.oPoints);
            // 获取所有图片
            this.items = document.querySelectorAll("#banner ul li img");
            // 设置每张图片的路径
            if(this.imgs) {
                for(let key in this.items) {
                    this.items[key].src=this.imgs[key];
                }
            }
            
       }
    }
    return {
        demo: demo
    }
})(window,document);
/*
总结：在轮播中用到的知识点有：
    1.单体单例模式封装
    2.事件监听（EventUtil.addHandle）解决兼容问题
    3.获取event(EventUtil.getEvent)解决兼容问题
    4.获取触发event事件的目标target(EventUtil.getTarget)解决兼容
    5.获取css样式（EventUtil.getStyle）解决兼容
    6.结点碎片（document.createDocumentFrame()）降低dom操作，提升性能
    7.利用e.type实现一个函数实现多个事件

*/ 