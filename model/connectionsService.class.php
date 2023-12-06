<?php

class ConnectionsService
{
	function getConnectionByUserId( $user_id )
	{
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT user_id, game_id, user_state, order_of_play FROM proj_connections WHERE user_id=:user_id');
			$st->execute( array( 'user_id' => $user_id ) );
            
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.getConnectionByUserId ' . $e->getMessage() ); }
        
        $row = $st->fetch();
		if ($row === false)
            return null;
        return new Connection( $row['user_id'], $row['game_id'], $row['user_state'], $row['order_of_play'] );
	}

	function getConnectionsByGameId( $game_id )
	{
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT user_id, game_id, user_state, order_of_play FROM proj_connections WHERE game_id=:game_id');
			$st->execute( array( 'game_id' => $game_id ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.getConnectionsByGameId ' . $e->getMessage() ); }


		$arr = array();
		while( $row = $st->fetch() )
		{
			$arr[] = new Connection( $row['user_id'], $row['game_id'], $row['user_state'], $row['order_of_play'] );
		}

		return $arr;
	}

    function addConnection($user_id, $game_id) 
    {
        // Returns true if succesfull, false (or exception) otherwise
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'INSERT INTO proj_connections(game_id, user_id, user_state, order_of_play) VALUES (:game_id, :user_id, 0, 0)' );
            return $st->execute( array( 'game_id' => $game_id, 'user_id' => $user_id) );
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.addConnection ' . $e->getMessage() ); }	
    }

    function setConnectionState($user_id, $state) {
        /*
        * State označava je li korisnik spreman ili nije dok je u lobbiju
        * 0 = spreman, 1 = nije spreman
        * Dok je u igri, označava je li korisnik živ ili nije
        * 0 = mrtav, 1 = živ
        */
        //echo '<script>alert("Provjera radi li ovo")</script>';
        if (is_null($this->getConnectionByUserId($user_id)))
            exit("Database error: Cannot set user_state for user_id=".$user_id." because user is not connected");
        try
		{
            
			$db = DB::getConnection();
            $st = $db->prepare( 'UPDATE proj_connections SET user_state=:user_state WHERE user_id=:user_id' );
            $st->execute( array( 'user_id' => $user_id, 'user_state' => $state ));
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.getConnectionByUserId' . $e->getMessage() ); }	
    }

    // by Otrebor
    function setOrderOfPlay($game_id) { // nasumicno odabire redoslijed igraca neke igre
        $playersArray = $this->getConnectionsByGameId($game_id);

        $shuffle_array = range(1, count($playersArray));
        shuffle($shuffle_array);

        $db = DB::getConnection();

        for ($i = 0; $i < count($playersArray); $i++) {
            try {
                $st = $db->prepare('UPDATE proj_connections SET order_of_play = :order_of_play WHERE user_id = :user_id AND game_id = :game_id');
            
                $st->execute(array(
                    'order_of_play' => $shuffle_array[$i],
                    'user_id' => $playersArray[$i]->user_id,
                    'game_id' => $game_id
                ));

            } catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
        }
            
    }

    // by Otrebor
    function getPlayerOrder($game_id, $user_id) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT order_of_play FROM proj_connections WHERE game_id=:game_id AND user_id = :user_id');
			$st->execute( array( 'game_id' => $game_id, 'user_id' => $user_id ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.getConnectionsByGameId ' . $e->getMessage() ); }

        $row = $st->fetch();

        return $row['order_of_play']; // pazi na slucaj ako je $row = null
    }

    // by Roberto --> vraca -1 ako je igra gotova, a inace id sljedeceg igraca na potezu
    // TODO: pazi na while(1), mozda je opasno, iako ne bi trebalo biti 
    function getPreviousPlayer($game_id, $current_player_id) {
        $current_player_order = (int) $this->getPlayerOrder($game_id, $current_player_id);

        $players = $this->getConnectionsByGameId($game_id);
        $number_of_players = count($players);

        $new_player_id = null;

        while (1) {
            $previous_order = ($current_player_order - 1 === 0) ? $number_of_players : $current_player_order - 1; // jel treba === ili ==

            try
            {
                $db = DB::getConnection();
                $st = $db->prepare( 'SELECT user_id FROM proj_connections WHERE game_id=:game_id AND order_of_play =:order_of_play');
                $st->execute( array( 'game_id' => $game_id, 'order_of_play' => $previous_order ) );
            }
            catch( PDOException $e ) { exit( 'PDO error - connectionService.getConnectionsByGameId ' . $e->getMessage() ); }

            $row = $st->fetch();

            $current_player_order = $previous_order;
            $new_player_id = $row['user_id'];

            if ($new_player_id == $current_player_id) // igra je zavrsena pa vracam -1 (inace se vraca user_id koji je >= 0)
                return -1;

            if ($this->getUserState($game_id, $new_player_id) == 1) 
                return $new_player_id;

        }

       
    }

    // by Roberto --> vraca -1 ako je igra gotova, a inace id sljedeceg igraca na potezu
    // TODO: pazi na while(1), mozda je opasno, iako ne bi trebalo biti 
    function getNextPlayer($game_id, $current_player_id) {
        $current_player_order = (int) $this->getPlayerOrder($game_id, $current_player_id);

        $players = $this->getConnectionsByGameId($game_id);
        $number_of_players = count($players);

        $new_player_id = null;
        while (1) {
            $next_order = ($current_player_order + 1 > $number_of_players) ? 1 : $current_player_order + 1; // jel treba === ili ==

            try
            {
                $db = DB::getConnection();
                $st = $db->prepare( 'SELECT user_id FROM proj_connections WHERE game_id=:game_id AND order_of_play =:order_of_play');
                $st->execute( array( 'game_id' => $game_id, 'order_of_play' => $next_order ) );
            }
            catch( PDOException $e ) { exit( 'PDO error - connectionService.getConnectionsByGameId ' . $e->getMessage() ); }

            $row = $st->fetch();

            $current_player_order = $next_order;
            $new_player_id = $row['user_id'];

            if ($new_player_id == $current_player_id) // igra je zavrsena pa vracam -1 (inace se vraca user_id koji je >= 0)
                return -1;

            if ($this->getUserState($game_id, $new_player_id) == 1) 
                return $new_player_id;
        }
        

        // pazi na slucaj ako je $row = null
    }

    function isOrderOfPlaySet($game_id) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT COUNT(*) FROM proj_connections WHERE game_id=:game_id AND order_of_play = 0');
			$st->execute( array( 'game_id' => $game_id ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.getConnectionsByGameId ' . $e->getMessage() ); }

        $number = (int) $st->fetch()[0];
        if ($number > 0)
            return false;

        return true;
    }

    function getUserState($game_id, $user_id) {
        try
		{
			$db = DB::getConnection();
            $st = $db->prepare( 'SELECT user_state FROM proj_connections WHERE game_id=:game_id AND user_id=:user_id');
			$st->execute( array( 'game_id' => $game_id, 'user_id' => $user_id ) );
        }
        catch( PDOException $e ) { exit( 'PDO error - connectionService.getConnectionsByGameId ' . $e->getMessage() ); }

        $row = $st->fetch();

        return $row['user_state'];
    }
 
};

?>

