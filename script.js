
var main = function(){
    root = getRootNode();
    SBox = SessionBox();
    stream = PhotoStream();
    stream.setProfileId(1);
    root.insert(SBox);
    root.insert(stream);
    root.render();
    SBox.checkLogin();
    stream.updateStream();
};