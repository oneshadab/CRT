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
    return{
        DOMREF: null,
        parent: null,
        innerHTML: "",
        tag: "",
        attr: {"style": ""},
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


var FrameFloatSingleton = function () {
    var out = this;
    var removeFrame = function () {
        if(out.inner_obj != null){
            root.remove(inner_obj);
            root.render();
        }
    };
    addEventTrigger("FrameClose", removeFrame);
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
        obj.insert(obj.removeButton);
        obj.attr["style"] += "" +
            "border-radius: 2px;" +
            "border-style: solid;" +
            "";
        obj.attr["onMouseOver"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "block";';
        obj.attr["onMouseOut"] = 'this.getElementsByClassName("removeButton")[0].style["display"] = "none";';
        return out.inner_obj = obj;
    })();
};
FrameFloatSingleton.inner_obj = null; // Static Variables

var Photo = function(url){
    var obj = component();
    obj.tag = "img";
    obj.updatePhoto = function (_url) {
        obj.url = _url;
        obj.attr["src"] = obj.url;
    }
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
    obj.attr["height"] = photoHeight;
    obj.attr["width"] = photoWidth;
    obj.attr["style"] += "border-radius: 50%;"
    obj.updateAvatar = function () {
        var req = formatRequest({
            "methodName" : "getProfileInfo",
            "profile_id" : id,
        });
        var callback = function (res) {
            var profile = JSON.parse(res.responseText);
            obj.updatePhoto(profile.avatar);
            obj.attr["onClick"] = "stream.setProfileId(" + id + ");stream.updateStream();";
            root.render();
        }
        sendRequest("GET", req, callback);
    };
    obj.updateAvatar();

    obj.attr["onClick"] = "stream.setProfileId(" + id + ");stream.updateStream();";

    return obj;
};

var PhotoStream = function(photoHeight = "auto", photoWidth = "100%"){
    var obj = component();
    var sup = obj;
    obj.profileID = null;
    obj.tag = "div";
    obj.attr = { // Temporary styles
        "style" : "margin: 100 auto; width: 50%;"
    };
    obj.setProfileId = function (val) {
        obj.profileID = val;
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
                var photo = Photo(elem.url + "#" + new Date().getTime());
                photo.attr["height"] = photoHeight;
                photo.attr["width"] = photoWidth;
                var avatar = AvatarPhoto(elem.id);
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
                return PhotoBox(avatar, name, photo, elem.photo_id, elem);
            });
            //console.log(photoList);
            var streamTitle = component();
            if(obj.profileID == -1) {
                streamTitle = (function () {
                    var obj = component();
                    obj.tag = "div";
                    var head = Heading("Home");
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
                    btn.checkFollowing = function () {
                        var req = formatRequest({
                            "methodName": "checkFollowProfile",
                            "profile_id": profileID,
                        });
                        var callback = function (res) {
                            var tar = JSON.parse(res.responseText);
                            if (tar.following == "true") {
                                btn.content = "Following";
                            }
                            else {
                                btn.content = "Follow";
                            }
                            root.render();
                        }
                        sendRequest("GET", req, callback);
                    };
                    btn.checkFollowing();
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
                })(obj.profileID);
                streamTitle = (function (profileID) {
                    var obj = component();
                    obj.tag = "div";
                    var avatar = AvatarPhoto(profileID, "64px", "64px");
                    obj.attr["style"] += "margin: 0px auto;"
                    obj.insert(avatar);
                    obj.insert(followButton);
                    return obj;
                })(obj.profileID);
            };
            streamTitle.attr["style"] += "" +
                "margin: 0px auto; width: 50%;" +
                "";
            obj.reset();
            obj.insert(streamTitle);
            obj.insertAll(photoList);
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

var Paragraph = function(text){
    var obj = component();
    obj.tag = "p";
    obj.content = text;
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
    obj.diag = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "file",
            "name" : "photo",
            "style" : "float:right;"
        };
        return obj;
    })();
    obj.button = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type": "submit",
            "value": "Upload Photo",
            "name": "submit",
            "onclick" :'root.update();triggerEvent("FrameClose");',
            "style" : "float: right;"
        };
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
    obj.insert(obj.button);
    obj.insert(obj.diag);
    obj.insert(obj.tempName);
    return obj;

};

var redirect = function(newLocation){
    window.location = window.location + newLocation;
};


var Button = function(text, callback){
    Button.eventNumber += 1;
    var obj = component();
    obj.tag = "button";
    obj.content = text;
    obj.callback = callback;
    obj.eventID = "ButtonClick" + Button.eventNumber;
    addEventTrigger(obj.eventID, obj.callback);
    obj.attr = {"onClick" : 'triggerEvent("ButtonClick' + Button.eventNumber + '")', "style" : ""};
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
    return obj
};
Button.eventNumber = 0; //Static Variables

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
            "onclick" : 'SBox.checkLogin();',
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
    var registerButton = (function(){
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "submit",
            "value" : "Register",
            "name" : "registerButton",
            "onclick" : 'SBox.checkLogin();',
            "style" : tempStyle
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
    obj.insert(btn);
    return obj;
};

var LoginFloatBoxSingleton = function () {
    var obj = FrameFloatSingleton();
    addEventTrigger("LoginDone", obj.removeFrame);
    obj.attr["style"] += "height:  400px;";
    obj.attr["style"] += "margin-top: -250px;";
    obj.attr["style"] += "padding: 20px;";
    obj.attr["style"] += "padding: 20px;";
    obj.attr["style"] += "border-width: 2px; border-style: solid; border-radius: 10px; " +
        "border-color: 	#525252";
    obj.insert(Label("Login:"));
    obj.insert(LoginForm());
    obj.insert(Label("Register:"));
    obj.insert(RegisterForm());
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
            "onclick" : "",
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
    var obj = FrameFloatSingleton();
    obj.attr["style"] += "" +
        "height: 400px;" +
        "border-style: solid;" +
        "border-radius: 2px" +
        "";
    var avatarForm = UploadForm();
    avatarForm.children[2].attr["value"]="changeAvatar";
    avatarForm.attr["style"] += "margin-top: 50px;padding-bottom: 50px; margin-right: 80px;";
    obj.insert(avatarForm);
    obj.insert(SettingsForm());
    return obj;
}

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
        var obj = AvatarPhoto(user.id);
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

    var settingsButton = (function(){
        var func = function(){
            root.insert(SettingsBoxFloatSingleton());
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
        return obj;
    })();
    var searchButton = (function () {
        var btn = Button("Search", function () {
            root.insert(SearchFormSingleton());
            root.render();
        });
        btn.attr["type"] = "button";
        btn.attr["style"] += "" +
            "float: right;" +
            "";
        return btn;
    })();
    var homeButton = (function () {
        var btn = Button("Home", function () {
            stream.setProfileId(-1);
            stream.updateStream();
        });
        btn.attr["type"] = "button";
        btn.attr["style"] += "" +
            "float: right;" +
            "";
        return btn;
    })();
    obj.insert(profilePicture);
    obj.insert(profileName);

    obj.insert(temp);
    obj.insert(logoutButton);
    obj.insert(settingsButton);
    obj.insert(searchButton);
    obj.insert(homeButton);

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
                var uploadButton = Button("Upload Photo", function(){
                    root.insert(PhotoUploadFormSingleton());
                    root.render();
                });
                uploadButton.attr["style"] += "float: right;";
                obj.insert(userBox);
                obj.insert(uploadButton);

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

var CommentStream = function (photoID) {
    var obj = component();
    obj.tag = "div";
    obj.updateCommentStream = function () {
        var req = formatRequest({
            "methodName" : "getPhotoCommentAll",
            "photo_id" : photoID,
        });
        var callback = function (res) {
            var tar = JSON.parse(res.responseText);
            var commentList = tar.commentList.map(function (comment) {
                var obj = component();
                obj.tag = "div";
                obj.content = comment.description;
                return obj;
            });
            obj.reset();
            obj.insertAll(commentList);
            root.render();
        };
        sendRequest("GET", req, callback);
    };
    obj.addUpdate(obj.updateCommentStream);
    obj.updateCommentStream();
    return obj;
};

var CommentForm = function (photoID) {
    var tempStyle = "display: block; margin-bottom: 10px; " +
        "padding: 5px;" +
        "height: 30px;" +
        "border-style: solid;" +
        "border-width: 1px;" +
        "border-radius: 2px;" +
        "border-color: #dbdbdb;";
    var obj = component();
    obj.tag = "form";
    obj.attr ={
        "action" : "handleRequest.php",
        "method" : "POST",
        "enctype" : "multipart/form-data",
        "target" : "skipFrame",
        "style" : "margin: 0px auto; width: 50%",
    };
    var commentText = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "type" : "text",
            "placeholder" : "Write your comment here",
            "name" : "commentText",
            "style" : tempStyle
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
            "style" : tempStyle,
        }
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
    obj.updatePhotoDetails = function () {
        var req = formatRequest({
            "methodName" : "getPhotoInfo",
            "photo_id" : photoID,
        });
        var callback = function (res) {
            var tar = JSON.parse(res.responseText);
            obj.reset();
            obj.insert(Paragraph(tar.description));
            obj.insert(Paragraph(tar.moment));
            root.render();
        };
        sendRequest("GET", req, callback);
    };
    obj.addUpdate(obj.updatePhotoDetails);
    obj.updatePhotoDetails();
    return obj;
}


var PhotoFrameFloatSingleton = function (_url, _photoID) {
    var obj = FrameFloatSingleton();
    var url = _url;
    var photoID = _photoID;
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
        return btn;
    })();

    var photo = (function() {
        var obj = Photo(url);
        obj.attr["width"] = "500px";
        obj.attr["height"] = "auto";
        obj.attr["style"] += "" +
            "float: left;" +
            "border-width: 5px; " +
            "border-style: solid;";
        return obj;
    })();
    var photoInfo = (function () {
        var obj = component();
        obj.tag = "div";
        obj.insert(PhotoDetails(photoID));
        obj.insert(CommentStream(photoID));
        obj.insert(CommentForm(photoID));
        obj.attr["style"] += "" +
            "float: right;" +
            "width: 200px;" +
            "";
        return obj;
    })();
    obj.attr['style'] += "" +
        "width: 800px;" +
        "left: 40%;" +
        "top: 60%;" +
        "";
    obj.insert(photo);
    obj.insert(deleteButton);
    obj.insert(photoInfo);
    return obj;
}

var getElem = function (x) {
    return document.getElementById(x);
}

var PhotoBox = function (_avatar, _name, _photo, _photoID) {
    var obj = component();
    obj.tag = "div";
    var photo = _photo;
    var name = _name;
    var avatar = _avatar;
    var photoID = _photoID;
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
    var clickText = 'root.insert(PhotoFrameFloatSingleton("' + photo.attr["src"] + '","' + photoID + '"));root.render();';
    photo.attr["onClick"] = clickText;
    return obj;
}

var Container = function (x) {
    var obj = component();
    obj.tag = "div";
    obj.insert(x);
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
    obj.attr["style"] += "" +
        "padding: 15px;" +
        "";

    var upForm = (function(){
        var obj = UploadForm();
        obj.description = (function () {
            var obj = component();
            obj.tag = "input";
            obj.attr = {
                "type" : "input",
                "name" : "description",
                "style" : tempStyle,
            };
            return obj;
        })();
        obj.insert(obj.description);
        return obj;
    })();
    obj.insert(upForm);
    return obj;
};

var SearchForm = function () {
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
        "style" : "margin: 0px auto; width: 50%;"
    };
    var searchTextValue = "";
    var searchText = (function () {
        var obj = component();
        obj.tag = "input";
        obj.attr = {
            "id" : "SearchBox",
            "type" : "text",
            "placeholder" : "search",
            "name" : "searchText",
            "value" : searchTextValue,
            "style" : tempStyle,
        };
        return obj;
    })();


    var searchResult = (function () {
        var obj = component();
        obj.tag = "div";
        obj.updateResult = function (profileList) {
             var newList = profileList.map(function (profile) {
                 var avatar = AvatarPhoto(profile.id, "64", "64");
                 return avatar;
             });
            obj.reset();
            obj.insertAll(newList);
            root.update();
        };
        return obj;
    })();

    var searchButton = (function () {
        var btn = Button ("Search", function () {
            searchTextValue = document.getElementById("SearchBox").value;
            var text = searchTextValue;
            var req = formatRequest({
                "methodName" : "searchProfile",
                "profile_name" : text,
            });
            var callback = function (res) {
                var tar = JSON.parse(res.responseText);
                searchResult.updateResult(tar.profile_list);
            };
            sendRequest("GET", req, callback);
        });
        btn.attr["type"] = "button";
        return btn;
    })();
    obj.updateSearchTextValue = function () {
        searchText.attr["value"] = searchTextValue;
    };
    obj.attr["onSubmit"] = "return false;";
    obj.attr["onkeypress"] = 'if(event.keyCode == 13) triggerEvent("' + searchButton.eventID + '");'
    obj.addUpdate(obj.updateSearchTextValue);
    obj.insert(searchText);
    obj.insert(searchButton);
    obj.insert(searchResult);

    return obj;
}

var SearchFormSingleton = function () {
    var obj = FrameFloatSingleton();
    obj.insert(SearchForm());
    return obj;
}