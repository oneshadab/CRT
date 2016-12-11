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
    req.addEventListener("load",function() {
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
        updateList: [],
        render: function(){
            var ret = "";
            ret += "<" + this.tag;
            for(key in this.attr){
                ret += " " + key + "=" + "'" + this.attr[key] + "'";
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
            //console.log(x.parent);
        },
        reset: function(){
            this.children = [];
            this.innerHTML = "";
        },
        update: function(){
            //console.log(this);
            for(var i in this.updateList){
                (this.updateList[i])();
            }
            for(var i in this.children){
                this.children[i].update();
            }
            this.render();
        },
        addUpdate: function(x){
            this.updateList.push(x);
        }
    };
};

var Photo = function(url){
    var obj = component();
    obj.tag = "img";
    obj.attr = {"src" : url};
    return obj;
};

var formatRequest = function(list){
    var head = "handleRequest.php?";
    for(key in list){
        head += key + "=" + list[key];
    }
    return head;
};

var PhotoStream = function(photoHeight = "auto", photoWidth = "100%"){
    var obj = component();
    var sup = obj;
    obj.tag = "div";
    obj.attr = { // Temporary styles
        "style" : "width: 100%;"
    };
    obj.updateStream = function () {
        var callback = function (res) {
            var photoURLList = JSON.parse(res.responseText);
            var photoList = photoURLList.map((url) => {
                var photo = Photo(url + "#" + new Date().getTime());
                photo.attr["height"] = photoHeight;
                photo.attr["width"] = photoWidth;
                photo.attr["style"] = "border-style: solid; border-width: 5px;margin: 10px;"
                return photo;
            });
            console.log(photoList);
            obj.reset();
            obj.insertAll(photoList);
            root.render();
        };
        var req = formatRequest({
            "methodName": "getPhotoAll",
        });
        sendRequest("GET", req, callback);
    }
    obj.addUpdate(obj.updateStream);
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
            "value": "Upload Photo",
            "name": "submit",
            "onclick" :"root.update();",
        };
        return obj;
    })();
    var tempName = (function(){
        var obj = component()
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "methodName",
            "value" : "uploadPhoto"

        };
        return obj;
    })();
    obj.insert(diag);
    obj.insert(button);
    obj.insert(tempName);
    return obj;

};

var redirect = function(newLocation){
    window.location = window.location + newLocation;
};

var Button = function(text, callback){
    var obj = component();
    obj.tag = "button";
    obj.content = text;
    obj.attr = {"onClick" : "(" + callback + ")()"};
    return obj
};

var LoginForm  = function(){
    var obj = component();
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
    };
    var email = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "email",
            "name" : "email"
        };
        return obj;
    })();
    var password = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "password",
            "placeholder" : "password",
            "name" : "password"
        }
        return obj;
    })();
    var loginButton = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "submit",
            "value" : "Login",
            "name" : "loginButton",
            "onclick" : "SBox.checkLogin();"
        }
        return obj;
    })();

    var temp = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "methodName",
            "value" : "loginUser",
        };
        return obj;
    })();
    obj.insert(email);
    obj.insert(password);
    obj.insert(loginButton);
    obj.insert(temp);
    return obj;
};

var RegisterForm  = function(){
    var obj = component();
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
    };
    var name = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "name",
            "name" : "name",
        }
        return obj;
    })();
    var email = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "email",
            "name" : "email"
        };
        return obj;
    })();
    var password = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "password",
            "placeholder" : "password",
            "name" : "password"
        }
        return obj;
    })();
    var temp = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "methodName",
            "value" : "registerUser",
        };
        return obj;
    })();
    var loginButton = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "submit",
            "value" : "Register",
            "name" : "registerButton",
            "onclick" : "SBox.checkLogin();"
        }
        return obj;
    })();

    obj.insert(name);
    obj.insert(email);
    obj.insert(password);
    obj.insert(loginButton);
    obj.insert(temp);
    return obj;
};

var LoginBox = function(){
    var obj = component();
    obj.tag = "div";
    obj.insert(LoginForm());
    obj.insert(RegisterForm());
    return obj;
}

var ProfileBox = function(name) {
    var obj = component();
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
    };
    var profilePicture = (function () {
        var obj = Photo("test_pro_pic.jpg");
        obj.attr["height"] = "48";
        obj.attr["width"] = "48";
        return obj;
    })();
    var profileName = (function () {
        var obj = component();
        obj.tag = "label";
        obj.content = name;
        obj.attr = {
            "style" : "margin-left: 5px; margin-bottom: 10px;",
        }
        return obj;
    })();
    var temp = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "methodName",
            "value" : "logoutUser"
        };
        return obj;
    })();
    var logoutButton = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "submit",
            "value" : "Logout",
            "style" : "float:right;",
            "onClick" : "SBox.checkLogin();"
        };
        return obj;
    })();

    obj.insert(profilePicture);
    obj.insert(profileName);
    obj.insert(temp);
    obj.insert(logoutButton);
    return obj;
};

var SessionBox = function () {
    var obj = component();
    obj.tag = "div";
    obj.checkLogin = function() {
        sendRequest("GET", formatRequest({
            "methodName": "checkLogin"
        }), function (res) {
            var user = JSON.parse(res.responseText);
            //console.log(user);
            if (user.logged_in == "yes") {
                obj.reset();
                var userBox = ProfileBox(user.name);
                obj.insert(userBox);
                root.update();
            }
            else {
                obj.reset();
                var guestBox = LoginBox();
                obj.insert(guestBox);
                root.update();
            }
        });
    };
    return obj;
};