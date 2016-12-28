
var main = function(profileID, photoID){
    root = getRootNode();
    SBox = SessionBox();
    stream = PhotoStream();
    if(profileID == false) profileID = -1;
    stream.setProfileId(profileID);
    root.insert(Script("console.log(2);"));
    root.insert(SBox);
    root.insert(stream);
    root.render();
    SBox.checkLogin();
    stream.updateStream();
    if(photoID != false){
        //console.log(photoID);
        var ph = PhotoDetails(photoID);
        ph.updatePhotoDetails(function () {
            console.log(ph.tar);
            root.insert(PhotoFrameFloatSingleton(ph.tar.url, ph.tar.id, ph.tar.user_id));
            root.render();
        });
    }
};