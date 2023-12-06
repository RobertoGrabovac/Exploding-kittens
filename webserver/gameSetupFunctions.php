<?php

require_once '../init.php';
require_once 'functions.php';

if(!isset($_GET["game_id"]))
    sendErrorAndExit('Not set $_GET["game_id"].');
if(!isset($_GET["user_id"]))
    sendErrorAndExit('Not set $_GET["user_id"].');

$game_id = (int) $_GET["game_id"];
$user_id = (int) $_GET["user_id"];

$game = $gamesService->getGameById($game_id);

if ($connectionsService->isOrderOfPlaySet($game_id) == false){
    $connectionsService->setOrderOfPlay($game_id);
    
}

sendGameJsonAndExit($game, $user_id);

?>