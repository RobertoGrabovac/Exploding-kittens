<?php

class Login_RegisterController extends BaseController
{
    public function logout() {
        session_start();

        session_unset();
        session_destroy();
        header('Location: main.php'); //main.php ce biti "router"
    }

    public function loginForm($errorMSG = '') { //formaZaLogin --> loginForm
        $this->registry->vars['title'] = "";
        $this->show( 'loginForm' );
        if( $errorMSG !== '' ) {
            echo '
            <div id="error-message">
                <p>' . $errorMSG . '</p>
            </div>';
        }
    }

    public function newForm($errorMSG = '') { //formaZaNovog --> newForm
        $this->registry->vars['title'] = "";
        $this->show( 'newForm');
        if( $errorMSG !== '' ) {
            echo '
            <div id="error-message">
                <p>' . $errorMSG . '</p>
            </div>';
        }
    }

    public function analyzeLogin() { 
        if( !strlen( $_POST['username'] ) || !strlen( $_POST['password'] ) ) 
	    {
            $this->loginForm( 'Username and password required!' );
            exit();
	    }

        if( !preg_match( '/^[a-zA-Z]{3,50}$/', $_POST['username'] ) )
	    {
            $this->loginForm( 'Username is not in the correct form (3-50 letters).');
            exit();
	    }

        $usersServise = new UsersService();
        $user = $usersServise->getUserByUsername($_POST['username']);
        
        if ($user == null)
        {
            $this->loginForm( 'Username does not exist!' );
            exit();
        }
        else if( !password_verify( $_POST['password'], $user->password_hash) )
        {
            $this->loginForm( 'Password is incorrect.' );
            exit();
        }
        else if( $user->has_registered == '0' )
        {
            $this->loginForm( 'You cannot play Exploding Kittens because you have not verified your profile. Check your e-mail.' );
            exit();
        }
        else
        {
            $_SESSION['username'] = $_POST['username'];
            $_SESSION['user_id'] = $user->id;
            header('Location: main.php?rt=menu');
            exit();
        }
    }

    public function analyzeNew() { //analizirajNovi --> analyzeNew
        if (!strlen($_POST['newpassword']) || !strlen( $_POST['email']))
	    {
            $this->newForm('Username, password and valid e-mail required!');
            exit();
	    }
        if( !preg_match( '/^[A-Za-z]{3,50}$/', $_POST['newusername'] ) )
	    {
            $this->newForm( 'Username is not in the correct form (3-50 letters).' );
            exit();
	    }
	    else if( !filter_var( $_POST['email'], FILTER_VALIDATE_EMAIL) )
        {
            $this->newForm( 'E-mail address is invalid.' );
            exit();
        }
	    else 
        {
            $usersServise = new UsersService();
            $user = $usersServise->getUserByUsername($_POST['newusername']);
            
            if( !is_null($user) )
            {
                $this->newForm( 'This username is already taken. Try another.' );
                exit();
            }

            $reg_seq = '';
		    for( $i = 0; $i < 20; ++$i )
			    $reg_seq .= chr( rand(0, 25) + ord( 'a' ) );
            
            $usersServise->addUser($_POST['newusername'], password_hash( $_POST['newpassword'], PASSWORD_DEFAULT ), $_POST['email'], $reg_seq);
            
            //ovo ispod sluzi za slanje maila za verifikaciju. Mozemo i bez toga ako cemo zahtjevati da se korisnik ne treba verificirati
            $to = $_POST['email'];
		    $subject = 'Registration mail';
		    $message = 'Dear ' . $_POST['newusername'] . "!\nTo complete the registration, click on the following link: ";
		    $message .= 'http://' . $_SERVER['SERVER_NAME'] . htmlentities( dirname( $_SERVER['PHP_SELF'] ) ) . '/main.php?seq=' . $reg_seq . "\n";
		    $headers = 'From: rp2@studenti.math.hr' . "\r\n" .
		                'Reply-To: rp2@studenti.math.hr' . "\r\n" .
		                'X-Mailer: PHP/' . phpversion();

		    $isOK = mail($to, $subject, $message, $headers);

            if( !$isOK )
                exit( 'I cannot send e-mail!' );
            }
            
            $this->loginForm('You have successfully registered, but in order to play Exploding Kittens, you must verify yourself via the link provided in the e-mail!');
            //odkomentirati gornje, a zakomentirati donje ako cemo se odluciti na verifikaciju mailom
            //$this->loginForm('You have successfully registered. Enjoy the game!'); 
        }

        //ova funkcija je isto vezana samo za verifikaciju (ako cemo se odluciti na nju)
        public function verification($code) {
            $warningMSG = '';

            if(!preg_match( '/^[a-z]{20}$/', $code ) )
	            return "Created sequence is not in the valid form...";

            $usersService = new UsersService();
            $user = $usersService->getUserByRegistration_sequence($code);

            if ($user === null) 
                return 'This registration sequence is not associated with any user of this application!';

            $usersService->verifyUser($code);
        
            return 'Congratulations! You have successfully verified your user profile. Enjoy the game!';
        }
}

?>