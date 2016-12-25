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
        $ar['photo_list'] = [];
        if(isset($_SESSION['user_id'])){
            $profile_id = $_SESSION['user_id'];
            if(isset($_GET['profile_id'])) $profile_id = $_GET['profile_id'];
            $db = get_db();
            $sql = sprintf("
                SELECT *
                FROM (photoowner JOIN users ON (photoowner.user_id = users.id))
                      JOIN photos ON (photoowner.photo_id = photos.id)
                WHERE user_id=%s
                ORDER BY photo_id DESC;
            ", $profile_id);
            if($profile_id == "-1"){
                $sql = sprintf("
                  SELECT *
                  FROM (photoowner JOIN users ON (photoowner.user_id = users.id))
                      JOIN photos ON (photoowner.photo_id = photos.id)
                  WHERE user_id in (
                      SELECT following_id
                      FROM follows
                      WHERE follower_id=%s
                  )
                  ORDER BY photo_id DESC;
                ", $_SESSION['user_id']);
            }
            $result = $db->query($sql);
            $list = [];
            while($row = $result->fetch_assoc()){
                $elem = [];
                $elem['id'] = $row['user_id'];
                $elem['avatar'] = $row['avatar'] . ".jpg";
                $elem['name'] = $row['name'];
                $elem['photo_id'] = $row['photo_id'];
                $elem['url'] = $row['photo_id'] . ".jpg";
                $elem['description'] = $row['description'];
                $elem['moment'] = $row['moment'];
                $list[] = $elem;
            }
            $ar['photo_list'] = $list;
        }
        echo(json_encode($ar));
    }

    function uploadPhoto(){
        if(isset($_SESSION['user_id'])) {
            $src = $_FILES["photo"]["tmp_name"];
            if(getimagesize($src) === false) return false;
            $db = get_db();
            $sql = sprintf("
              INSERT INTO PHOTOS(description)
              VALUES ('%s');
            ", $_POST['description']);
            $result = $db->query($sql);
            $photo_id = $db->insert_id;

            $sql = sprintf("
                INSERT 
                INTO photoOwner(user_id, photo_id)
                VALUES (%s, %s);
            ", $_SESSION['user_id'], $photo_id);
            $result = $db->query($sql);
            $target = $photo_id . ".jpg";
            move_uploaded_file($src, $target);
            return $photo_id;
        }
        return false;
    }

    function get_db(){
        $db = new mysqli("localhost", "CRT_USER", "1234", "CRT_DB");
        return $db;
    }

    function getAdminID(){
        return 0;
    }

    function getProfileInfo(){
        $ar = array();
        if(isset($_GET['profile_id'])){
            $db = get_db();
            $sql = sprintf("
                SELECT *
                FROM users
                WHERE id=%s;
            ", $_GET['profile_id']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            if($row){
                $ar['avatar'] = $row['avatar'] . ".jpg";
                $ar['id'] =  $row['id'];
                $ar['name'] = $row['name'];
            }
        }
        echo (json_encode($ar));
    }

    function getPhotoInfo(){
        $ar = array();
        if(isset($_GET['photo_id'])){
            $db = get_db();
            $sql = sprintf("
                SELECT *
                FROM photos
                WHERE id=%s
            ", $_GET['photo_id']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            $ar["id"] = $row["id"];
            $ar["description"] = $row["description"];
            $ar["moment"] = $row["moment"];
        }
       echo (json_encode($ar));
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
                $ar['id'] = $row['id'];
                $ar['name'] = $row['name'];
                $ar['email'] = $row['email'];
                $ar['pass'] = $row['pass'];
                $ar['avatar'] = $row['avatar'] . '.jpg';
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
                    INSERT 
                    INTO USERS(name, email, pass)
                    VALUES ('%s', '%s', '%s');
                ", $_POST['name'], $_POST['email'], $_POST['password']);
                $result = $db->query($sql);
                $_SESSION['user_id'] = $db->insert_id;
            }
            else{
                echo("email already registered!");
            }
        }
        checkLogin();
    }

    function alterUser(){
        if(isset($_SESSION['user_id'])){
            $db = get_db();
            $sql = sprintf("
                UPDATE users
                SET name='%s',email='%s',pass='%s'
                WHERE id=%d
            ", $_POST['name'], $_POST['email'], $_POST['password'], $_SESSION['user_id']);
            $result = $db->query($sql);
        }
    }

    function changeAvatar(){
        if(isset($_SESSION['user_id'])){
            $user_id = $_SESSION['user_id'];
            $_SESSION['user_id'] = getAdminID();
            $photo_id = uploadPhoto();
            $_SESSION['user_id'] = $user_id;
            if($photo_id == false) return false;
            $db = get_db();
            $sql = sprintf("
                UPDATE users
                SET avatar='%d'
                WHERE id=%d
            ", $photo_id, $_SESSION['user_id']);
            $result = $db->query($sql);
        }
    }

    function deletePhoto(){
        if(isset($_SESSION['user_id']) && isset($_GET['photo_id'])){
            $db = get_db();
            $sql = sprintf("
                SELECT * 
                FROM photoOwner
                WHERE photo_id=%s
            ", $_GET['photo_id']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            print_r($row);

            if($row && $row['user_id'] == $_SESSION['user_id']){
                $sql = sprintf("
                    DELETE
                    FROM comments
                    WHERE photo_id=%s
                ", $_GET['photo_id']);
                $result = $db->query($sql);
                $sql = sprintf("
                    DELETE 
                    FROM photoOwner
                    WHERE photo_id=%s
                ", $_GET['photo_id']);
                $result = $db->query($sql);
                $sql = sprintf("
                    DELETE 
                    FROM photos
                    WHERE id=%s
                ", $_GET['photo_id']);
                $result = $db->query($sql);
            }
        }
    }

    function checkFollowProfile(){
        $ret = FALSE;
        $ar = array();
        $ar["following"] = "false";
        if(isset($_SESSION['user_id']) && isset($_GET['profile_id'])){
            $db = get_db();
            $sql = sprintf("
                SELECT *
                FROM follows
                WHERE follower_id=%s AND following_id=%s;
            ", $_SESSION['user_id'], $_GET['profile_id']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            if($row){
                $ar["following"] = "true";
                $ret = TRUE;
            }
        }
        echo(json_encode($ar));
        return $ret;
    }

    function toggleFollowProfile(){
        if(isset($_SESSION['user_id']) && isset($_GET['profile_id'])){
            $following = checkFollowProfile();
            $db = get_db();
            if($following == TRUE){
                $sql = sprintf("
                    DELETE
                    FROM follows
                    WHERE follower_id=%s AND following_id=%s;
                ", $_SESSION['user_id'], $_GET['profile_id']);
                $result = $db->query($sql);
            }
            else if(isset($_SESSION['user_id'])){
               $sql = sprintf("
                    INSERT 
                    INTO follows(follower_id, following_id)
                    VALUES (%s, %s)
                ", $_SESSION['user_id'], $_GET['profile_id']);
                $result = $db->query($sql);
            }
        }
    }

    function checkLikePhoto(){
        $ret = FALSE;
        $ar = array();
        $ar["liked"] = "false";
        if(isset($_SESSION['user_id']) && isset($_GET['photo_id'])){
            $db = get_db();
            $sql = sprintf("
                    SELECT *
                    FROM likes
                    WHERE user_id=%s AND photo_id=%s;
                ", $_SESSION['user_id'], $_GET['photo_id']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            if($row){
                $ar["liked"] = "true";
                $ret = TRUE;
            }
            $sql = sprintf("
                SELECT COUNT(user_id) as cnt
                FROM likes
                WHERE user_id!=%s AND photo_id=%s;
            ", $_SESSION['user_id'], $_GET['photo_id']);
            $result = $db->query($sql);
            $row = $result->fetch_assoc();
            if($row){
                $ar['total_likes'] = $row['cnt'];
            }
        }
        echo(json_encode($ar));
        return $ret;
    }

    function toggleLikePhoto(){
        if(isset($_SESSION['user_id']) && isset($_GET['photo_id'])){
            $liked = checkLikePhoto();
            $db = get_db();
            if($liked == TRUE){
                $sql = sprintf("
                        DELETE
                        FROM likes
                        WHERE user_id=%s AND photo_id=%s;
                    ", $_SESSION['user_id'], $_GET['photo_id']);
                $result = $db->query($sql);
            }
            else if(isset($_SESSION['user_id'])){
                $sql = sprintf("
                        INSERT 
                        INTO likes(user_id, photo_id)
                        VALUES (%s, %s)
                    ", $_SESSION['user_id'], $_GET['photo_id']);
                $result = $db->query($sql);
            }
        }
    }

    

    function is_empty($str){
        return $str == "";
    }

    function addPhotoComment(){
        if(isset($_SESSION['user_id']) && isset($_POST['photo_id'])){
            if(isset($_POST['commentText']) && !is_empty($_POST['commentText'])) {
                $db = get_db();
                $sql = sprintf("
                    INSERT
                    INTO comments(user_id, photo_id, description)
                    VALUES (%s, %s, '%s')
                ", $_SESSION['user_id'], $_POST['photo_id'], $_POST['commentText'], "1234");
                $result = $db->query($sql);
            }
        }
    }

    function getPhotoCommentAll(){
        $ar = array();
        if(isset($_SESSION['user_id']) && isset($_GET['photo_id'])){
            $db = get_db();
            $sql = sprintf("
                SELECT *
                FROM comments JOIN users on (comments.user_id=users.id)
                WHERE photo_id=%s
                ORDER BY moment;  
            ", $_GET['photo_id']);
            $result = $db->query($sql);
            $list = array();
            while($row = $result->fetch_assoc()){
                $elem = array();
                $elem["description"] = $row["description"];
                $elem["user_id"] = $row['user_id'];
                $elem["moment"] = $row["moment"];
                $list[] = $elem;
            }
            $ar['commentList'] = $list;
        }
        echo (json_encode($ar));
    }


    function searchProfile(){
        $ar = array();
        if(isset($_GET['profile_name'])){
            $db = get_db();
            $sql = sprintf("
                SELECT * 
                FROM users
                WHERE name LIKE '%%%s%%' AND id!=0
                ORDER BY name
                LIMIT 9;
            ", $_GET['profile_name']);
            $result = $db->query($sql);
            $list = array();
            while($row = $result->fetch_assoc()){
                $elem = array();
                $elem["name"] = $row["name"];
                $elem["avatar"] = $row["avatar"] + ".jpg";
                $elem["id"] = $row["id"];
                $list[] = $elem;
            }
            $ar["profile_list"] = $list;
        }
        echo (json_encode($ar));
    }


?>