var sendRequestWait = function(type, url, callback){
    var done = false;
    sendRequest(type, url, function(res){
        callback(res);
        done = true;
    });
    while(done == false){
        console.log("waiting " + done);
        setTimeout(function(){}, 2000);
    }
};

var sendRequest = function(type, url, callback){
    var req = new XMLHttpRequest();
    req.addEventListener("load", function(){
        callback(this);
    });
    req.open(type, url);
    req.send();
};

var sendFile = function(file, type, url, callback){
    var req = new XMLHttpRequest();
    req.addEventListener("loadl",function() {
        callback(this)
    });
    req.open(type, url);
    req.setRequestHeader("Content-Type", "multipart/form-data");
    req.send(file);
}

var showPage = function(url){
    sendRequest("GET", url, function(res){
        console.log(res.responseText);
    });
};

var component = function(){
    return{
        DOMREF: null,
        parent: null,
        innerHTML: "",
        tag: "",
        attr: {},
        children: [],
        content: "",
        render: function(){
            var ret = "";
            ret += "<" + this.tag;
            for(key in this.attr){
                ret += " " + key + "=" + "\"" + this.attr[key] + "\"";
            }
            ret += ">";
            for(i in this.children){
                ret += this.children[i].render();
            }
            ret += this.content;
            ret += "</" + this.tag + ">";
            this.innerHTML = ret;
            if(this.DOMREF != null) this.DOMREF.innerHTML = this.innerHTML;
            return this.innerHTML;
        },
        dbgShow: function(){
            console.log(this.children);
        }
        ,
        insertAll: function(L){
            for(i in L){
                this.children.push(L[i]);
            }
        },
        insert: function(x){
            x.parent = this;
            this.children.push(x);
            console.log(x.parent);
        },
        reset: function(){
            this.children = [];
            this.innerHTML = "";
        },
        update: function(){
            this.render();
            //console.log(this);
            if(this.parent != null) this.parent.update();
        },
    };
};

var Photo = function(url){
    var obj = component();
    obj.tag = "img";
    obj.attr = {"src" : url};
    return obj;
};

var createRequest = function(list){
    var head = "handleRequest.php?";
    for(key in list){
        head += key + "=" + list[key];
    }
    return head;
};

var PhotoStream = function(photoList){
    var obj = component();
    obj.tag = "div";
    obj.insertAll(photoList);
    obj.updateStream = function () {
        var callback = function(res){
            var photoURLList = JSON.parse(res.responseText);
            var photoList = photoURLList.map((url) => Photo(url + "#" + new Date().getTime()));
            console.log(photoList);
            obj.reset();
            obj.insertAll(photoList);
            obj.update();
        };
        var req = createRequest({
            "name" : "getPhotoAll",
        });
        sendRequest("GET", req, callback);
    }
    return obj;
}

var Paragraph = function(text){
    var obj = component();
    obj.tag = "p";
    obj.content = text;
    return obj;
};

var getRootNode = function(){
    var obj = component();
    obj.tag = "div";
    obj.DOMREF = document.getElementById("root");
    return obj;
};

var UploadForm = function(){

    var obj = component();
    obj.tag="form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
    };
    var diag = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "file",
            "name" : "photo"
        };
        return obj;
    })();
    var button = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type": "submit",
            "value": "UploadFile",
            "name": "submit"
        };
        return obj;
    })();
    var tempName = (function(){
        var obj = component()
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "name",
            "value" : "uploadPhoto"

        };
        return obj;
    })();
    obj.insert(diag);
    obj.insert(button);
    obj.insert(tempName);
    return obj;

};
