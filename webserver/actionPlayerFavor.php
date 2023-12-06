<?php

require_once '../init.php';
require_once 'functions.php';

if(!isset($_GET["user_id"]))
    sendErrorAndExit('Not set $_GET["user_id"].');
if(!isset($_GET["game_id"]))
    sendErrorAndExit('Not set $_GET["game_id"].');
if(!isset($_GET["card_id"]))
    sendErrorAndExit('Not set $_GET["card_id"].');

$user_id = (int) $_GET["user_id"];
$game_id = (int) $_GET["game_id"];
$card_id = (int) $_GET["card_id"]; 

// Dodati provjere može li se potez odigrati

$gamesService = new GamesService();
$movesService = new MovesService();
$cardsService = new cardsService();

// sljedece tri linije vrlo vjerojatno ni ne trebaju
$currentPlayerId = $gamesService->getCurrentPlayerId($game_id);
if ($currentPlayerId != $user_id) 
    sendJSONAndExit("It's not your turn! Player " + $currentPlayerId + " is on the move.");

$moveNumber = $movesService->getMaxMoveNumber($game_id);
$movesToPlay = $gamesService->getMovesToPlay($game_id);

if(!isset($_GET["second_user_id"]))
        sendErrorAndExit('Not set $_GET["second_user_id"].');

$second = (int) $_GET["second_user_id"];
$second_hand = $cardsService->getPlayerCards($game_id, $second);

// moze biti situacija da igrač kojem uzimamo karte nema karata
shuffle($second_hand);
$stolen = $second_hand[0];

$cardsService->setCardBelongsTo($game_id, $card_id, -1);
$numOfDiscardedCards = $cardsService->userCardsNumber($game_id, -1); // broj karata u discard pile
$cardsService->changeCardPosition($game_id, $card_id, $numOfDiscardedCards);

$cardsService->playerGiveCard($game_id, $stolen, $user_id);
$cardsService->updateCardPositions($game_id, $second);
$movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true));
$gamesService->updateTimestamp($game_id);

sendJSONAndExit("Uspješno sam ukrao kartu!");

?>