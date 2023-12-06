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
$card_id = (int) $_GET["card_id"];  // 0 ako je draw card!!!

// Dodati provjere može li se potez odigrati

$gamesService = new GamesService();
$movesService = new MovesService();
$cardsService = new cardsService();

$currentPlayerId = $gamesService->getCurrentPlayerId($game_id);

// Nije NOPE ako je ovdje - običan potez
$moveNumber = $movesService->getMaxMoveNumber($game_id);

if ($card_id == 0) {
    $functionality = "draw";
} else if ($card_id == -1) {
    $functionality = "not-defuse";
} else {
    $functionality = $cardsService->getFunctionalityByCardId($card_id);
}
if ($currentPlayerId != $user_id) {
    if ($functionality != $cardsService->nope) {
        sendJSONAndExit("It's not your turn! Player " + $currentPlayerId + " is on the move.");
    }
}

$movesToPlay = $gamesService->getMovesToPlay($game_id);

switch($functionality) {
    case "not-defuse":

        $connectionsService->setConnectionState($user_id, 0);
        $gamesService->setCurrentPlayer($game_id, "next");
        $gamesService->updateTimestamp($game_id);

        break;
    case "draw":

        $topCard = $cardsService->getTopDeckCard($game_id);
        $cardsService->playerGiveCard($game_id, $topCard, $user_id);
        $hand = $cardsService->getPlayerCards($game_id, $user_id);

        //Zvone isprobava
        $gamesService->updateTimestamp($game_id);

         // ovo nece biti komentar kod mene - Roberto
        foreach ($hand as $card) {
            if ($cardsService->getFunctionalityByCardId($card) == $cardsService->exploding) {
                sendJSONandExit("exploding");
            }
        }  

        if ($movesToPlay == 1) {
            $gamesService->setCurrentPlayer($game_id, "next");
        } else {
            $gamesService->setMovesToPlay($game_id, $movesToPlay - 1);    
        }
        $gamesService->updateTimestamp($game_id);
        sendJSONandExit($topCard);
        break;
    case $cardsService->attack:
        $topCardOfDiscardPile = $cardsService->getTopDiscardPileCardId($game_id);//obrisati ako se desi bug

        $cardsService->setCardBelongsTo($game_id, $card_id, -1);
        $numOfDiscardedCards = $cardsService->userCardsNumber($game_id, -1); // broj karata u discard pile
        $cardsService->changeCardPosition($game_id, $card_id, $numOfDiscardedCards);

        $cardsService->updateCardPositions($game_id, $user_id);
        $gamesService->setCurrentPlayer($game_id, "next");

        //kaze Robi malo sumnjiva funkcija
        //$gamesService->setMovesToPlay($game_id, $movesToPlay + 1);
        if(($topCardOfDiscardPile != -1) && ($cardsService->getFunctionalityByCardId($topCardOfDiscardPile) == $cardsService->attack)){
            $gamesService->setMovesToPlay($game_id, $movesToPlay + 2);
        }
        else {
            $gamesService->setMovesToPlay($game_id, $movesToPlay + 1);
        }
        //$gamesService->setMovesToPlay($game_id, $movesToPlay + 1);
        //--------------------------------------------------------------
        $movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true)); //?
        $gamesService->updateTimestamp($game_id);

        break;
    case $cardsService->skip:

        $cardsService->setCardBelongsTo($game_id, $card_id, -1);
        $numOfDiscardedCards = $cardsService->userCardsNumber($game_id, -1); // broj karata u discard pile
        $cardsService->changeCardPosition($game_id, $card_id, $numOfDiscardedCards);

        $cardsService->updateCardPositions($game_id, $user_id);
        if ($movesToPlay == 1) {
            $gamesService->setCurrentPlayer($game_id, "next");
        } else {
            $gamesService->setMovesToPlay($game_id, $movesToPlay - 1);    
        }
        $movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true)); //?
        $gamesService->updateTimestamp($game_id);

        break;
    case $cardsService->future:

        $cardsService->setCardBelongsTo($game_id, $card_id, -1);
        $numOfDiscardedCards = $cardsService->userCardsNumber($game_id, -1); // broj karata u discard pile
        $cardsService->changeCardPosition($game_id, $card_id, $numOfDiscardedCards);

        $cardsService->updateCardPositions($game_id, $user_id);
        $top3cards = $cardsService->getTop3DeckCards($game_id);
        $movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true)); // ?
        $gamesService->updateTimestamp($game_id);
        sendJSONandExit($top3cards);

        break;
    case $cardsService->shuffle:

        $cardsService->setCardBelongsTo($game_id, $card_id, -1);
        $numOfDiscardedCards = $cardsService->userCardsNumber($game_id, -1); // broj karata u discard pile
        $cardsService->changeCardPosition($game_id, $card_id, $numOfDiscardedCards);

        $cardsService->updateCardPositions($game_id, $user_id);
        $cardsService->shuffle($game_id);
        $movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true)); // ?
        $gamesService->updateTimestamp($game_id);

        break;
    case $cardsService->favor:

        if(!isset($_GET["second_user_id"]))
            sendErrorAndExit('Not set $_GET["second_user_id"].');
        $second = $_GET["second_user_id"];
        $second_hand = $cardsService->getPlayerCards($game_id, $second);
        shuffle($second_hand);
        $stolen = $second_hand[0];
        $cardsService->playerGiveCard($game_id, $stolen, $user_id);
        $cardsService->updateCardPositions($game_id, $second);
        $movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true));
        $gamesService->updateTimestamp($game_id);

        break;
    case $cardsService->nope:
        $cardsService->setCardBelongsTo($game_id, $card_id, -1);
        $numOfDiscardedCards = $cardsService->userCardsNumber($game_id, -1); // broj karata u discard pile
        $cardsService->changeCardPosition($game_id, $card_id, $numOfDiscardedCards);

        $cardsService->updateCardPositions($game_id, $user_id);
        $movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true)); // ?
        $gamesService->setCurrentPlayer($game_id, "previous");
        $gamesService->updateTimestamp($game_id);
        break;
    case $cardsService->defuse:    
    default:

        $cardsService->setCardBelongsTo($game_id, $card_id, -1);
        $numOfDiscardedCards = $cardsService->userCardsNumber($game_id, -1); // broj karata u discard pile
        $cardsService->changeCardPosition($game_id, $card_id, $numOfDiscardedCards);

        $cardsService->updateCardPositions($game_id, $user_id);
        $movesService->addNewMove(new Move($game_id, $user_id, $card_id, $moveNumber + 1, true)); // ?
        $gamesService->updateTimestamp($game_id);

        break;
}

sendJSONandExit("Odigrao si svoj potez!");

?>