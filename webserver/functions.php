<?php

$gamesService = new GamesService();
$connectionsService = new ConnectionsService();
$usersService = new UsersService();
$cardsService = new cardsService();
$movesService = new MovesService();

function sendJSONandExit( $message )
{
    // Kao izlaz skripte pošalji $message u JSON formatu i prekini izvođenje.
    header( 'Content-type:application/json;charset=utf-8' );
    echo json_encode( $message );
    flush();
    exit( 0 );
}

function sendErrorAndExit( $messageText )
{
	$message = [];
	$message[ 'error' ] = $messageText;
	sendJSONandExit( $message );
}

function sendGameJsonAndExit(Game $game, $user_id) {
    global $connectionsService, $usersService, $lastAccess, $movesService, $cardsService;
    // Vraća json sveukupan opis igre (i lobija i igre)
    // Vraća popis igrača i jesu li oni spremni na igru
    // Vraća popis odigranih poteza
    // Vraća popis karti u igri (u decku i u rukama drugih igrača)
    $connections = $connectionsService->getConnectionsByGameId($game->id);

    $users = array();
    $current_player = array();
    foreach ($connections as $user) {
        $player = array(
            "user_id" => $user->user_id,
            "game_id" => $user->game_id,
            "user_state" => $user->user_state,
            "order_of_play" => $user->order_of_play,
            "username" => ($usersService->getUserByUserId($user->user_id))->username
        );
        $users[] = $player;
        if ($user->user_id == $game->current_player_id) {
            $current_player = $player;
        }
    }

    //if nismo u gameu postavit cardsData na null
    if($connectionsService->isOrderOfPlaySet($game->id)){
        $cardData = getGameCards($game->id);
    } else {
        $cardData = null;
    }    

    $payload = array(
        "message" => "Game options for game ".$game->id.". Here you can also see list of users, ".
            "list of cards in the game and list of moves in the game",
        "game_id" => $game->id,
        "game_code" => $game->code,
        "game_state" => $game->state,
        "current_player_id" => $game->current_player_id,
        "current_player" => $current_player,
		"moves_to_play" => $game->moves_to_play,
        "lastModified" => strtotime($game->lastModified),
        "lastAccess" => $lastAccess,

        "users" => $users,
        "cards" => $cardData, // Cijela baza cards - ako je igrač izvukao bombu, imat će 
        // ju u ruci kao kartu - to provjeriti na frontendu i staviti animaciju za napraviti
        // defuse. Kada se defuse aktivira, updetat će to u bazi
        "moves" => getMoves($game->id),
        "lastMove" => $movesService->getMaxMoveNumber($game->id),
        // Zadnji odigran potez - dodati: s time frontend zna što se 
        // zadnje dogodilo i može napraviti ako je potrebno neke animacije (npr. ako je neki
        // drugi igrač nešto odigrao)
        // Može biti novi json objekt sa više informacija, a ne samo jedan string
    );
    sendJSONandExit($payload);
}

function getMoves($game_id) {
    global $movesService;
    $moves = $movesService->getMovesByGameIdSortedByMoveNumber($game_id);
    $data = array();
    foreach ($moves as $move) {
        $data[] = array(
            "game_id" => $move->game_id,
            "user_id" => $move->user_id,
            "card_id" => $move->card_id,
            "move_number" => $move->move_number,
            "finished" => $move->finished,
        );
    }
    return $data;
}

// by Roberto --> nisam testirao, tek kad budemo koristili
function getGameCards($game_id) {
    global $cardsService;
    $cards = $cardsService->getCurrentGameCardsStatus($game_id);
    $data = array();
    foreach ($cards as $card) {
        $data[] = array(
            "game_id" => $card->game_id,
            "card_id" => $card->card_id,
            "belongs_to" => $card->belongs_to,
            "position" => $card->position,
            "function" => $card->function
        );
    }
    return $data;
}

?>