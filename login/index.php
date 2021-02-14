<DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Interlix</title>
    <link rel="icon" href="assets/img/flavicon.png">
</head>
<body data-spy="scroll" data-target=".navbar-desktop">

<div class='preloader'><div class='loaded'>&nbsp;</div></div>

        <nav class="navbar navbar-fixed-top navbar-light bg-faded">
            <div class="container">
                <a href="#" data-activates="mobile-menu" class="button-collapse right"><i class="fa fa-bars black-text"></i></a>


                <div class="navbar-desktop">

                    <a class="navbar-brand" href="https://www.interlix.fr/"><img src="assets/img/logo.png" alt="" /></a>

                    <ul class="nav navbar-nav pull-right hidden-md-down text-uppercase">
                        <li class="nav-item">
                            <a class="nav-link" href="https://www.interlix.fr/">Home <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#Apropos">À propos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="store/">Boutique</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="project/home/home.html">Projet</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="https://support.interlix.fr">Support</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="login/index.php">Connexion</a>
                        </li>
                        <li class="nav-item">
                            <div class="dropdown">
                                <div id="cart">
                                    <div class="items-num">
                                        <a class="nav-link" target="_blank" href="store/bag.html"><span id="in-cart-items-num">0</span><i class="fa fa-shopping-basket fa-lg"></i></a>
                                    </div>
                                </div>
                                <ul id="cart-dropdown" hidden>
                                    <li id="empty-cart-msg"><a>Votre panier est vide</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>

                </div>

                <div class="navbar-mobile">

                    <ul class="side-nav" id="mobile-menu">
                        <li class="nav-item">
                            <a class="nav-link" href="https://www.interlix.fr/">Home <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#Apropos">À propos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="store/">Boutique</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="project/home/home.html">Projet</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="https://support.interlix.fr/">Support</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="login/index.php">Connexion</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#!"><i class="fa fa-shopping-basket fa-lg"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  <div id="drop-anim">
    <form method="post" class="login-form">
        <div class="textb">
            <input type="email" name="email" id="email" placeholder="insérer votre email" required>
        </div>
        <div class="textb">
            <input type="password" name="password" id="password" placeholder="Mot de passe" required>
             <div class="show-password fas fa-eye-slash"></div>
        </div>
        <div class="textb">
            <input type="password" name="cpassword" id="cpassword" placeholder="Confirmer le mot de passe" required>
        </div>
        <input type="submit" name="formsend" id="formsend" value="ok">
    </form>
    </div>

    <?php

        if(isset($_POST['formsend'])){
            
            extract($_POST);

            if(!empty($password) && !empty($cpassword) && !empty($email)){
                
                if($password == $cpassword){
                    
                    $options = [
                        'cost' => 12,
                    ];

                    $hashpass = password_hash("$password", PASSWORD_BCRYPT, $options);

                    include 'includes/database.php';
                    global $db;

                    $q = $db->prepare("INSERT INTO users(email,password) VALUES(:email,:password)");
                    $q->execute([
                        'email' -> $email,
                        'password' -> $hashpass
                    ]);
  
  
                }
  
            }

        }
    
    ?> 

  <script>
    var fields = document.querySelectorAll(".textb input");
    var btn = document.querySelector(".btn");
    function check(){
      if(fields[0].value != "" && fields[1].value != "")
        btn.disabled = false;
      else
        btn.disabled = true;  
    }

    fields[0].addEventListener("keyup",check);
    fields[1].addEventListener("keyup",check);

    document.querySelector(".show-password").addEventListener("click",function(){
      if(this.classList[2] == "fa-eye-slash"){
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
        fields[1].type = "text";
      }else{
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
        fields[1].type = "password";
      }
    });
  </script>
</body>
</html>