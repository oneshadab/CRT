var events = [];

var addEventTrigger = function (trigger, callback){

    events[trigger] = callback;
}


var triggerEvent = function (call) {;
    if(call in events) {
        events[call]();
    }
}


var user = {

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
    component.autoGenId += 1;
    return{
        genId: component.autoGenId,
        DOMREF: null,
        parent: null,
        innerHTML: "",
        tag: "",
        attr: {"style": ""},
        children: [],
        content: "",
        updateList: [],
        displayFlag: "",
        render: function(){
            var ret = "";
            ret += "<" + this.tag;
            ret += ' id="genId' + this.genId + '"';
            for(key in this.attr){
                ret += " " + key + "=" + "'" + this.attr[key];
                if(key == "style") ret += ";display: " + this.displayFlag + ";";
                ret += "'";
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
        setDisplay: function (flag) {
            if(flag == false)
                this.displayFlag = "none";
            else
                this.displayFlag = "";
        },
        setDisplayDOMREF : function (flag) {
            this.setDisplay(flag);
            var d = document.getElementById("genId" + this.genId);
            d.style = this.attr["style"] + ";display: " + this.displayFlag + ";";
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
        },
        getAllChildren: function (x) {
            return this.children;
        },
        setHoverEvent: function (_overFunc, _outFunc) {
            addEventTrigger("mouseEnterEvent" + this.genId, _overFunc);
            addEventTrigger("mouseLeaveEvent" + this.genId, _outFunc);
            this.attr["onmouseenter"] = 'triggerEvent("mouseEnterEvent' + this.genId + '");';
            this.attr["onmouseleave"] = 'triggerEvent("mouseLeaveEvent' + this.genId + '");';
        },




    };
};
component.autoGenId = 0;

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

var Script = function (text = "") {
    var obj = component();
    obj.tag = "script";
    obj.attr["style"] = "1";
    obj.attr["type"] = "text/javascript";
    obj.content = text;
    return obj;
};

var HashTag = function (text) {
    var obj = component();
    obj.tag = "a";
    obj.attr["href"] = "#";
    obj.attr["style"] = "" +
        "text-decoration: none;" +
        "";
    obj.content = text;
    return obj;
}

var formatForTags = function (str) {
    var out = "";
    var buff = "";
    str += " ";
    for(var i = 0; i < str.length; i++){
        buff += str[i];
        if(str[i] == " "){
            if(buff[0] == "#"){
                console.log(buff);
                buff = HashTag(buff).render();
            }
            out += buff;
            buff = "";
        }
    }
    console.log(out);
    return out;
}

var getEncode = function (str) {
    var out = "";
    var buff = "";
    str += " ";
    for(var i = 0; i < str.length; i++){
        if(str[i] != "#")
            buff += str[i];
        else
            buff += "%23";
    }
    out += buff;
    return out;
}

var FrameFloatSingleton = function () {
    var out = this;
    var done = false;
    var removeFrame = function () {
        if(out.inner_obj != null){
            root.remove(inner_obj);
            root.render();
        }
    };
    var transitionFrame = function () {
        console.log("hello");
        if(done == false){
            //setTimeout(transitionFrame, 1000);
        }

    };
    addEventTrigger("FrameClose", removeFrame);
    addEventTrigger("FrameTransition", transitionFrame);
    return (function() {
        removeFrame();
        var obj = CenterFloatObject();
        obj.removeFrame = removeFrame;
        obj.removeButton = function () {
            var obj = Photo("removeButton.png");
            obj.attr["style"] = "" +
                "height: 30px;" +
                "width: 30px;" +
                "display: none;" +
                "position: absolute;" +
                "right: -15px;" +
                "top: -15px;";
            obj.attr['class'] = "removeButton";
            obj.attr["onclick"] = 'triggerEvent("FrameClose")';
            obj.attr["onMouseOver"] = 'this.style["display"] = "block";';
            obj.attr["onMouseOut"] = 'this.style["display"] = "none";';
            return obj;
        }();
        obj.attr["style"] += "" +
            "border-radius: 2px;" +
            "border-style: solid;" +
            "top: 10%;" +
            "transition: 2s;" +
            "";
        obj.attr["onMouseOver"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "block";';
        obj.attr["onMouseOut"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "none";';
        obj.insert(obj.removeButton);
        done = false;
        out.inner_obj = obj;
        root.render();
        triggerEvent("FrameTransition");
        return obj;
    })();
};
FrameFloatSingleton.inner_obj = null; // Static Variables

var Photo = function(url, photoWidth="", photoHeight=""){
    var obj = component();
    obj.tag = "img";
    obj.updatePhoto = function (_url) {
        obj.url = _url;
        obj.attr["src"] = obj.url;

    }
    obj.attr["style"] += "" +
        "width: " + photoWidth + ";" +
        "height: " + photoHeight + ";";
    obj.updatePhoto(url);
    return obj;
};



var formatRequest = function(list){
    var head = "handleRequest.php?";
    for(key in list){
        head += "&" + key + "=" + list[key];
    }
    return head;
};

var AvatarPhoto = function (_id, photoHeight = "100%", photoWidth = "100%") {
    var id = _id;
    var obj = Photo("#");
    obj.name = "";
    obj.attr["height"] = photoHeight;
    obj.attr["width"] = photoWidth;
    obj.attr["style"] += "border-radius: 50%;"
    obj.updateAvatar = function (cleanup = function () {}) {
        var req = formatRequest({
            "methodName" : "getProfileInfo",
            "profile_id" : id,
        });
        var callback = function (res) {
            var profile = JSON.parse(res.responseText);
            obj.name = profile.name;
            obj.updatePhoto(profile.avatar);
            obj.attr["onClick"] = "stream.setProfileId(" + id + ");stream.updateStream();";
            root.render();
            cleanup();
        }
        sendRequest("GET", req, callback);
    };
    obj.updateAvatar();
    obj.attr["onClick"] = "stream.setProfileId(" + id + ");stream.updateStream();";

    return obj;
};

var AvatarBox = function (_id, photoHeight = "100%", photoWidth = "100%") {
    var obj = component();
    var photo = AvatarPhoto(_id, photoHeight, photoWidth);
    obj.nameBox = (function(){
        var head = component();
        head.tag = "h5";
        head.attr["style"] += "" +

            "font-family: sans-serif;" +
            "margin-left: 5px;" +
            "display: flex;" +
            "align-items: center;" +
            "";
        return head;
    })();
    obj.tag = "div";
    obj.updateBox = function () {
        photo.updateAvatar(function () {
            obj.nameBox.content = photo.name;
            obj.content = obj.nameBox.render();
            root.render();
        });
    };
    obj.attr["style"] = "" +
        "display: flex;" +
        "align-items: center;";

    obj.addUpdate(obj.updateBox);
    obj.updateBox();
    obj.insert(photo);
    return obj;
}

var PhotoStream = function(photoHeight = "auto", photoWidth = "100%"){
    var obj = component();
    var sup = obj;
    obj.profileID = null;
    obj.tag = "div";
    obj.attr = { // Temporary styles
        "style" : "margin: 100 auto; width: 50%;" +
            "margin-top: 90px;"
    };
    obj.setProfileId = function (val) {
        obj.profileID = val;
        if(obj.profileID != -1)
            window.history.replaceState("", "", "?p=" + obj.profileID);

        else
            window.history.replaceState("", "", "?");
        scroll(0, 0);
    }
    obj.updateStream = function () {
        if(obj.profileID == null){
            if(user.hasOwnProperty("id") == false) return;
            obj.profileID = user["id"];
        }
        root.render();
        var callback = function (res) {
            var resJSON = JSON.parse(res.responseText);
            var photoURLList = resJSON["photo_list"];
            var photoList = photoURLList.map((elem) => {
                var photo = Photo(elem.url);
                photo.attr["height"] = photoHeight;
                photo.attr["width"] = photoWidth;
                var avatar = (function() {
                    var obj = AvatarPhoto(elem.id);
                    obj.attr["height"] = "32";
                    obj.attr["width"] = "32";
                    obj.attr["style"] = "" +
                        "display: inline;" +
                        "border-radius: 50%;" +
                        "margin: 15px;" +
                        "";
                    return obj;
                })();
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
                return PhotoBox(avatar, name, photo, elem.photo_id, elem.id);
            });
            //console.log(photoList);
            var streamTitle = component();
            if(obj.profileID == -1) {
                streamTitle = (function () {
                    var obj = component();
                    obj.tag = "div";
                    var head = Heading("Home");
                    head.attr["style"] += "" +
                        "text-align: center;" +
                        "";
                    obj.insert(head);
                    return obj;
                })();
            }else {
                var followButton = (function (_profileID) {
                    var profileID = _profileID;
                    var btn = Button("Follow", function () {
                        var req = formatRequest({
                            "methodName": "toggleFollowProfile",
                            "profile_id": profileID,
                        });
                        var callback = function (res) {
                            btn.checkFollowing();
                        }
                        sendRequest("GET", req, callback);
                    });
                    btn.attr["style"] = "" +
                        "" +
                        "" +
                        "top: 50%;" +
                        "display: inline;" +
                        "width: 100px;" +
                        "height: 35px;" +
                        "float: right;" +
                        ";" +
                        ";" +
                        "font-weight: bold;" +
                        "font-family: sans-serif;";
                    var styleFollow = btn.attr["style"] + "" +
                        "background-color: #fff;" +
                        "border-style: solid;" +
                        "border-color: #3897f0;" +
                        "border-radius: 3px;" +
                        "color: #3897f0;";
                    var styleFollowing = btn.attr["style"] + "" +
                        "background-color: #70c050;" +
                        "border-style: solid;" +
                        "border-color: #70c050;" +
                        "border-radius: 3px;" +
                        "color: #fff;";
                    btn.checkFollowing = function () {
                        var req = formatRequest({
                            "methodName": "checkFollowProfile",
                            "profile_id": profileID,
                        });
                        var callback = function (res) {
                            var tar = JSON.parse(res.responseText);
                            if (tar.following == "true") {
                                btn.content = "Following";
                                btn.attr["style"] = styleFollowing;
                            }
                            else {
                                btn.content = "Follow";
                                btn.attr["style"] = styleFollow;
                            }
                            root.render();
                        }
                        sendRequest("GET", req, callback);
                    };
                    btn.checkFollowing();
                    btn.attr['type'] = "button";

                    return btn;
                })(obj.profileID);
                streamTitle = (function (profileID) {
                    var obj = component();
                    obj.tag = "div";
                    var avatar = (function() {
                        var obj = AvatarBox(profileID, "64px", "64px");
                        obj.attr["style"] += "" +
                            "display: inline-flex;" +
                            "margin-bottom: 0px;" +
                            "";
                        obj.nameBox.attr["style"] += "" +
                            "font-size: ;" +
                            "";
                        return obj;
                    })();
                    var bio = (function () {
                        var obj = Label("");
                        obj.attr["style"] += "" +
                            "display: block;;" +
                            "font-size: 24px;" +
                            "margin: 20px;"
                        return obj;
                    })();
                    obj.attr["style"] += "margin: 0px auto; display: inline;"
                    obj.insert(avatar);
                    obj.insert(followButton);
                    obj.insert(bio);

                    return obj;
                })(obj.profileID);
            };
            streamTitle.attr["style"] += "" +
                "margin: 0px auto;;" +
                ";";
            var emptyListLabel = (function () {
                var lbl = Label("No Posts to Show...");
                lbl.attr["style"] += "" +
                    "display: block;" +
                    "position: relative;" +
                    "margin: 10px auto;" +
                    "left: 0;" +
                    "right: 0;" +
                    "text-align: center;" +
                    "margin-top: 100px;" +
                    "font-size: 36px;";
                return lbl;
            })();

            obj.reset();
            if(user.logged_in== "yes"){
                obj.insert(streamTitle);
                obj.insertAll(photoList);
                if(photoList.length == 0){
                    obj.insert(emptyListLabel);
                }
            }
            root.render();
        };
        var req = formatRequest({
            "methodName": "getPhotoAll",
            "profile_id" : obj.profileID,
        });
        sendRequest("GET", req, callback);
    }
    obj.addUpdate(obj.updateStream);
    return obj;
}

var Paragraph = function(text, style=""){
    var obj = component();
    obj.tag = "p";
    obj.content = text;
    obj.attr["style"] = style;
    return obj;
};

var Heading = function (text) {
    var obj = component();
    obj.tag = "h2";
    obj.attr["style"] += "" +
        "font-family: sans-serif;" +
        "";
    obj.content = text;
    return obj;
}

var getRootNode = function(){
    var obj = component();
    obj.tag = "div";
    obj.DOMREF = document.getElementById("root");
    return obj;
};

var getFileName = function (str, maxLength = 15) {
    var ar = str.split("\\");
    var ret = "";
    if(ar.length)
        ret = ar[ar.length - 1];
    //if(ret.length > maxLength) ret = ret.substring(0, maxLength);
    return ret;
};

var UploadForm = function(){
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
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
    obj.diag = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "file",
            "id" : "photoUploadBrowse",
            "name" : "photo",
            "value" : "",
            "onchange" : 'document.getElementById("hiddenPhotoBrowseLabel").innerHTML=getFileName(this.value);',
            "style" : "display: none;"
        };
        return obj;
    })();
    obj.diagProxy = (function () {
        var btn = Button("", function () {

        });
        btn.hiddenLabel = (function() {
            var hiddenLabel = Label("Browse");
            hiddenLabel.attr["id"] = "hiddenPhotoBrowseLabel";
            hiddenLabel.attr["onclick"] = 'document.getElementById("photoUploadBrowse").click();';
            hiddenLabel.attr["style"] = "" +
                "display: inline-block;" +
                "width: 90%;;" +
                "height: 85%;;" +
                "margin:;" +
                "margin-left: 5px;" +
                "margin-right: 5px;" +
                "text-overflow: ellipsis;" +
                "white-space: nowrap;" +
                "overflow: hidden;" +
                "vertical-align: center;" +
                "text-align: center;" +
                "color: #fff;" +
                 +
                "";
            return hiddenLabel;
        })();
        btn.attr["style"] += "" +
            "display: inline;" +
            "padding: 0px;" +
            "padding-top: 15px;" +
            "height: 50px;" +
            "width: 100px;" +
            "background-color: #70c050;" +
            "border-radius: 5px;";
        btn.insert(btn.hiddenLabel);
        return btn;
    })();
    obj.button = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type": "submit",
            "value": "Upload",
            "name": "submit",
            "onclick" :'root.update();triggerEvent("FrameClose");',
        };
        obj.attr["style"] += tempStyle +
            "float: right;" +
            "background-color: #3897f0;" +
            "color: #fff;" +
            "border-color: #fff;" +
            "border-radius: 5px;" +
            "border-width: 1px;" +
            "padding: 8px;" +
            "width: 100px;" +
            "height: 50px;" +
            "font-size: 18  px;" +
            "font-weight: bold;";
        return obj;
    })();
    obj.tempName = (function(){
        var obj = component()
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "methodName",
            "value" : "uploadPhoto"

        };
        return obj;
    })();
    obj.insert(obj.diag);
    obj.insert(obj.diagProxy);
    obj.insert(obj.button);
    obj.insert(obj.tempName);
    return obj;

};

var redirect = function(newLocation){
    window.location = window.location + newLocation;
};


var Button = function(text, callback){
    var obj = component();
    obj.tag = "button";
    obj.content = text;
    obj.callback = callback;
    obj.eventID = "ButtonClick" + obj.genId;
    addEventTrigger(obj.eventID, obj.callback);
    obj.attr = {"onClick" : 'triggerEvent("ButtonClick' + obj.genId + '")', "style" : ""};
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 2px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;" +
        "margin-bottom: 0px;";
    obj.attr["style"] += tempStyle;
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
        "border-radius: 5px;" +
        "border-color: #dbdbdb;";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin: 0px auto;;"
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
            "onclick" : 'SBox.checkLogin();',
            "style" : tempStyle + "" +
            "font-weight: bold;" +
            "width: 100px;" +
            "background-color: #70c050;" +
            "color: #fff;"
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
        "border-radius: 5px;" +
        "border-color: #dbdbdb;";
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin: 0px auto;"
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
    var registerButton = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "submit",
            "value" : "Register",
            "name" : "registerButton",
            "onclick" : 'SBox.checkLogin();',
            "style" : tempStyle + "" +
            "font-weight: bold;" +
            "width: 100px;" +
            "background-color: #70c050;" +
            "color: #fff;"
        }
        return obj;
    })();

    obj.insert(name);
    obj.insert(email);
    obj.insert(password);
    obj.insert(registerButton);
    obj.insert(temp);
    return obj;
};

var LoginBox = function(){
    var obj = component();
    obj.tag = "div";
    obj.attr["style"] = "" +
        "overflow: hidden;";
    var btn = Button("Login/Register", function(){
        var box = LoginFloatBoxSingleton();
        box.attr["style"] += "" +
            "border-width:5px; " +
            "border-style: solid;";
        root.insert(box);
        root.render();
    });
    btn.attr["style"] = "" +
        "float: right;" +
        "";
    //obj.insert(btn);
    btn.callback();
    return obj;
};

var LoginFloatBoxSingleton = function () {
    var obj = FrameFloatSingleton();
    addEventTrigger("LoginDone", obj.removeFrame);
    obj.attr["style"] += "" +
        "margin: auto;" +
        "position: relative;" +
        "left: 0;" +
        "right: 0;" +
        "" +
        "top: 250px;";
    obj.attr["style"] += "height:  400px;";
    obj.attr["style"] += "width:  60%;";
    obj.attr["style"] += "margin-top: -250px;";
    obj.attr["style"] += "padding: 20px;";
    obj.attr["style"] += "padding: 20px;";
    obj.attr["style"] += "border-width: 2px; border-style: solid; border-radius: 10px; " +
        "border-color: 	#525252";
    var welcomeLabel = (function () {
        var lbl = Label("Welcome");
        lbl.attr["style"] += "" +
            "position: relative;" +
            "margin: 0 auto;" +
            "left: 0;" +
            "right: 0;" +
            "text-align: center;" +
            "font-size: 48px;" +
            "display: block;" +
            ""
        return lbl;
    })();
    var loginDiv = (function () {
        var obj = component();
        obj.tag = "div";
        obj.insert(Label("Login:", "font-size: 24px;"));
        obj.insert(LoginForm());
        obj.attr["style"] += "" +
            "float: left;" +
            "margin: 100px;" +
            "margin-left: 15%;" +
            "margin-right: 0px;" +
            ""
        return obj;
    })();
    var registerDiv = (function () {
        var obj = component();
        obj.tag = "div";
        obj.insert(Label("Register:", "font-size: 24px;"));
        obj.insert(RegisterForm());
        obj.attr["style"] += "" +
            "float: right;" +
            "margin: 100px;" +
            "margin-left: 0px;" +
            "margin-right: 15%;;" +
            "" +
            "";
        return obj;
    })();
    obj.insert(welcomeLabel);
    obj.insert(loginDiv);
    obj.insert(registerDiv);
    return obj;
};

var Label = function (_content, _style = "") {
    var obj = component();
    obj.tag = "label";
    obj.content = _content;
    obj.attr['style'] = "" +
        "font-size: 12px;" +
        "font-weight: bold;" +
        "font-family: sans-serif;" + _style;
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
            "position: relative;" +
            "margin: 0px auto; " +
            "color: #404040;" +
            ";"
    };
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 40px;" +
        "width: 100%;" +
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
        var obj = Button("Update", function () {
            
        });
        obj.attr = {
            "name" : "UpdateSettingsButton",
            "onclick" : "",
            "style" : tempStyle +
                "background-color: #082D3F;" +
                "color: #fff;" +
                "padding: 8px;" +
                "border-radius: 5px;" +
                "width: 100px;" +
                "float: right;" +
                "font-weight: bold;",
        };
        return obj;
    })();
    obj.updateUserData = function(){
        sendRequest("GET", formatRequest({
            "methodName": "checkLogin"
        }), function (res) {
            user = JSON.parse(res.responseText);
            if (user.logged_in == "yes") {
                name.attr["value"] = user.name;
                email.attr["value"] = user.email;
                password.attr["value"] = user.pass;
                root.render();
            }
        });
    };
    obj.addUpdate(obj.updateUserData);
    obj.insert(Label("Name:", "font-size: 16px;"));
    obj.insert(name);
    obj.insert(Label("Email:", "font-size: 16px;"));
    obj.insert(email);
    obj.insert(Label("Password:", "font-size: 16px;"))
    obj.insert(password);
    obj.insert(updateButton);
    obj.insert(temp);
    obj.update();
    return obj;
};

var SettingsBoxFloatSingleton = function () {
    var obj = FrameFloatSingleton();
    obj.attr["style"] += "" +
        "height: 400px;" +
        "top: 55%;" +
        "border-style: solid;" +
        "border-radius: 2px;" +
        "padding: 12px;" +
        "background-color: #FAFAFA;" +
        "border-width: 1px;" +
        "color: #404040;";
    var avatarForm = UploadForm();
    avatarForm.button.attr["value"]="Change";
    avatarForm.tempName.attr["value"]="changeAvatar";
    avatarForm.attr["style"] += "margin-top: 50px;padding-bottom: 50px; margin: 5px;";
    var avatarLabel = Label("Profile Picture:");
    avatarLabel.attr["style"] += "" +
        "font-size: 16px;" +
        "";
    obj.insert(avatarLabel);
    obj.insert(avatarForm);
    obj.insert(SettingsForm());
    return obj;
}

var ProfileBox = function(name, avatar) {
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "position: relative;" +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 0px;" +
        "border-left-width: 0px;" +
        "height: 36px;" +
        "top: -10px;" +
        "border-radius: 5px;" +
        "border-color: #fff;" +
        "color: #fff;" +
        "background-color: #082D3F;" +
        "width: 100px;" +
        "margin: 5px;" +
        "margin-left: 0px;" +
        "font-weight: bold;";
    var obj = component();
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin: 0 auto;" +
            "padding-bottom: 10px;" +
            "height: 16px;" +
            "text-align: center;"
    };
    var profilePicture = (function () {
        var obj = AvatarBox(user.id, 32, 32);
        obj.attr["style"] += "" +
            "position: absolute;" +
            "display: inline-flex;" +
            "bottom: -5px;" +
            "margin-left: 12%;" +
            "left: 0;;" +
            "width: 110px;" +
            "right: 0;" +
            "";
        return obj;
    })();
    var profileName = (function () {
        var obj = component();
        obj.tag = "h3";
        obj.content = name;
        obj.attr = {
            "href" : "index.php",
            "align" : "left",
            "width" : "10px",
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
            "style" : tempStyle +
                "float:right;" +
                "width: 100px;" +
                "background-color: #D9534F;" +
                "margin-left: 10px;" +
            "border-right-width: 0px;",
            "onSubmit" : "SBox.checkLogin();"
        };
        return obj;
    })();

    var settingsButton = (function(){
        var func = function(){
            root.insert(SettingsBoxFloatSingleton());
            root.render();
        };
        var btn = Button("Settings", func);
        btn.attr['type'] = "button";
        btn.attr["style"] = tempStyle +
            "float: right;" +
            "";
        return btn;
    })();
    var profileInfo = (function () {
        var obj = component();
        obj.tag = "div";
        obj.attr["style"] = tempStyle +
            "display: inline;"
        obj.insert(profileName);
        return obj;
    })();
    var searchButton = (function () {
        var btn = Button("Search", function () {
            root.insert(SearchFormSingleton());
            root.render();
        });
        btn.attr["type"] = "button";
        btn.attr["style"] += tempStyle +
            "float: right;" +
            "";
        return btn;
    })();
    var homeButton = (function () {
        var box = (function () {
            var obj = component();
            obj.tag = "div";
            obj.insert(Label("Label: HOV"));
            obj.attr["style"] += "" +
                "position: absolute;" +
                "top: 100%;" +
                "width: 100px;" +
                "height: 100px;" +
                "background-color: #fff;" +
                "color: #AFAFAF;" +
                "";
            return obj;
        })();
        var btn = Button("Home", function () {
            stream.setProfileId(-1);
            stream.updateStream();
            //box.setDisplayDOMREF(true);
        });

        box.setDisplay(false);
        var overFunc = function () {
            //box.setDisplayDOMREF(true);
            //console.log(true);
            //root.render();
        }
        var outFunc = function () {
            box.setDisplayDOMREF(false);
            //console.log(false);
            //root.render();
        }
        btn.setHoverEvent(overFunc, outFunc);
        btn.attr["type"] = "button";
        btn.attr["style"] += tempStyle +
            "float: left;" +
            "";
        btn.insert(box);
        return btn;
    })();
    var uploadButton = (function(){
        var btn = Button("Upload Photo", function(){
            root.insert(PhotoUploadFormSingleton());
            root.render();
        });
        btn.attr["type"] = "button";
        btn.attr["style"] += tempStyle +
            "position: relative;" +
            "float:left;" +
            "color: #fff;" +
            "background-color: #1bb76e;" +
            "border-radius: 5px;" +
            "margin-top: 5px;" +
            "width: 150px;" +
            "height: 36px;;" +
            "display:inline;" +
            "";
        return btn;
    })();

    var buttonContainer = (function () {
        var obj = component();
        obj.tag = "div";
        obj.insert(uploadButton);
        obj.insert(logoutButton);
        obj.insert(settingsButton);
        obj.insert(searchButton);
        obj.attr["style"] += "" +
            "width: 56.5%;" +
            "float: right;" +
            "padding-right: 10px;";

        return obj;
    })();


    obj.insert(profilePicture);
    obj.insert(homeButton);

    //obj.insert(profileName);

    obj.insert(temp);
    obj.insert(buttonContainer);


    return obj;
};

var SessionBox = function () {
    var obj = component();
    obj.tag = "div";
    obj.attr["style"] = "" +
        "position: fixed;" +
        "height: 48px;" +
        "padding: 0px;" +
        "padding: 10px;" +
        "box-sizing: border-box;" +
        "margin: 0 auto;" +
        "width: 100%; " +
        "background: white;" +
        "top: 0px;;" +
        "border-width: 2px;" +
        "border-radius: 5px;" +
        "border-style: solid;" +
        "border-top: 0px;" +
        "border-color: 	#dbdbdb;" +
        "margin-bottom: 0px;" +
        "padding-right: 0px;" +
        ";";

    var emptyCleanup = function (result) {

    }
    obj.checkLogin = function(cleanup = emptyCleanup) {
        sendRequest("GET", formatRequest({
            "methodName": "checkLogin"
        }), function (res) {
            var prevState = user.logged_in;
            user = JSON.parse(res.responseText);
            //console.log(user);
            if (user.logged_in == "yes") {
                obj.reset();
                var userBox = ProfileBox(user.name, user.avatar);
                obj.insert(userBox);
                triggerEvent("LoginDone");
                root.update();
                cleanup(true);
             }
            else {
                obj.reset();
                var guestBox = LoginBox();
                obj.insert(guestBox);
                root.update();
                cleanup(false);
            }
        });
    };
    return obj;
};

var TranslucentContainer = function () {

}

var showDeleteButton = function (parent) {
    var d = parent.getElementsByClassName("deleteButton")[0];
    d.style.display = "block";
};
var hideDeleteButton = function (parent) {
    var d = parent.getElementsByClassName("deleteButton")[0];
    d.style.display = "none";
};

var Comment = function (_commentRes) {
    var text = _commentRes.description;
    var id = _commentRes.user_id;
    var obj = component();
    var deleteButton = (function () {
        var btn = Button("", function () {
            var req = formatRequest({
                "methodName" : "deleteComment",
                "photo_id" : _commentRes.photo_id,
                "moment" : _commentRes.moment,
            });
            var callback = function (res) {
                root.update();
            };
            sendRequest("GET", req, callback);
        });
        btn.insert(Photo("removeButtonAlt.jpg", "14px", "14px"));
        btn.attr["style"] += "" +
            "display: none;" +
            "float: right;" +
            "background-color: #fff;" +
            "border-width: 0px;" +
            "";
        btn.attr["class"] = "deleteButton";
        return btn;
    })();
    var avatarBox = (function () {
        var obj = AvatarBox(id, "32px", "32px");
        //console.log(obj);
        obj.attr["style"] += "" +
            "height: 36px;" +
            "margin-top: 3px;";
        return obj;
    })();
    var textBox = (function () {
        var obj = component();
        obj.tag = "div";
        obj.content = text;
        obj.attr["style"] += "" +
            "margin: 0px;" +
            "margin-left: 32px;" +
            "font-family: sans-serif;" +
            "word-wrap: break-word;" +
            "";
        return obj;
    })();
    obj.tag = "div";
    obj.attr["style"] += "" +
        "font-size: 14px;" +
        "left: 32px;";
    obj.attr["onmouseover"] = 'showDeleteButton(this);'
    obj.attr["onmouseout"] = 'hideDeleteButton(this);'
    obj.insert(deleteButton);
    obj.insert(avatarBox);
    obj.insert(textBox);
    return obj;
}

var CommentStream = function (photoID) {
    var obj = component();
    obj.tag = "div";
    var commentLabel = (function () {
        var obj = Label("Comments:");
        obj.attr["style"] += "" +
            "font-size: 16px;" +
            "margin-top: 15px;" +
            "";
        return obj;
    })();
    obj.updateCommentStream = function () {
        var req = formatRequest({
            "methodName" : "getPhotoCommentAll",
            "photo_id" : photoID,
        });
        var callback = function (res) {
            var tar = JSON.parse(res.responseText);
            var commentList = tar.commentList.map(function (comment) {
                return Comment(comment);
            });
            obj.reset();
            //obj.insert(commentLabel);
            obj.insertAll(commentList);
            root.render();
        };
        sendRequest("GET", req, callback);
    };
    obj.attr["style"] += "" +
        "height: 252px;" +
        "overflow: auto;" +
        "";
    obj.addUpdate(obj.updateCommentStream);
    obj.updateCommentStream();
    return obj;
};

var CommentForm = function (photoID) {
    var tempStyle = "display: inline; margin-bottom: 10px; " +
        "padding: 12px;" +
        "" +
        "border-style: solid;" +
        "border-width: 0px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
    var obj = component();
    obj.tag = "form";
    obj.attr ={
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin: 0px auto; width: 100%;",
    };
    var commentText = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "Write your comment here",
            "name" : "commentText",
            "style" : tempStyle +"" +
            "margin-right: 0px;" +
            "margin-left: 1px;" +
            "width: 75%",
        };
        return obj;
    })();
    var commentSubmitButton = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "submit",
            "value" : "Comment",
            "onclick" : "",
            "style" : tempStyle +"" +
                "display: inline;" +
                "background-color: #70c050;" +
                "border-width: 0px;" +
                "width: 23.3%;" +
                "color: #fff",
        };
        var btn = Button("Comment", function () {

        });
        btn.attr["style"] += tempStyle +"" +
            "display: inline-block;" +
            "background-color: #70c050;" +
            "border-width: 0px;" +
            "width: 100px;" +
            "color: #fff";
        return obj;
    })();
    var hiddenMethodName = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "methodName",
            "value" : "addPhotoComment",
        }
        return obj;
    })();
    var hiddenPhotoID = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "hidden",
            "name" : "photo_id",
            "value" : photoID,
        };
        return obj;
    })();
    obj.insert(commentText);
    obj.insert(commentSubmitButton);
    obj.insert(hiddenMethodName);
    obj.insert(hiddenPhotoID);
    return obj;
};

var PhotoDetails = function (photoID) {
    var obj = component();
    obj.tag = "div";
    obj.tar = {};
    obj.description = "";
    obj.descriptionBox = component();
    obj.descriptionBox.attr["readonly"] = "readonly"
    obj.moment = "";
    obj.editMode = "On";
    obj.toggleEdit = function () {
        if(obj.editMode == "On") {
            obj.setEditOff();
        }
        else {
            obj.setEditOn();
        }
    };
    obj.setEditOn = function () {
        delete obj.descriptionBox.attr.readonly;
        obj.descriptionBox.attr["style"] = "" +
            "outline: ;" +
            "margin-top: 10px;" +
            "height: 70px;" +
            "font-size: 16px;" +
            "border-width: 1px;" +
            "resize: none;" +
            "width: 95%;";
        obj.editMode = "On";
    };
    obj.setEditOff = function () {
        obj.descriptionBox.attr["readonly"] = "readonly";
        obj.descriptionBox.attr["style"] = "" +
            "outline: none;" +
            "margin-top: 10px;" +
            "height: 70px;" +
            "font-size: 16px;" +
            "border-width: 0px;" +
            "resize: none;" +
            "width: 95%;" ;
        obj.editMode = "Off";
    };
    obj.updatePhotoDetails = function (cleanup = function () {}) {
        var req = formatRequest({
            "methodName" : "getPhotoInfo",
            "photo_id" : photoID,
        });
        var callback = function (res) {
            obj.tar = JSON.parse(res.responseText);
            obj.description = obj.tar.description;
            obj.descriptionBox = (function(){
                var txt = component();
                txt.tag = "textarea";
                txt.content = obj.description;
                txt.attr["class"] = "PhotoDetailTextArea";
                return txt;
            })();
            obj.moment = Paragraph(obj.tar.moment, "font-size: 11px;");
            obj.reset();
            obj.insert(obj.descriptionBox);
            obj.insert(obj.moment);
            obj.setEditOff();
            root.render();
            cleanup();
        };
        sendRequest("GET", req, callback);
    };
    obj.addUpdate(obj.updatePhotoDetails);
    obj.updatePhotoDetails();
    return obj;
}


var PhotoFrameFloatSingleton = function (_url, _photoID, _userID) {
    var obj = FrameFloatSingleton();
    var url = _url;
    var photoID = _photoID;
    var userID = _userID;
    var photoDetails = PhotoDetails(photoID);
    var deleteButton = (function () {
        var btn = Button("Delete", function () {
            var callback = function (res) {
                stream.updateStream();
                root.render();
                obj.removeFrame();
            };
            var req = formatRequest({
                "methodName" : "deletePhoto",
                "photo_id" : photoID,
            });
            sendRequest("GET", req, callback);
        });
        btn.attr["style"] += "" +
            "background-color: #D9534F;" +
            "color: #fff;" +
            "padding: 8px;" +
            "margin-bottom: 5px;" +
            "margin-top: 2px;" +
            "margin-right: 4px;" +
            "vertical-align: middle;" +
            "border-radius: 5px;" +
            "display: inline-block;" +
            "float: right;";
        return btn;
    })();
    var editButton = (function () {
        var btn = Button("Edit", function () {
            photoDetails.toggleEdit();
            if(photoDetails.editMode=="On"){
                btn.content = "Done";
            }
            else{
                var ar = document.getElementsByClassName("PhotoDetailTextArea");
                var d = ar[ar.length - 1];
                photoDetails.description = d.value;
                var req = formatRequest({
                    "methodName" : "changePhotoInfo",
                    "photo_id" : photoID,
                    "description" : getEncode(photoDetails.description)
                });
                var callback = function (res) {
                    console.log("res " + req + " = " + res.responseText);
                    photoDetails.updatePhotoDetails();
                    root.update();
                };
                sendRequest("GET", req, callback);
                btn.content = "Edit";
            }
            root.render();

        });
        btn.attr['style'] += "" +
            "display: inline-block;" +
            "width: 60px;" +
            "padding: 8px;" +
            "background-color: #082D3F;" +
            "color: #fff;" +
            "border-radius: 5px;" +
            "font-weight: bold;" +
            "float: right;" +
            "margin-top: 2px;" +
            "margin-bottom: 5px;" +
            "";
        return btn;
    })();
    var likeLabel = (function () {
        var obj = Label("Be the first person to like this");
        obj.attr["style"] += "" +
            "display: block;" +
            ""
        return obj;
    })();
    var likeButton = (function () {
        var btn = Button("Like", function () {
            var req = formatRequest({
                "methodName": "toggleLikePhoto",
                "photo_id": photoID,
            });
            var callback = function (res) {
                btn.checkLiked();
            }
            sendRequest("GET", req, callback);
        });
        btn.attr["style"] =
            "top: 50%;" +
            "display: inline-block;" +
            "padding: 6px;" +
            "width: 60px;" +
            "margin-top: 2px;;" +
            "margin-bottom: 5px;" +
            "vertical-align: middle;" +
            "font-weight: bold;" +
            "font-family: sans-serif;";
        var styleLike = btn.attr["style"] + "" +
            "background-color: #fff;" +
            "border-style: solid;" +
            "border-color: #3897f0;" +
            "border-radius: 5px;" +
            "color: #3897f0;";
        var styleLiked = btn.attr["style"] + "" +
            "background-color: #3897f0;" +
            "border-style: solid;" +
            "border-color: #3897f0;" +
            "border-radius: 5px;" +
            "color: #fff;";
        btn.attr["style"] = styleLike;

        btn.checkLiked = function () {
            var req = formatRequest({
                "methodName": "checkLikePhoto",
                "photo_id": photoID,
            });
            var callback = function (res) {
                var tar = JSON.parse(res.responseText);
                if (tar.liked == "true") {
                    btn.content = "Liked";
                    btn.attr["style"] = styleLiked;
                }
                else {
                    btn.content = "Like";
                    btn.attr["style"] = styleLike;
                }
                if(tar.total_likes == 1 && tar.liked == "true"){
                    likeLabel.content = "You and " + tar.total_likes + " other person like this"
                }
                else if(tar.total_likes > 1 && tar.liked == "true"){
                    likeLabel.content = "You and " + tar.total_likes + " other people like this"
                }
                else if(tar.liked == "true"){
                    likeLabel.content = "You liked this";
                }
                else if(tar.total_likes == 1){
                    likeLabel.content = tar.total_likes + " person likes this"
                }
                else if(tar.total_likes >= 1){
                    likeLabel.content = tar.total_likes + " people like this"
                }
                else{
                    likeLabel.content = "Be the first to like this";
                }
                root.render();
            }
            sendRequest("GET", req, callback);
        };
        btn.checkLiked();
        btn.attr['type'] = "button";

        return btn;
    })();

    var photo = (function() {
        var obj = Photo(url);
        obj.attr["style"] += "" +
            "display: flex;" +
            "align-items: center;" +
            "border-width: 0px; " +
            "border-style: solid;" +
            "max-width: 100%;" +
            "max-height: 100%;" +
            "padding: 0px;" +
            "margin: auto;" +
            "" +
            "";
        return obj;
    })();
    var photoContainer = (function () {
        var obj = component();
        obj.tag = "div";
        obj.attr["style"] += "" +
            "display: flex;" +
            "align-items: center;" +
            "width: 65%;" +
            "height: 520px;" +
            "padding: 0px;" +
            "float: left;" +
            "background-color: black;" +
            "padding-right: 3px;";
        obj.insert(photo);
        return obj;
    })();
    var photoInfo = (function () {
        var obj = component();
        obj.tag = "div";
        obj.attr["style"] += "" +
            "position: relative;" +
            "float: right;" +
            "width: 33%;" +
            "";
        var commentForm = (function () {
            var cmt = CommentForm(photoID);
            cmt.attr["style"] += "" +
                "position: absolute;" +
                "left: -5.2%;" +
                "width: 106.6%;" +
                "padding-bottom: 10px;" +
                "";
            return cmt;
        })();
        var AVBox = AvatarBox(userID, "48px", "48px");
        AVBox.nameBox.attr["style"] += "" +
            "font-size: 14px;" +
            "" +
            "";
        obj.insert(AVBox);
        obj.insert(photoDetails);
        obj.insert(likeLabel);
        obj.insert(likeButton);
        if(user.id == userID) {
            obj.insert(deleteButton);
            obj.insert(editButton);
        }
        obj.insert(CommentStream(photoID));
        obj.insert(commentForm);
        //obj.setDisplay(false);
        return obj;
    })();
    obj.attr['style'] += "" +
        "" +
        "width: 90%;" +
        "max-width: 1000px;" +
        "height: 520px;" +
        "margin: auto;" +
        "top: 15%;;" +
        "left: 0;" +
        "right: 0;" +
        "";
    obj.insert(photoContainer);
    obj.insert(photoInfo);
    return obj;
}

var getElem = function (x) {
    return document.getElementById(x);
}

var PhotoBox = function (_avatar, _name, _photo, _photoID, _userID) {
    var obj = component();
    obj.tag = "div";
    var photo = _photo;
    var name = _name;
    var avatar = _avatar;
    var photoID = _photoID;
    var userID = _userID;
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
    var clickText = 'root.insert(PhotoFrameFloatSingleton("' + photo.attr["src"] + '","' + photoID + '","' + userID + '"));root.render();';
    photo.attr["onClick"] = clickText;
    return obj;
}

var Container = function (x) {
    var obj = component();
    obj.tag = "div";
    obj.content = x;
    return obj;
}

var PhotoUploadFormSingleton = function () {
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";

    var obj = FrameFloatSingleton();


    var upForm = (function(){
        var obj = UploadForm();
        obj.description = (function () {
            var obj = component();
            obj.tag = "textarea";
            obj.attr = {
                "type" : "input",
                "name" : "description",
                "style" : tempStyle + "" +
                "height: 170px;" +
                "padding: 8px;;" +
                "width: 500px;" +
                "border-radius: 5px;",
                "placeholder" : "Enter a photo description here..."
            };
            return obj;
        })();
        obj.formTitle = (function () {
            var obj = Label("Choose Photos to Upload...");
            obj.attr['style'] += "" +
                "display: block;" +
                "font-size: 16px;" +
                "margin-bottom: 10px;" +
                "";
            return obj;
        })();
        obj.labelDescription = (function () {
            var obj = Label("Description:");
            obj.attr["style"] += "" +
                "position: ;" +
                "display: block;" +
                "margin-top: 30px;" +
                "" +
                "margin-left: 0px;" +
                "margin-right: 50px;" +
                "left: -50px;" +
                "font-size: 18px;" +
                "";
            return obj;
        })();
        obj.attr["style"] += "" +
            "" +
            "padding-bottom: 25px;" +
            "";
        var tempStorage = obj.getAllChildren();
        obj.reset();
        obj.insert(obj.formTitle);
        obj.insertAll(tempStorage);
        obj.insert(obj.labelDescription);
        obj.insert(obj.description);
        return obj;
    })();
    obj.attr["style"] += "" +
        "padding: 15px;" +
        "top: 60%;" +
        "height: 300px;" +
        "border-width: 1px;" +
        "border-radius: 5px;" +
        "background-color: #FAFAFA;" +
        "color: #404040;   " +
        ""
    obj.insert(upForm);
    return obj;
};

var SearchForm = function (searchResultBox) {
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
    var obj = component();
    obj.tag = "form";
    obj.attr = {
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin: 0px auto;"
    };
    var searchTextValue = "";
    var searchText = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "id" : "SearchBox",
            "type" : "text",
            "placeholder" : "Enter Search query here...",
            "name" : "searchText",
            "value" : searchTextValue,
            "style" : tempStyle + "" +
                "display: inline;" +
                "width: 85%;" +
                "height: 40px;" +
                "border-top-left-radius: 10px;",
        };
        return obj;
    })();



    var searchButton = (function () {
        var btn = Button ("Search", function () {
            searchTextValue = document.getElementById("genId" + searchText.genId).value;
            var text = searchTextValue;
            var req = formatRequest({
                "methodName" : "searchProfile",
                "profile_name" : text,
            });
            var callback = function (res) {
                var tar = JSON.parse(res.responseText);
                searchResultBox.updateResult(tar.profile_list);
            };
            sendRequest("GET", req, callback);
        });
        btn.attr["type"] = "button";
        btn.attr["style"] +="" +
            "display: inline;" +
            "height: 40px;" +
            "width: 15%;" +
            "border-width: 0px;" +
            "background-color: #21AEFE;" +
            "color: #fff;" +
            "font-size: 16px;" +
            "font-weight: bold;" +
            "border-top-right-radius: 10px;" +
            ""
        return btn;
    })();
    obj.updateSearchTextValue = function () {
        searchText.attr["value"] = searchTextValue;
    };

    obj.attr["onSubmit"] = "return false;";
    obj.attr["onkeypress"] = 'if(event.keyCode == 13) triggerEvent("' + searchButton.eventID + '");'
    obj.addUpdate(obj.updateSearchTextValue);
    var searchBoxContainer = (function () {
        var obj = component();
        obj.tag = "div";
        obj.insert(searchText);
        obj.insert(searchButton);
        obj.attr["style"] += "" +
            "margin: 0 auto;" +
            "" +
            "";
        return obj;
    })();
    obj.insert(searchBoxContainer);

    return obj;
}

var SearchFormSingleton = function () {
    var obj = FrameFloatSingleton();
    var searchResultBox = (function () {
        var obj = component();
        obj.tag = "div";
        var resultLabel = (function () {
            var obj = Label("Results:");
            obj.attr["style"] += "" +
                "font-size: 24px;" +
                "font-family: sans-serif;" +
                "float: left;" +
                "width: 100%;" +
                "height: 35px;" +
                "";
            return obj;
        })();
        var emptyResultLabel = (function () {
            var obj = Label("No Results were Found...");
            obj.attr["style"] += "" +
                "margin: auto;" +
                "font-size: 14px;" +
                "";
            return obj;
        })();
        obj.updateResult = function (profileList) {
            var newList = profileList.map(function (profile) {
                var avatarBox = AvatarBox(profile.id, "64", "64");
                avatarBox.attr["style"] += "" +
                    "float: left;" +
                    "margin: 15px;";
                return avatarBox;
            });
            obj.reset();
            obj.insert(resultLabel);
            obj.insertAll(newList);
            if(newList.length == 0){
                obj.insert(emptyResultLabel);
            }
            root.update();
        };
        obj.insert(resultLabel);
        //obj.insert(emptyResultLabel);
        obj.attr["style"] += "" +
            "padding: 15px;" +
            "";
        return obj;
    })();
    obj.insert(SearchForm(searchResultBox));
    obj.insert(searchResultBox);
    obj.attr["style"] += "" +
        "width: 800px;" +
        "height: 500px;" +
        "top: 55%;" +
        "left: 0;" +
        "right: 0;" +
        "margin-left: auto;" +
        "margin-right: auto;" +
        "border-width: 2px;" +
        "border-color: #0E4061;" +
        "border-radius: 10px;" +
        "color: 404040;" +
        "background-color: #FAFAFA;" +
        "";
    return obj;
}


var PopOver = function () {
    var obj = component();
    obj.tag = "div";
    
    return obj;
}
