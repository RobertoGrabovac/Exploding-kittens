<!DOCTYPE html>
<html>
<head>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="view/scripts/functions.js"></script>
  <script>
    const baseUrl = "https://rp2.studenti.math.hr<?php echo __SITE_URL?>/"
    const pollUrl = baseUrl + "webserver/wait.php";
    const setReadyUrl = baseUrl + "webserver/setReadyState.php";
    const gameFunctionsUrl = baseUrl + "webserver/gameFunctions.php";
    var game_id = <?php echo $game->id; ?>;
    var game_code = "<?php echo $game->code; ?>";
    var user_id = <?php echo $user_id; ?>;
  </script>
  <script src="view/scripts/lobby-script.js"></script>
  <title>Lobby</title>
  <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div class="general-div">
      <div class="game-code-container">
        <div class="game-code">
          <img src="view/images/game-code.png" class="game-code-img">
            <div id = "code-text" class="code-text">
              <?php echo $game->code; ?>
            </div>
            <div class="white-circle"></div>
        </div>
      </div>
      <div id="playerList" class="player-list">

      </div>
      <div class="button-lobby-container">
        <button id="readyBtn" class="button-42 button-ready">Ready</button>
      </div>
      <div class="button-exit-lobby-container">
        <form method="get" action="main.php">
          <input type="hidden" name="rt" value='menu'/>
          <button type="submit" id="exit" class="button-42 exit" role="button"> exit </button>
        </form>
      </div>
    </div>
  </body>
</html>