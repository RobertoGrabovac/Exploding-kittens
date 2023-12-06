<?php

class UsersService {
    function getUserByUsername($username) {
        $db = DB::getConnection();

        try
        {
            $st = $db->prepare( 'SELECT * FROM ek_users WHERE BINARY username=:username' );
            $st->execute( array( 'username' => $username ) );
        }
        catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }

        $row = $st->fetch();
        if ($row === false)
            return null;

        return new User($row['id'], $row['username'], $row['password_hash'], $row['email'], $row['registration_sequence'], $row['has_registered']);
    }

    //Zvone dodao
    function getUserByUserId($user_id) {
        $db = DB::getConnection();

        try
        {
            //$st = $db->prepare( 'SELECT * FROM ek_users WHERE BINARY username=:username' );
            $st = $db->prepare( 'SELECT * FROM proj_connections, ek_users WHERE id=user_id AND user_id=:user_id' );
            $st->execute( array( 'user_id' => $user_id ) );
        }
        catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }

        $row = $st->fetch();
        if ($row === false)
            return null;

        return new User($row['id'], $row['username'], $row['password_hash'], $row['email'], $row['registration_sequence'], $row['has_registered']);
    }

    function getUserByRegistration_sequence($registration_sequence) {
        $db = DB::getConnection();

        try
        {
            $st = $db->prepare( 'SELECT * FROM ek_users WHERE registration_sequence=:reg_seq' );
            $st->execute( array( 'reg_seq' => $registration_sequence ) );
        }
        catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }

        $row = $st->fetch();

        if ($row === false)
            return null;

        return new User($row['id'], $row['username'], $row['password_hash'], $row['email'], $row['registration_sequence'], $row['has_registered']);
    }

    function addUser($username, $password_hash, $email, $registration_sequence) {
        $db = DB::getConnection();
        try
        {
            $st = $db->prepare( 'INSERT INTO ek_users(username, password_hash, email, registration_sequence, has_registered) VALUES ' .
                                '(:username, :password, :email, :reg_seq, 0)' );
            
            $st->execute( array( 'username' => $username, 
                                'password' => $password_hash, 
                                'email' => $email, 
                                'reg_seq'  => $registration_sequence ) );
        }
	    catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }

    function verifyUser($registration_sequence) {
        $db = DB::getConnection();
        try
	    {
		$st = $db->prepare( 'UPDATE ek_users SET has_registered=1 WHERE registration_sequence=:reg_seq' );
		$st->execute( array( 'reg_seq' => $registration_sequence ) );
	    }
	    catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }

    // ---------------------------------------neiskoristene funkcije vezane za statistiku svakog igraca---------------------------------------
    
    // vraca poredak igraca (njihove username-ove i broj pobjeda) obzirom na broj pobjeda (sortirano silazno po broju pobjeda <-> prvi korisnik je najbolji)
    function getUsersOrderedByNumberOfWins() {
        $db = DB::getConnection();

        try
        {
            $st = $db->prepare( 'SELECT username, number_of_wins FROM ek_users ORDER BY number_of_wins DESC' );
            $st->execute();
            return $st->fetchAll();
        }
        catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }

    // vraca poredak igraca (njihove username-ove i broj odigranih partija) obzirom na broj odigranih partija (sortirano silazno po broju partija <-> prvi korisnik je najiskusniji igrač ili najveći fan)
    function getUsersOrderedByNumberOfGamesPlayed() {
        $db = DB::getConnection();

        try
        {
            $st = $db->prepare( 'SELECT username, games_played FROM ek_users ORDER BY games_played DESC' );
            $st->execute();
            return $st->fetchAll();
        }
        catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }

    // vraca statistiku igraca (njihove username-ove, broj pobjeda i broj odigranih partija) (sortirano silazno po broju pobjeda <-> prvi korisnik je najbolji (ne mora zapravo biti, možda je samo odigrao puno više partija od ostalih...))
    function getUsersStatistics() {
        $db = DB::getConnection();

        try
        {
            $st = $db->prepare( 'SELECT username, number_of_wins, games_played FROM ek_users ORDER BY number_of_wins DESC' );
            $st->execute();
            return $st->fetchAll();
        }
        catch( PDOException $e ) { exit( 'Database mistake: ' . $e->getMessage() ); }
    }
}

?>