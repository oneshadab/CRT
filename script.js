

var main = function(){
    //getPage("index.php");
    stream = PhotoStream([]);
    root = getRootNode();
    root.insert(Paragraph("Hello World"));
    root.insert(stream);
    stream.updateStream();
    diag = UploadForm();
    console.log(diag.render());
    root.insert(diag);
    root.render();

};