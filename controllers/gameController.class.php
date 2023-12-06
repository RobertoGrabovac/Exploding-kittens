<?php 

class GameController extends BaseController
{
	public function game()
	{
		if (!isset($_SESSION["code"]))
			exit('Game code not set: $_SESSION[code]');
		if (!isset($_SESSION["user_id"]))
			exit('User id not set: $_SESSION[user_id]');

		/*
		* Prilikom pokretanja igre postaviti $_SESSION[lobby] = false
		* Prilikom izlaska iz lobbija također
		*/
		$_SESSION["lobby"] = false;
		$gamesService = new GamesService();
		$game_code = $_SESSION["code"];
		$user_id = $_SESSION["user_id"];
		$game = $gamesService->getGameByCode($game_code);

		if (is_null($game))
			exit("Error, game with code ".$game_code." not found");

		$this->registry->user_id = $user_id;		
		$this->registry->game = $game;

		$this->show( 'game' );
	}
    
}; 

?>
