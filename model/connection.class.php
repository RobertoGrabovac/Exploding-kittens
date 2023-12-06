<?php

class Connection
{
	protected $user_id, $game_id, $state, $order_of_play;

	function __construct( $user_id, $game_id, $user_state, $order_of_play )
	{
		$this->user_id = $user_id;
		$this->game_id = $game_id;
		$this->user_state = $user_state;
		$this->order_of_play = $order_of_play;
	}

	function __get( $prop ) { return $this->$prop; }
	function __set( $prop, $val ) { $this->$prop = $val; return $this; }
}

?>
