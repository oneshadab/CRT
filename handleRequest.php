<?php
    //print_r($_GET);
    if(isset($_GET['name'])){
        call_user_func($_GET['name']);

    }
    if(isset($_POST['name'])){
        call_user_func($_POST['name']);
    }
    function getPhotoAll(){
        $ar = array();
        $ar[] = "groove.jpg";
        $ar[] = "random.jpg";
        $ar[] = "upFile.jpg";
        
        echo(json_encode($ar) );
    }

    function uploadPhoto(){
        print_r($_FILES);
        $src = $_FILES["photo"]["tmp_name"];
        $target = "upFile.jpg";
        move_uploaded_file($src, $target);
    }
?>