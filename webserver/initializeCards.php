<?php
//ovu skriptu zove samo igrac ciji je order_of_play = 1, 

require_once '../init.php';
require_once 'functions.php';

if(!isset($_GET["game_id"]))
    sendErrorAndExit('Not set $_GET["game_id"].');
if(!isset($_GET["user_id"]))
    sendErrorAndExit('Not set $_GET["user_id"].');

$game_id = (int) $_GET["game_id"];
$user_id = (int) $_GET["user_id"];

$game = $gamesService->getGameById($game_id);

if($cardsService->isCardsInitialized($game_id)){
    sendGameJsonAndExit($game, $user_id);
}

$cardsService->initCards($game_id);

$players = $connectionsService->getConnectionsByGameId($game_id);
$numberOfPlayers = count($players);

//podijeli defuse karte
for($i = 0; $i < $numberOfPlayers; $i++){
    $cardsService->playerGiveCard($game_id, $i+5, $players[$i]->user_id);
    $cardsService->updateCardPositions($game_id, 0);
}

$cardsService->shuffle($game_id);

//podijeli po 4 karte svakom igracu
for($i = 0; $i < $numberOfPlayers; $i++){    
    for($cardsGiven = 0; $cardsGiven < 4; $cardsGiven++){
        $isCardDrawn = false;
        while ($isCardDrawn == false){
            if($cardsService->getTopDeckCard($game_id) > 4){
                $cardsService->playerGiveCard($game_id, $cardsService->getTopDeckCard($game_id), $players[$i]->user_id);
                $isCardDrawn = true;
            }
            else{
                $cardsService->shuffle($game_id);
            }
        }
    }
}

$gamesService->initializeCurrentPlayer($game_id, $user_id);

$gamesService->updateTimestamp($game_id);

sendGameJsonAndExit($game, $user_id);

?>