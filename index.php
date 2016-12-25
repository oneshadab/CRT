<html>

<head>
    <script src="CRT.js" type="text/javascript"></script>
    <script src="script.js" type="text/javascript"></script>
    <style type="text/css">
        body{
            margin: 0px;
            background-color: #FAFAFA;
            font-family: sans-serif;
        }
        *{
            font-family: sans-serif;

        }
        *::-webkit-scrollbar {
            width: 6px;
        }

        *::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        }

        *::-webkit-scrollbar-thumb {
            background-color: darkgrey;
            outline: 1px solid slategrey;
        }
        body::-webkit-scrollbar {
            width: 12px;
        }
    </style>
</head>

<body onload="main()">
    <div id="root" style="background-color: inherit;">

    </div>
    <iframe name="skipFrame" style="display:none;" onload="SBox.checkLogin()"></iframe>

</body>

</html>