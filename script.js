
var main = function(){
    root = getRootNode();
    SBox = SessionBox();
    stream = PhotoStream();
    root.insert(SBox);
    root.insert(UploadForm());
    root.insert(stream);
    root.render();
    SBox.checkLogin();
    stream.updateStream();
};