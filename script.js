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
      attr: [],
      children: [],
      content: "",
      render: function(){
          var ret = "";
          ret += "<" + this.tag;
          for(i in this.attr){
              ret += " " + this.attr[i].key + "=" + this.attr[i].val;
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
    obj.attr.push({key: "src", val: url});
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
            var photoList = photoURLList.map((url) => Photo(url));
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

var FileUpload = function(){

};

var main = function(){
    //getPage("index.php");
    stream = PhotoStream([]);
    root = getRootNode();
    root.insert(Paragraph("Hello World"));
    root.insert(stream);
    root.render();
    stream.updateStream();
};