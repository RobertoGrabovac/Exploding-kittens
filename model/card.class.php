<?php
    class Card
    {
        protected  $game_id, $card_id, $belongs_to, $position, $function;
    
        function __construct( $game_id, $card_id, $belongs_to, $position, $function )
        {
            $this->game_id = $game_id;
            $this->card_id = $card_id;
            $this->belongs_to = $belongs_to;
            $this->position = $position;
            $this->function = $function;
        }
    
        function __get( $prop ) { return $this->$prop; }
        function __set( $prop, $val ) { $this->$prop = $val; return $this; }
    }

?>