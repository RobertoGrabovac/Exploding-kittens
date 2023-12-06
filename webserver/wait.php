<?php

require_once '../init.php';
require_once 'functions.php';

if(!isset($_GET['lastAccess']))
    sendErrorAndExit('Not set $_GET["lastAccess"].');
if(!isset($_GET["user_id"]))
    sendErrorAndExit('Not set $_GET["user_id"].');
if(!isset($_GET["game_id"]))
    sendErrorAndExit('Not set $_GET["game_id"].');


$lastAccess = (int) $_GET["lastAccess"];
$user_id = (int) $_GET["user_id"];
$game_id = (int) $_GET["game_id"];

while( 1 )
{
    // Provjeri najkasnije vrijeme zadnje promjene
    $game = $gamesService->getGameById($game_id);

    if (is_null($game))
        sendErrorAndExit("Game with id ".$game_id." not found");

    if( strtotime($game->lastModified) > $lastAccess )
    {
        sendGameJsonAndExit($game, $user_id);
    }
    
    usleep( 300000 );
}
?>