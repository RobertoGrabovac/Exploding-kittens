<?php

require_once 'db.class.php';

$db = DB::getConnection();

/* 

Sprjecava se kreiranje tablica koje vec postoje koristenjem globalne varijable $has_table_nesto gdje je nesto ime 
tablice koju se zeli kreirati. Nakon modifikacije, potrebno je pokrenuti skriptu te ce navedena tablica biti kreirana
ako je sve proslo u redu. Inace se ispisuje poruka o gresci.

Za detalje o tablicama pogledati README.md u ovom direktoriju

*/

$has_table_ek_users = false;
$has_table_ek_games = false;
$has_table_ek_connections = false;
$has_table_ek_functionality = false;
$has_table_ek_cards = false;
$has_table_ek_moves = false;


try
{
	$st = $db->prepare( 
		'SHOW TABLES LIKE :tblname'
	);

	$st->execute( array( 'tblname' => 'ek_users' ) );
	if( $st->rowCount() > 0 )
        $has_table_ek_users = true;
	
	$st->execute( array( 'tblname' => 'proj_games' ) );
	if( $st->rowCount() > 0 )
		$has_table_ek_games = true;

	$st->execute( array( 'tblname' => 'proj_connections' ) );
	if( $st->rowCount() > 0 )
		$has_table_ek_connections = true;

	$st->execute( array( 'tblname' => 'proj_functionality' ) );
		if( $st->rowCount() > 0 )
			$has_table_ek_functionality = true;

	$st->execute( array( 'tblname' => 'proj_cards' ) );
	if( $st->rowCount() > 0 )
		$has_table_ek_cards = true;

	$st->execute( array( 'tblname' => 'proj_moves' ) );
		if( $st->rowCount() > 0 )
			$has_table_ek_moves = true;

}
catch( PDOException $e ) { exit( "PDO error [show tables]: " . $e->getMessage() ); }


if( $has_table_ek_users )
{
	echo 'The table ek_users already exists! Delete it and try again.';
} else {
    try
    {
        $st = $db->prepare( 
            'CREATE TABLE IF NOT EXISTS ek_users (' .
            'id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
            'username varchar(50) NOT NULL,' .
            'password_hash varchar(255) NOT NULL,'.
            'email varchar(50) NOT NULL,' .
            'registration_sequence varchar(20) NOT NULL,' .
            'has_registered int)'
        );

        $st->execute();
    }
    catch( PDOException $e ) { exit( "PDO error [create dz2_users]: " . $e->getMessage() ); }

    echo "Table ek_users is created.<br />";
}

if( $has_table_ek_games )
{
	echo 'The table proj_games already exists! Delete it and try again.';
} else {
	try
	{
		$st = $db->prepare( 
			'CREATE TABLE IF NOT EXISTS proj_games (' .
			'id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
			'code varchar(6) NOT NULL,' .
			'game_state int NOT NULL,'.
			'current_player_id int NOT NULL,'. // default postaviti u gamesService.addGame()
			'moves_to_play int NOT NULL,'.	// default postaviti u gamesService.addGame()
			'lastModified datetime DEFAULT CURRENT_TIMESTAMP,'.
			'UNIQUE (code))'
		);
		$st->execute();
	}
	catch( PDOException $e ) { exit( "PDO error [create proj_games]: " . $e->getMessage() ); }

	echo "Created table proj_games.<br />";
}

if( $has_table_ek_connections )
{
	echo 'The table proj_connections already exists! Delete it and try again.';
} else {
	try
	{
		$st = $db->prepare( 
			'CREATE TABLE IF NOT EXISTS proj_connections (' .
			'user_id int NOT NULL,' .
			'game_id int NOT NULL,' .
			'user_state int NOT NULL,' .
			'order_of_play int NOT NULL, '.
			'PRIMARY KEY(user_id, game_id))'
		);

		$st->execute();
	}
	catch( PDOException $e ) { exit( "PDO error [create proj_connections]: " . $e->getMessage() ); }

	echo "Created table proj_connections.<br />";
}

if( $has_table_ek_functionality )
{
	echo 'The table proj_functionality already exists! Delete it and try again.';
} else {
	try
	{
		$st = $db->prepare( 
			'CREATE TABLE IF NOT EXISTS proj_functionality (' .
			'card_id int NOT NULL PRIMARY KEY,' .
			'function varchar(50) NOT NULL)'
		);

		$st->execute();
	}
	catch( PDOException $e ) { exit( "PDO error [create proj_functionality]: " . $e->getMessage() ); }

	echo "Created table proj_functionality.<br />";
}

if( $has_table_ek_cards )
{
	echo 'The table proj_functionality already exists! Delete it and try again.';
} else {
	try
	{
		$st = $db->prepare( 
			'CREATE TABLE IF NOT EXISTS proj_cards (' .
			'game_id int NOT NULL,' .
			'card_id int NOT NULL,' .
			'belongs_to int NOT NULL,' .
			'position int NOT NULL,' .
			'PRIMARY KEY (game_id, card_id))'
		);
		
		$st->execute();
	}
	catch( PDOException $e ) { exit( "PDO error [create proj_cards]: " . $e->getMessage() ); }

	echo "Created table proj_cards.<br />";
}

if( $has_table_ek_moves )
{
	echo 'The table proj_functionality already exists! Delete it and try again.';
} else {
	try
	{
		$st = $db->prepare( 
			'CREATE TABLE IF NOT EXISTS proj_moves (' .
			'game_id int NOT NULL,' .
			'user_id int NOT NULL,'.
			'card_id int NOT NULL,' .
			'move_number int NOT NULL,' .
			'finished bool,' .
			'PRIMARY KEY (game_id, user_id, card_id))'
		);
		
		$st->execute();
	}
	catch( PDOException $e ) { exit( "PDO error [create proj_moves]: " . $e->getMessage() ); }

	echo "Created table proj_moves.<br />";
}

?> 