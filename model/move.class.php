<?php

class Move
{
	protected $game_id, $user_id, $card_id, $move_number, $finished;
	

	function __construct( $game_id, $user_id, $card_id, $move_number, $finished )
	{
        $this->game_id = $game_id;
        $this->user_id = $user_id;
        $this->card_id = $card_id;
        $this->move_number = $move_number;
        $this->finished = $finished;
	}

	function __get( $prop ) { return $this->$prop; }
	function __set( $prop, $val ) { $this->$prop = $val; return $this; }
}

?>