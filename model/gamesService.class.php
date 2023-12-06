<?php

class GamesService
{
    function getGameByCode($game_code) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT id, code, game_state, lastModified, current_player_id, moves_to_play FROM proj_games WHERE code=:game_code');
			$st->execute( array( 'game_code' => $game_code ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.getGameByCode ' . $e->getMessage() ); }
        
        $row = $st->fetch();
		if ($row === false)
            return null;
        return new Game( $row['id'], $row['code'], $row['game_state'], $row['lastModified'], $row['current_player_id'], $row['moves_to_play'] );
    }

    function getGameById($game_id) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT id, code, game_state, lastModified, current_player_id, moves_to_play FROM proj_games WHERE id=:game_id');
			$st->execute( array( 'game_id' => $game_id ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.getGameById ' . $e->getMessage() ); }
        
        $row = $st->fetch();
		if ($row === false)
            return null;
        return new Game( $row['id'], $row['code'], $row['game_state'], $row['lastModified'], $row['current_player_id'], $row['moves_to_play'] );
    }

    function addGame($game_code) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'INSERT INTO proj_games(code, game_state, current_player_id, moves_to_play) 
                VALUES (:code, :game_state, :current_player_id, :moves_to_play)' );
            if (!$st->execute( array( 
                'code' => $game_code, 
                'game_state' => Game::$IN_LOBBY,
                'current_player_id' => 0, // 0 znači da nije postavljeno
                'moves_to_play' => 1,
                ) ))
                exit("Database error: cannot create game with game_code=".$game_code);
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.addGame ' . $e->getMessage() ); }
        return $this->getGameByCode($game_code);
    }

    function updateTimestamp($game_id) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( "UPDATE proj_games SET lastModified = CURRENT_TIMESTAMP WHERE id=:game_id" );
            if (!$st->execute( array( 'game_id' => $game_id) ))
                exit("Database error: cannot alter timestamp of game with id=".$game_id);
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.updateTimestamp ' . $e->getMessage() ); }
    }

    // nije testirano
    // treba u proj_games dodati stupac current_player_id - dodano :)
    function getCurrentPlayerId($game_id) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT current_player_id FROM proj_games WHERE id=:game_id');
			$st->execute( array( 'game_id' => $game_id ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.getGameById ' . $e->getMessage() ); }
        
        $row = $st->fetch();
		if ($row === false)
            return null;
        return $row['current_player_id'];
    }

    // treba u proj_games dodati stupac moves_to_play - dodano :)
    function getMovesToPlay($game_id) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT moves_to_play FROM proj_games WHERE id=:game_id');
			$st->execute( array( 'game_id' => $game_id ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.getGameById ' . $e->getMessage() ); }
        
        $row = $st->fetch();
		if ($row === false)
            return null;
        return $row['moves_to_play'];
    }

    function setMovesToPlay($game_id, $movesToPlay) {
        try
        {
            $db = DB::getConnection();
            $st = $db->prepare( "UPDATE proj_games SET moves_to_play = :moves_to_play WHERE id=:game_id" );
            if (!$st->execute( array( 'game_id' => $game_id, 'moves_to_play' => $movesToPlay) ))
                exit("Database error: cannot change current player of game with id=".$game_id);
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.updateTimestamp ' . $e->getMessage() ); }
    }

    // pitat Gorana jel valja ovo i jel se treba updateat timestamp
    // Goran: timestamp se updejta u drugoj funkciji, a tako bi se trebao i pozivati
    function setCurrentPlayer($game_id, $which_one) {
        // TODO: Ako neko umre ponavljaj ovu funkciju
        // Ako je jedini igrač, igra je završena!
        $current_player_id = $this->getCurrentPlayerId($game_id);

        $connectionsService = new ConnectionsService();

        $new_currentPlayer_id = null;
        switch($which_one) {
            case "previous":
                $new_currentPlayer_id = $connectionsService->getPreviousPlayer($game_id, $current_player_id);
                break;
            case "next":
                $new_currentPlayer_id = $connectionsService->getNextPlayer($game_id, $current_player_id);
                break;
        }

        if ($new_currentPlayer_id == null)
            return;

        try
        {
            $db = DB::getConnection();
            $st = $db->prepare( "UPDATE proj_games SET current_player_id = :new_currentPlayer_id, moves_to_play = 1 WHERE id=:game_id" );
            if (!$st->execute( array( 'game_id' => $game_id, 'new_currentPlayer_id' => $new_currentPlayer_id) ))
                exit("Database error: cannot change current player of game with id=".$game_id);
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.updateTimestamp ' . $e->getMessage() ); }

    }

    function initializeCurrentPlayer($game_id, $user_id) {
        try
        {
            $db = DB::getConnection();
            $st = $db->prepare( "UPDATE proj_games SET current_player_id = :firstPlayer_id, moves_to_play = 1 WHERE id=:game_id" );
            if (!$st->execute( array( 'game_id' => $game_id, 'firstPlayer_id' => $user_id) ))
                exit("Database error: cannot change current player of game with id=".$game_id);
        }
        catch( PDOException $e ) { exit( 'PDO error - GameService.updateTimestamp ' . $e->getMessage() ); }
    }
    
};

?>

