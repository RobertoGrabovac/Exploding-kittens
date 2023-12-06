<?php

require_once '../init.php';
require_once 'functions.php';

if(!isset($_GET["user_id"]))
    sendErrorAndExit('Not set $_GET["user_id"].');
if(!isset($_GET["game_id"]))
    sendErrorAndExit('Not set $_GET["game_id"].');
if(!isset($_GET["user_state"]))
    sendErrorAndExit('Not set $_GET["user_state"].');

$user_id = (int) $_GET["user_id"];
$game_id = (int) $_GET["game_id"];
$user_state = (int) $_GET["user_state"];

$game = $gamesService->getGameById($game_id);

$connectionsService->setConnectionState($user_id, $user_state);

//provjera jesu li svi ready 
$gamesService->updateTimestamp($game_id);


?>