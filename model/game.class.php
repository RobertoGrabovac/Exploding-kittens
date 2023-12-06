<?php

class Game
{
	protected $id, $code, $state, $lastModified, $current_player_id, $moves_to_play;
	
	public static $IN_LOBBY = 0;
	public static $IN_PROGRESS = 1;
	public static $FINISHED = 2;

	function __construct( $id, $code, $state, $lastModified, $current_player_id, $moves_to_play)
	{
		$this->id = $id;
		$this->code = $code;
		$this->state = $state;
		$this->lastModified = $lastModified;
		$this->current_player_id = $current_player_id;
		$this->moves_to_play = $moves_to_play;
		
	}

	function __get( $prop ) { return $this->$prop; }
	function __set( $prop, $val ) { $this->$prop = $val; return $this; }
}

?>
