<?php 

require_once "init.php";

session_start();

$lc = new LobbyController(new Registry());
$lr = new Login_RegisterController(new Registry());
$gc = new GameController(new Registry());

// ova dva if-a ispod su vezano uz register, odnosno login. Nisam to mogao slati preko get-a pa da sve bude lijepo u switchu jer podaci nisu zasticeni (vidljivi u url-u)
if (isset($_POST['newusername'])) {
	$lr->analyzeNew();
	exit();
}
else if (isset($_POST['username'])) {
	$lr->analyzeLogin();
	exit();
}

if (isset($_GET['seq'])) {
	$warningMSG = $lr->verification($_GET['seq']);
	$lr->loginForm($warningMSG);
	exit();
}

if (isset($_GET["rt"])) {
	$rt = $_GET["rt"];
} else {
	$rt = "login";
}

switch ($rt) {
	case "logout":
		$lr->logout();
		break;
	case "login":
		$title = "Login";
		$lr->loginForm();
		break;
	case "register":
		$title = "Register";
		$lr->newForm();
		break;
	case "menu":
		$lc -> menu();
		break;
	case "create":
		if ($lc->create()) {
			$lc->lobby();
		} else {
			$lc->menu();
		}
		break;
	case "join":
		if ($lc->join()) {
			$lc->lobby();
		} else {
			$lc->menu();
		}
		break;
	case "game":
		$gc->game();
		break; 
}

?>