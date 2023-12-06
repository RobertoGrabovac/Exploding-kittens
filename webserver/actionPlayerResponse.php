<?php

require_once '../init.php';
require_once 'functions.php';

if(!isset($_GET["user_id"]))
    sendErrorAndExit('Not set $_GET["user_id"].');
if(!isset($_GET["game_id"]))
    sendErrorAndExit('Not set $_GET["game_id"].');
if(!isset($_GET["exploded"]))
    sendErrorAndExit('Not set $_GET["exploded"].');

$user_id = (int) $_GET["user_id"];
$game_id = (int) $_GET["game_id"];
$exploded = $_GET["exploded"]; 

//sendJSONandExit($exploded);

$gamesService = new GamesService();
$movesService = new MovesService();
$cardsService = new cardsService();

$moveNumber = $movesService->getMaxMoveNumber($game_id);
$movesToPlay = $gamesService->getMovesToPlay($game_id);

if ($exploded == "true") {
    $connectionsService->setConnectionState($user_id, 0);
    $gamesService->setCurrentPlayer($game_id, "next");
    $gamesService->setMovesToPlay($game_id, 1); 
    $gamesService->updateTimestamp($game_id);
    sendJSONandExit("Eksplodirao si!");
} else {
    if(!isset($_GET["put_bomb"]))
        sendErrorAndExit('Not set $_GET["put_bomb"].');
    if(!isset($_GET["card_id"]))
        sendErrorAndExit('Not set $_GET["card_id"].');
    
    $card_id = (int) $_GET["card_id"];
    $put_bomb = $_GET["put_bomb"];

    $hand = $cardsService->getPlayerCards($game_id, $user_id);

    //sendJSONandExit("PRIJE FOREACH");

    foreach ($hand as $card) {
        if ($cardsService->getFunctionalityByCardId($card) == $cardsService->exploding) {
            $cardsService->deckInsertCard($game_id, $card, $put_bomb);
            //sendJSONandExit("UNUTAR IF U FOREACH");
            break;
        }
        //sendJSONandExit("UNUTAR FOREACH I IZVAN IF-A");
    }

    //sendJSONandExit("IZVAN FOREACH");

    $cardsService->setCardBelongsTo($game_id, $card_id, -1);
    $numOfDiscardedCards = $cardsService->userCardsNumber($game_id, -1);
    $cardsService->changeCardPosition($game_id, $card_id, $numOfDiscardedCards);

    $cardsService->updateCardPositions($game_id, $user_id);
    if ($movesToPlay == 1) {
        $gamesService->setCurrentPlayer($game_id, "next");
    } else {
        $gamesService->setMovesToPlay($game_id, $movesToPlay - 1);    
    }
    $movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true));
    $gamesService->updateTimestamp($game_id);

    sendJSONandExit("Nisi eksplodirao!");
}


?>