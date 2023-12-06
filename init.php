<?php 

define( '__SITE_PATH', realpath( dirname( __FILE__ ) ) );
define( '__SITE_URL', dirname( $_SERVER['PHP_SELF'] ) );

require_once __SITE_PATH . '/app/database/' . 'db.class.php';
require_once __SITE_PATH . '/app/' . 'baseController.class.php';
require_once __SITE_PATH . '/app/' . 'registry.class.php';

require_once __SITE_PATH . '/model/' . 'user.class.php';
require_once __SITE_PATH . '/model/' . 'usersService.class.php';
require_once __SITE_PATH . '/model/' . 'game.class.php';
require_once __SITE_PATH . '/model/' . 'gamesService.class.php';
require_once __SITE_PATH . '/model/' . 'connection.class.php';
require_once __SITE_PATH . '/model/' . 'connectionsService.class.php';
require_once __SITE_PATH . '/model/' . 'card.class.php';
require_once __SITE_PATH . '/model/' . 'cardsService.class.php';
require_once __SITE_PATH . '/model/' . 'move.class.php';
require_once __SITE_PATH . '/model/' . 'movesService.class.php';

require_once __SITE_PATH . '/controllers/' . 'lobbyController.class.php';
require_once __SITE_PATH . '/controllers/' . 'login_registerController.class.php';
require_once __SITE_PATH . '/controllers/' . 'gameController.class.php';


?>