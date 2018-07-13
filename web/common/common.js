(function(window,document) {
    var doc = document;
    var ele={};
    function Common(){
        // 获取cookie
        this.getCookie();
    }
    Object.defineProperty(Common.prototype,"constructor",{
        enumerable: false,
        value: Common
    });
    Common.prototype = {
        getCookie: function() {
            console.log(document.cookie);
        },
    }
})(window,document)