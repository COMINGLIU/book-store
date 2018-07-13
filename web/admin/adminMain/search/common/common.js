var doc = document;
function Common() {
	// 增
	this.addDisplay();
}
Object.defineProperty(Common.prototype,"constructor",{
	enumerable: false,
	value: Common
});
Common.prototype = {
	// 添加项目
	addDisplay: function() {
		var ele= {
			addBtn: doc.querySelector("ul.btns li.add"),
			addList: doc.getElementById("addList"),
			closeBtn: doc.querySelector("#addList .close")
		};
		ele.addBtn.onclick = function() {
			ele.addList.style.display = "block";
		}	
		ele.closeBtn.onclick = function() {
			ele.addList.style.display = "none";
		}
	}
}
// var common = new Common();
