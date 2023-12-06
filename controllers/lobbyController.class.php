<?php 

class LobbyController extends BaseController
{
	public function menu() 
	{
		$this->registry->user_id = $_SESSION["user_id"];
		$this->registry->code_rand = $this->getRandomGameCode();

        $this->show( 'menu' );
	}

	public function lobby() 
	{
		if (!isset($_SESSION["code"]))
			exit('Game code not set: $_SESSION[code]');
		if (!isset($_SESSION["user_id"]))
			exit('User id not set: $_SESSION[user_id]');

		/*
		* Prilikom pokretanja igre postaviti $_SESSION[lobby] = false
		* Prilikom izlaska iz lobbija također
		*/
		$_SESSION["lobby"] = true;
		$gamesService = new GamesService();
		$game_code = $_SESSION["code"];
		$user_id = $_SESSION["user_id"];
		$game = $gamesService->getGameByCode($game_code);

		if (is_null($game))
			exit("Error, game with code ".$game_code." not found");

		$this->registry->user_id = $user_id;		
		$this->registry->game = $game;

        $this->show( 'lobby' );
	}

	public function create()
	{
		// Returns true if successfully created (and player is joined), otherwise false
		// Also returns true if the player is trying to refresh the lobby page
		if (!isset($_GET["code_rand"]))
			exit('Game code not set: $_GET[code]. It should be set to random letters when creating a game.');
		if (!isset($_SESSION["user_id"]))
			exit('User id not set: $_SESSION[user_id]');
		if (isset($_SESSION["code_rand"]) && $_SESSION["code_rand"]==$_GET["code_rand"])
			return True;

		$gamesService = new GamesService();
		$connectionsService = new ConnectionsService();

		$user_id = $_SESSION["user_id"];
		$game_code = $this->getRandomGameCode();
		$_SESSION["code"] = $game_code;
		$_SESSION["code_rand"] = $_GET["code_rand"];

		$game = $gamesService->addGame($game_code);
		if (is_null($game))
			return false;
		return $connectionsService->addConnection($user_id, $game->id);
	}

	private function getRandomGameCode() {
		// Todo: Provjeriti postoji li već taj kod i ako da, kreirati novi
		// Trebalo bi biti teško moguće jer je previše kombinacija
		$s = substr(str_shuffle(str_repeat("0123456789abcdefghijklmnopqrstuvwxyz", 5)), 0, 5);
		return $s;
	}

	public function join()
	{
		// Return true if successfully joined, otherwise false
		// Also returns true if the player is trying to refresh the lobby page
		if (!isset($_GET["code"]))
			exit('Game code not set: $_GET[code]');
		if (!isset($_SESSION["user_id"]))
			exit('User id not set: $_SESSION[user_id]');
		if (isset($_SESSION["code"]) && $_SESSION["code"]==$_GET["code"])
			return True;

		$gamesService = new GamesService();
		$connectionsService = new ConnectionsService();

		$game_code = strtolower($_GET["code"]);
		$user_id = $_SESSION["user_id"];
		$_SESSION["code"] = $game_code;

		$game = $gamesService->getGameByCode($game_code);		
		if (is_null($game))
			return false;
		if ($connectionsService->addConnection($user_id, $game->id)) {
			$gamesService->updateTimestamp($game->id);
			return true;
		}
		return false;

	}

	/*
	public function game()
	{
		if (!isset($_SESSION["code"]))
			exit('Game code not set: $_SESSION[code]');
		if (!isset($_SESSION["user_id"]))
			exit('User id not set: $_SESSION[user_id]');

		/*
		* Prilikom pokretanja igre postaviti $_SESSION[lobby] = false
		* Prilikom izlaska iz lobbija također
		
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
	}*/
}; 

?>
