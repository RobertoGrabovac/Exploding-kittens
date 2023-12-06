<?php

class MovesService
{
    function addNewMove($move) {
        try
        {
            $db = DB::getConnection();
            $st = $db->prepare( 'INSERT INTO proj_moves(game_id, user_id, card_id, move_number, finished) VALUES ' .
                            '(:game_id, :user_id, :card_id, :move_number, :finished);');
        
            $st->execute(array( 
                'game_id' => $move->game_id, 
                'user_id' => $move->user_id, 
                'card_id' => $move->card_id, 
                'move_number' => $move->move_number, 
                'finished' => $move->finished, 
            ));
        }
        catch( PDOException $e ) { exit( 'Database mistake movesService.addNewMove(): ' . $e->getMessage() ); }        
    }

    function getMaxMoveNumber($game_id) {
        // Vraća int kao najveći potez
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT MIN(move_number) FROM proj_moves WHERE game_id=:game_id;');
			$st->execute( array( 'game_id' => $game_id ) );

            $row = $st->fetch();
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.getMaxMoveNumber() ' . $e->getMessage() ); }

        if ($row) {
            return $row[0];
        } 
        return null;
    }

    function setFinished($move) {
        try
        {
            $db = DB::getConnection();
            $st = $db->prepare( 'UPDATE proj_moves SET finished=:finished WHERE 
                user_id=:user_id AND game_id=:game_id AND move_number=:move_number AND card_id=:card_id;');
        
            $st->execute(array( 
                'game_id' => $move->game_id, 
                'user_id' => $move->user_id, 
                'card_id' => $move->card_id, 
                'move_number' => $move->move_number, 
                'finished' => $move->finished, 
            ));
        }
        catch( PDOException $e ) { exit( 'Database mistake movesService.setFinished(): ' . $e->getMessage() ); }  
    }

    function getMovesByGameIdSortedByMoveNumber($game_id) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT * FROM proj_moves WHERE game_id=:game_id ORDER BY move_number ASC;');
			$st->execute( array( 'game_id' => $game_id ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.getMovesByGameIdSortedByMoveNumber() ' . $e->getMessage() ); }

		$arr = array();
		while( $row = $st->fetch() )
		{
			$arr[] = new Move( $row['game_id'], $row['user_id'], $row['card_id'], $row['move_number'], $row['finished'] );
		}

		return $arr;
    }
};

?>

