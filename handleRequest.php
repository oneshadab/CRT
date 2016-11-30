<?php
    //print_r($_GET);

    call_user_func($_GET['name']);
    function getPhotoAll(){
        $ar = array();
        $ar[] = "groove.jpg";
        $ar[] = "random.jpg";

        echo(json_encode($ar) );
    }

?>