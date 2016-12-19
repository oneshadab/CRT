var events = [];

var addEventListener = function (trigger, callback){

    events[trigger] = callback;
}


var triggerEvent = function (call) {;
    if(call in events) {
        events[call]();
    }
}

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
        },
        remove: function(x){
            var idx = this.children.indexOf(x);
            if(idx > -1){
                this.children.splice(idx, 1);
            }
        }
    };
};

var CenterFloatObject = function (){
    var obj = component();
    obj.tag = "div";

    obj.attr["style"] =
        "position: fixed; " +
        "z-index: 999;" +
        "width: 500px;" +
        "height: 200px;" +
        "top: 50%;" +
        "left: 50%;" +
        "margin-top: -300px;" +
        "margin-left: -250px;" +
        "background-color: white;" +
        "";

    return obj;
}

var Photo = function(url){
    var obj = component();
    obj.tag = "img";
    obj.attr = {"src" : url};
    return obj;
};

var formatRequest = function(list){
    var head = "handleRequest.php?";
    for(key in list){
        head += "&" + key + "=" + list[key];
    }
    return head;
};

var PhotoStream = function(photoHeight = "auto", photoWidth = "100%"){
    var obj = component();
    var sup = obj;
    obj.tag = "div";
    obj.attr = { // Temporary styles
        "style" : "margin: 100 auto; width: 50%;"
    };
    obj.updateStream = function () {
        root.render();
        var callback = function (res) {
            var resJSON = JSON.parse(res.responseText);
            console.log(resJSON);
            var photoURLList = resJSON["photo_list"];
            var photoList = photoURLList.map((elem) => {
                var photo = Photo(elem.url + "#" + new Date().getTime());
                photo.attr["height"] = photoHeight;
                photo.attr["width"] = photoWidth;
                var avatar = Photo(elem.avatar);
                avatar.attr["height"] = "32";
                avatar.attr["width"] = "32";
                avatar.attr["style"] = "" +
                    "display: inline;" +
                    "border-radius: 50%;" +
                    "margin: 15px;" +
                    "";
                var name = (function () {
                    var obj = component();
                    obj.tag = "h5";
                    obj.content = elem.name;
                    obj.attr["style"] ="" +
                        "display: ;" +
                        "font-family: sans-serif;" +
                        "align-items: center;" +
                        "vertical-align: middle;";
                    return obj;
                })();
                return PhotoBox(avatar, name, photo);
            });
            //console.log(photoList);
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
        "style" : "" +
        "height: 10px" +
        "margin: 0 auto;" +
        "top: 100px; " +
        "",
    };
    var diag = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "file",
            "name" : "photo",
            "style" : "float:right;"
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
            "style" : "float: right;"
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
    obj.insert(button);
    obj.insert(diag);
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
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
    return obj
};

var LoginForm  = function(){
    var obj = component();
    obj.tag = "form";
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin: 0px auto; width: 50%;"
    };
    var email = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "email",
            "name" : "email",
            "style" : tempStyle
        };
        return obj;
    })();
    var password = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "password",
            "placeholder" : "password",
            "name" : "password",
            "style" : tempStyle
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
            "onclick" : "SBox.checkLogin();",
            "style" : tempStyle
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
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin: 0px auto; width: 50%;"
    };
    var name = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "name",
            "name" : "name",
            "style" : tempStyle
        }
        return obj;
    })();
    var email = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "email",
            "name" : "email",
            "style" : tempStyle
        };
        return obj;
    })();
    var password = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "password",
            "placeholder" : "password",
            "name" : "password",
            "style" : tempStyle
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
            "onclick" : "SBox.checkLogin();",
            "style" : tempStyle
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
    obj.attr["style"] = "" +
        "overflow: hidden;";
    var btn = Button("Login/Register", function(){
        var box = LoginFloatBox();
        box.attr["style"] += "" +
            "border-width:5px; " +
            "border-style: solid;";
        root.insert(box);
        root.render();
    });
    btn.attr["style"] = "" +
        "float: right;" +
        "";
    obj.insert(btn);
    return obj;
};

var LoginFloatBox = function () {
    var obj = CenterFloatObject();
    var removeButton = function () {
        var obj = Photo("removeButton.png");
        obj.attr["style"] = "" +
            "height: 30px;" +
            "width: 30px;" +
            "display: none;" +
            "position: absolute;" +
            "left: 97%;" +
            "top: -4%;";
        obj.attr['class'] = "removeButton";
        obj.attr["onclick"] = 'triggerEvent("LoginBoxClose")';
        obj.attr["onMouseOver"] = 'this.style["display"] = "block";';
        obj.attr["onMouseOut"] = 'this.style["display"] = "none";';
        return obj;
    }();
    obj.attr["onMouseOver"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "block";';
    obj.attr["onMouseOut"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "none";';
    obj.attr["style"] += "height:  400px;";
    obj.attr["style"] += "margin-top: -250px;";
    obj.attr["style"] += "padding: 20px;";
    obj.attr["style"] += "padding: 20px;";
    obj.attr["style"] += "border-width: 2px; border-style: solid; border-radius: 10px; " +
        "border-color: 	#525252";
    obj.insert(removeButton);
    obj.insert(Label("Login:"));
    obj.insert(LoginForm());
    obj.insert(Label("Register:"));
    obj.insert(RegisterForm());
    addEventListener("LoginBoxClose", function () {
        //console.log(obj);
        root.remove(obj);
        root.render();
    });

    return obj;
};

var Label = function (_content) {
    var obj = component();
    obj.tag = "label";
    obj.content = _content;
    obj.attr['style'] = "" +
        "font-size: 12px;" +
        "font-weight: bold;" +
        "font-family: sans-serif;";
    return obj;
}

var LineBreak = function () {
    var obj = component();
    obj.tag = "br";
    return obj;
}

var SettingsForm  = function(){
    var obj = component();
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "" +
            "margin: 10px auto; " +
            "width: 50%;"
    };
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
    var name = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "name",
            "name" : "name" ,
            "style" : tempStyle,
        }
        return obj;
    })();
    var email = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "email",
            "name" : "email",
            "style" : tempStyle,
        };
        return obj;
    })();
    var password = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "password",
            "placeholder" : "password",
            "name" : "password",
            "style" : tempStyle,
        }
        return obj;
    })();
    var temp = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "methodName",
            "value" : "alterUser",
        };
        return obj;
    })();
    var updateButton = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "submit",
            "value" : "Update",
            "name" : "UpdateSettingsButton",
            "onclick" : "SBox.checkLogin();",
        };
        return obj;
    })();
    obj.updateUserData = function(){
        sendRequest("GET", formatRequest({
            "methodName": "checkLogin"
        }), function (res) {
            var user = JSON.parse(res.responseText);
            if (user.logged_in == "yes") {
                name.attr["value"] = user.name;
                email.attr["value"] = user.email;
                password.attr["value"] = user.pass;
                root.render();
            }
        });
    };
    obj.addUpdate(obj.updateUserData);
    obj.insert(Label("Name:"));
    obj.insert(name);
    obj.insert(Label("Email:"));
    obj.insert(email);
    obj.insert(Label("Password:"))
    obj.insert(password);
    obj.insert(updateButton);
    obj.insert(temp);
    obj.update();
    return obj;
};

var SettingsBoxFloatSingleton = function () {
    var inner_obj = null;
    var removeButton = function () {
        var obj = Photo("removeButton.png");
        obj.attr["style"] = "" +
            "height: 30px;" +
            "width: 30px;" +
            "display: none;" +
            "position: absolute;" +
            "left: 97%;" +
            "top: -4%;";
        obj.attr['class'] = "removeButton";
        obj.attr["onclick"] = 'triggerEvent("SettingsBoxClose")';
        obj.attr["onMouseOver"] = 'this.style["display"] = "block";';
        obj.attr["onMouseOut"] = 'this.style["display"] = "none";';
        return obj;
    }();

    var removeSettingsBox = function () {
        if(inner_obj != null) root.remove(inner_obj);
        root.render();
    };
    addEventListener("SettingsBoxClose", removeSettingsBox);


    return function () {
        removeSettingsBox();
        var obj = CenterFloatObject();
        obj.insert(removeButton);
        obj.attr["style"] += "height: 400px;";
        obj.attr["style"] += "margin-top: -250px;";
        obj.attr["style"] += "border-width: 2px; border-style: solid; border-radius: 10px; " +
            "border-color: 	#525252";
        obj.attr["onMouseOver"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "block";';
        obj.attr["onMouseOut"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "none";';
        var avatarForm = UploadForm();
        avatarForm.children[2].attr["value"]="changeAvatar";
        avatarForm.attr["style"] += "margin-top: 50px;padding-bottom: 50px; margin-right: 80px;";
        obj.insert(avatarForm);
        obj.insert(SettingsForm());
        inner_obj = obj;
        return inner_obj;
    }
}

var SettingsBoxFloat = SettingsBoxFloatSingleton();


var ProfileBox = function(name, avatar) {
    var obj = component();
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin-bottom: 0px;"
    };
    var profilePicture = (function () {
        var obj = Photo(avatar);
        obj.attr["height"] = "64";
        obj.attr["width"] = "64";
        obj.attr["style"] ="" +
            "border-radius: 50%;";
        return obj;
    })();
    var profileName = (function () {
        var obj = component();
        obj.tag = "h1";
        obj.content = name;
        obj.attr = {
            "href" : "index.php",
            "align" : "left",
            "width" : "20px",
            "style" : "" +
            "margin-left: 10px; " +
            "padding-top: 10px;" +
            "display:inline; " +
            "vertical-align: top;" +
            "font-family: sans-serif;",
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
    var followButton = (function () {
        var btn = Button("Follow", function () {

        });
        btn.attr['type'] = "button";
        btn.attr["style"] = "" +
            "position: relative;" +
            "float: right;" +
            "top: 50%;" +
            "display: inline;" +
            "width: 100px;" +
            "right: 71%;" +
            "vertical-align:;" +
            "margin-top: 40px;";
        return btn;
    })();
    var settingsButton = (function(){
        var func = function(){
            root.insert(SettingsBoxFloat());
            root.render();
        };
        var btn = Button("Settings", func);
        btn.attr['type'] = "button";
        btn.attr["style"] = "" +
            "float: right;" +
            "";
        return btn;
    })();
    var profileInfo = (function () {
        var obj = component();
        obj.tag = "div";
        obj.attr["style"] = "" +
            "display: inline;"
        obj.insert(profileName);
        obj.insert(followButton);
        return obj;
    })();

    obj.insert(profilePicture);
    obj.insert(profileName);

    obj.insert(temp);
    obj.insert(logoutButton);
    obj.insert(settingsButton);
    obj.insert(followButton);

    return obj;
};

var SessionBox = function () {
    var obj = component();
    obj.tag = "div";
    obj.attr["style"] = "" +
        "padding: 10px;" +
        "margin: 0 auto;" +
        "width: 75%; " +
        "background: white;" +
        "top: -50%;" +
        "border-width: 2px;" +
        "border-radius: 5px;" +
        "border-style: solid;" +
        "border-top: 0px;" +
        "border-color: 	#dbdbdb;" +
        "margin-bottom: 0px;" +
        ";";
    
    obj.checkLogin = function() {
        sendRequest("GET", formatRequest({
            "methodName": "checkLogin"
        }), function (res) {
            var user = JSON.parse(res.responseText);
            //console.log(user);
            if (user.logged_in == "yes") {
                obj.reset();
                var userBox = ProfileBox(user.name, user.avatar);
                obj.insert(userBox);
                obj.insert(UploadForm());
                root.update();
            }
            else {
                obj.reset();
                triggerEvent("LoginBoxClose");
                var guestBox = LoginBox();
                obj.insert(guestBox);
                root.update();
            }
        });
    };
    return obj;
};



var tempFloatObject = function () {
    var obj = CenterFloatObject();
    obj.insert(new Paragraph("hello World"));
    return obj;
}


var TranslucentContainer = function () {

}

var PhotoFrameFloatSingleton = function () {
    var url = "";
    var inner_obj = null;
    var removeButton = function () {
        var obj = Photo("removeButton.png");
        obj.attr["style"] = "" +
            "height: 30px;" +
            "width: 30px;" +
            "display: none;" +
            "position: absolute;" +
            "left: 98%;" +
            "top: -5%;";
        obj.attr['class'] = "removeButton";
        obj.attr["onclick"] = 'triggerEvent("PhotoFrameClose")';
        obj.attr["onMouseOver"] = 'this.style["display"] = "block";';
        obj.attr["onMouseOut"] = 'this.style["display"] = "none";';
        return obj;
    }();
    var removePhotoFrame = function () {
        if(inner_obj != null) root.remove(inner_obj);
        root.render();
    };
    var deleteButton = (function () {
        addEventListener("DeletePhoto", function () {
            var photoID = url.split('.')[0];
            var callback = function (res) {
                console.log(res.responseText);
                removePhotoFrame();
                stream.updateStream();
                root.render();
            };
            var req = formatRequest({
               "methodName" : "deletePhoto",
                "photo_id" : photoID,
            });
            sendRequest("GET", req, callback);
        });
        var obj = Button("Delete", function () {
            triggerEvent("DeletePhoto");
        });
        return obj;
    })();


    addEventListener("PhotoFrameClose", removePhotoFrame);

    return function (_url) {
        removePhotoFrame();
        url = _url;
        var obj = CenterFloatObject();
        var photo = Photo(url);
        photo.attr["width"] = "500px";
        photo.attr["height"] = "auto";
        photo.attr["style"] += "float: left;border-width: 5px; border-style: solid;";
        obj.insert(removeButton);
        obj.insert(photo);
        obj.insert(deleteButton);
        obj.attr["onMouseOver"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "block";';
        obj.attr["onMouseOut"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "none";';
        inner_obj = obj;
        return inner_obj;
    }
}

var PhotoFrameFloat = PhotoFrameFloatSingleton();

var getElem = function (x) {
    return document.getElementById(x);
}

var PhotoBox = function (_avatar, _name, _photo) {
    var obj = component();
    obj.tag = "div";
    var photo = _photo;
    var name = _name;
    var avatar = _avatar;
    photo.attr["id"] = photo.attr["src"];
    var userProfile = (function () {
        var obj = component();
        obj.tag = "div";
        obj.insert(avatar);
        obj.insert(name);
        obj.attr["style"] = "" +
            "display: flex;" +
            "align-items: center;";

        return obj;
    })();
    obj.insert(userProfile);
    obj.insert(photo);
    obj.attr["style"] = "" +
        "border-style: solid; " +
        "border-width: 2px;" +
        "border-color: 	#efefef;" +
        "margin: 10px;" +
        "margin-bottom: 50px;" +
        "background-color: 	white;";
    var clickText = 'root.insert(PhotoFrameFloat("' + photo.attr["src"] + '"));root.render();';
    obj.attr["onClick"] = clickText;
    return obj;
}

var Container = function (x) {
    var obj = component();
    obj.tag = "div";
    obj.insert(x);
    return obj;
}
