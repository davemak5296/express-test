<?php
    require_once('conn.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>留言板</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="warning"><strong>注意！本站為練習用網站，因教學用途刻意忽略資安的實作，註冊時請勿使用任何真實的帳號或密碼。</strong></header>
    <main class="board">
        <a class="board__btn" href="index.php">回留言板</a>
        <a class="board__btn" href="register.php">註冊</a>
        <?php
            if (isset($_GET['errCode'])) {
                $code = $_GET['errCode'];
                $msg = 'Error';
                if ($code === '1') {
                    $msg = '資料不齊全';
                } else if ($code === '2') {
                    $msg = '帳號未註冊';
                } else if ($code === '3') {
                    $msg = '密碼錯誤';
                }
                echo '<h3 class="error">' . $msg . '</h3>';
            }
        ?>
        <h1 class="board__title">登入</h1>
        <form class="board__form" action="handle_login.php" method="POST">
            <div class="board__nickname">
                <span>帳號:</span>
                <input type="text" name="username">
            </div>
            <div class="board__nickname">
                <span>密碼:</span>
                <input type="password" name="password">
            </div>
            <input class="board__submit" type="submit" value="提交">
        </form>
    </main>
</body>
</html>