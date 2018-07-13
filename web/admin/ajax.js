var ajax = {
    ajaxGet: function(url,callback) {
        var xmlhttp;
        try{
            xmlhttp = new XMLHttpRequest();
        }catch(e){
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET",url,true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState==4&&xmlhttp.status==200) {
                var data = xmlhttp.response;
                callback&&callback(data);
            }
        }
    },
    ajaxPost: function(url,callback) {
        var xmlhttp;
        try{
            xmlhttp = new XMLHttpRequest();
        }catch(e){
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET",url,true);
        xmlhttp.setRequestHeader("Content-Type","applx-www-form-urlencoded");
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState==4&&xmlhttp.status==200) {
                var data = xmlhttp.response;
                callback&&callback(data);
            }
        }
    }
};
    