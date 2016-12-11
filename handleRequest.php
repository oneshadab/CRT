<?php
    //print_r($_GET);
    session_start();
    if(isset($_GET['methodName'])){
        $funcName = $_GET['methodName'];
        if(function_exists($funcName)){
            call_user_func($funcName);
        }
        else{
            echo ("No function named \"" . $funcName . "\" was found");
        }
    }
    if(isset($_POST['methodName'])){
        $funcName = $_POST['methodName'];
        if(function_exists($funcName)){
            call_user_func($funcName);
        }
        else{
            echo ("No function named \"" . $funcName . "\" was found");
        }
    }
    function getPhotoAll(){
        $ar = [];
        if(isset($_SESSION['user_id'])){
            $db = get_db();
            $sql = sprintf("
                SELECT photo_id
                FROM photoOwner
                WHERE user_id=%s;
            ", $_SESSION['user_id']);
            $result = $db->query($sql);
            while($row = $result->fetch_assoc()){
                $ar[] = $row['photo_id'] . ".jpg";
            }
        }
        echo(json_encode($ar));
    }

    function uploadPhoto(){
        if(isset($_SESSION['user_id'])) {
            $src = $_FILES["photo"]["tmp_name"];
            if(getimagesize($src) === false) return;
            $db = get_db();
            $sql = sprintf("
              INSERT INTO PHOTOS()
              VALUES ();
            ");
            $result = $db->query($sql);
            $photo_id = $db->insert_id;

            $sql = sprintf("
                INSERT INTO photoOwner(user_id, photo_id)
                VALUES (%s, %s);
            ", $_SESSION['user_id'], $photo_id);
            $result = $db->query($sql);
            $target = $photo_id . ".jpg";
            move_uploaded_file($src, $target);
        }
    }

    function get_db(){
        $db = new mysqli("localhost", "CRT_USER", "1234", "CRT_DB");
        return $db;
    }

    function checkLogin()
    {
        $ar = array();
        $ar['logged_in'] = "no";
        $db = get_db();
        if (isset($_SESSION['user_id'])) {
            $db = get_db();
            $sql = sprintf("
                SELECT *
                FROM USERS
                WHERE id=%s
            ", $_SESSION['user_id']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            if(!empty($row)){
                $ar['logged_in'] = "yes";
                $ar['name'] = $row['name'];
            }
        }
        echo (json_encode($ar));
    }

    function loginUser(){
        if(isset($_POST['email']) && isset($_POST['password'])){
            $db = get_db();
            $sql = sprintf("
                SELECT id
                FROM USERS
                WHERE email='%s' AND pass='%s'
            ", $_POST['email'], $_POST['password']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            if(!empty($row)){
                $_SESSION['user_id'] = $row['id'];
            }
        }
        checkLogin();
    }

    function logoutUser(){
        if(isset($_SESSION['user_id'])){
            unset($_SESSION['user_id']);
        }
        checkLogin();
    }

    function registerUser(){
        if(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['password'])){
            $db = get_db();
            $sql = sprintf("
                SELECT * 
                FROM USERS
                WHERE email='%s';
            ", $_POST['email']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            if(empty($row)){
                $sql = sprintf("
                    INSERT INTO USERS(name, email, pass)
                    VALUES ('%s', '%s', '%s');
                ", $_POST['name'], $_POST['email'], $_POST['password']);
                $result = $db->query($sql);
                $_SESSION['user_id'] = $db->insert_id;
            }
            else{
                echo("email already exists!");
            }
        }
        checkLogin();
    }
?>