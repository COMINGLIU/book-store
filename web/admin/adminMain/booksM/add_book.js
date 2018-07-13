(function(window,document) {
    var doc = document,
        ele = {
            oSmallClassTd: doc.querySelector(".smallClass"),
            oSmallClassInput: doc.getElementsByName("smallClassInput")[0],
        };
    function AddBook() {
        // 添加作者
        this.addWriter();
        // 添加译者
        this.addPart();
    }
    Object.defineProperty(AddBook.prototype,"constructor",{
        enumerable: false,
        value: AddBook
    });
    AddBook.prototype = {
        // 添加作者
        addWriter: function() {
            var ele = {
                aAddBtn: doc.getElementsByClassName("addBtn"),
                addItem: doc.querySelector(".add"),
                aAddItems: doc.getElementsByClassName("add"),
                aDelBtn: doc.getElementsByClassName("delBtn"),
                oUlContent: doc.getElementById("content"),
            };
            // 点击添加
            ele.aAddBtn[0].onclick = function() {
                if(ele.aAddBtn.length<2) {
                    var item = ele.addItem.cloneNode(true);
                    ele.aDelBtn[0].style.display = "block";
                 }else {
                    var item = ele.aAddItems[1].cloneNode(true);
                    ele.aDelBtn[0].style.display = "none";
                }
                // ele.oUlContent.appendChild(item);
                ele.oUlContent.insertBefore(item,ele.addItem.nextElementSibling);

                for(var i=1;i<ele.aDelBtn.length;i++) {
                    (function(i) {
                        ele.aDelBtn[i].onclick=function() {
                            ele.oUlContent.removeChild(this.parentNode.parentNode);
                            if(ele.aAddBtn.length<2) {
                                var item = ele.addItem.cloneNode(true);
                                ele.aDelBtn[0].style.display = "block";
                            }else {
                                var item = ele.aAddItems[1].cloneNode(true);
                                ele.aDelBtn[0].style.display = "none";
                            }
                        }
                    })(i);
                }
                // 增加按钮，删除按钮
                for(var i=1;i<ele.aAddBtn.length;i++) {
                    ele.aAddBtn[i].style.display = "none";
                }
            };
        },
        // 添加译者
        addPart: function() {
            var ele = {
                aAddBtn: doc.getElementsByClassName("addPartBtn"),
                addItem: doc.querySelector(".addPart"),
                aAddItems: doc.getElementsByClassName("addPart"),
                aDelBtn: doc.getElementsByClassName("delPartBtn"),
                oUlContent: doc.getElementById("content"),
                oAddPartToNext: doc.getElementsByClassName("addPartToNext")[0],
                oBookImg: doc.getElementsByClassName("img")[0]
            };
            var addNextTo = ele.addItem.cloneNode(true);
            // 点击添加
            ele.aAddBtn[0].onclick = function() {
                if(ele.aAddBtn.length<2) {
                    var item = ele.addItem.cloneNode(true);
                    ele.aDelBtn[0].style.display = "block";
                 }else {
                    var item = ele.aAddItems[1].cloneNode(true);
                    ele.aDelBtn[0].style.display = "none";
                }
                // ele.oUlContent.appendChild(item);
                ele.oUlContent.insertBefore(item,ele.addItem.nextElementSibling);

                for(var i=0;i<ele.aDelBtn.length;i++) {
                    (function(i) {
                        ele.aDelBtn[i].onclick=function() {
                            console.log(i);
                            ele.oUlContent.removeChild(this.parentNode.parentNode);
                            if(ele.aAddBtn.length<2) {
                                var item = ele.addItem.cloneNode(true);
                                if(ele.aDelBtn[0]){
                                    ele.aDelBtn[0].style.display = "block";    
                                }
                                
                            }else {
                                var item = ele.aAddItems[1].cloneNode(true);
                                if(ele.aDelBtn[0]) {
                                    ele.aDelBtn[0].style.display = "none";    
                                }
                            }
                        }
                    })(i);
                }
                // 增加按钮，删除按钮
                for(var i=1;i<ele.aAddBtn.length;i++) {
                    ele.aAddBtn[i].style.display = "none";
                }
            };
            ele.aDelBtn[0].onclick = function() {
                // ele.oUlContent.removeChild(this.parentNode.parentNode);
                ele.addItem.style.display = "none";
            }
            // 如果删除译者选项，再次添加
            
            if(ele.addItem.style.display = "block") {
                ele.oAddPartToNext.style.display = "none";    
            }else {
                ele.oAddPartToNext.style.display = "block";    
            }
            ele.oAddPartToNext.onclick = function() {
                ele.addItem.style.display = "block";
            }
        }
    };
    var addBook = new AddBook();
})(window,document)